"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
    profile?: {
        avatar: string | null;
    };
    orders_count: number;
    wishlist_count: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userData = await fetchAPI<User>("/user/profile/");
                setUser(userData);
            } catch (err) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = async (credentials: any) => {
        const data: any = await fetchAPI("/token/", {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        const userData = await fetchAPI<User>("/user/profile/");
        setUser(userData);
    };

    const register = async (regData: any) => {
        await fetchAPI("/user/register/", {
            method: "POST",
            body: JSON.stringify(regData),
        });

        // Auto-login after registration
        await login({ username: regData.email, password: regData.password });
    };

    const refreshUser = async () => {
        try {
            const userData = await fetchAPI<User>("/user/profile/");
            setUser(userData);
        } catch (err) {
            console.error("Failed to refresh user:", err);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
