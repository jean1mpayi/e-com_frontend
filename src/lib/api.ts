const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const executeRequest = async (currentHeaders: Record<string, string>) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: currentHeaders,
      cache: 'no-store',
    });
  };

  let res = await executeRequest(getAuthHeaders());

  if (res.status === 401) {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("access_token", data.access);
            onRefreshed(data.access);
            isRefreshing = false;
          } else {
            throw new Error("Refresh failed");
          }
        } catch (err) {
          isRefreshing = false;
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          // On réessaie sans token pour les routes publiques
          res = await executeRequest({
            ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...(options.headers as Record<string, string>),
          });
        }
      } else {
        // Attendre que le refresh en cours se termine
        const newToken = await new Promise<string>((resolve) => {
          subscribeTokenRefresh((token) => resolve(token));
        });
        const headersWithNewToken = getAuthHeaders();
        headersWithNewToken["Authorization"] = `Bearer ${newToken}`;
        res = await executeRequest(headersWithNewToken);
      }

      // Si on a réussi à refresh, on rejoue l'appel initial
      if (isRefreshing === false && localStorage.getItem("access_token")) {
        res = await executeRequest(getAuthHeaders());
      }
    } else {
      // Pas de refresh token, on réessaie une fois sans Authorization
      // au cas où c'est une route publique
      res = await executeRequest({
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers as Record<string, string>),
      });
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.detail || errorData.message || `Erreur API: ${res.status}`;
    throw new Error(message);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json();
}