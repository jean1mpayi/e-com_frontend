"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertCircle, ShoppingBag, MapPin, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const orderData = {
      first_name: user.first_name || user.username || "Client",
      last_name: user.last_name || "Nom",
      email: user.email,
      address: formData.get("address"),
      postal_code: formData.get("postal_code"),
      city: formData.get("city"),
      total_paid: Number(totalPrice.toFixed(2)),
      items: cart.map(item => ({
        product: item.id,
        price: Number(item.price.toFixed(2)),
        quantity: item.quantity
      }))
    };

    try {
      await fetchAPI("/orders/", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      toast.success("Commande confirmée !", {
        description: "Votre commande a été enregistrée avec succès.",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });

      clearCart();
      router.push("/profile"); // Rediriger vers le profil pour voir l'historique

    } catch (error: any) {
      toast.error("Échec de la commande", {
        description: error.message || "Une erreur est survenue.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-2xl max-w-md mx-auto border border-dashed border-slate-200 dark:border-slate-800">
          <ShoppingBag className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Connexion requise</h2>
          <p className="text-slate-500 mb-8 font-medium">Vous devez être connecté pour passer une commande.</p>
          <Button onClick={() => router.push("/profile")} className="w-full h-14 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-widest">
            Se connecter / S'inscrire
          </Button>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold">Votre panier est vide</h2>
        <Button onClick={() => router.push("/")} className="mt-4">Retourner à la boutique</Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-5xl mb-24 transition-all">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">
          Finaliser ma commande
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          {/* Section Identité (Invisible mais portée par le context) */}
          <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-slate-400">
              <UserIcon className="h-5 w-5" />
              <p className="text-xs font-black uppercase tracking-widest">Informations Client</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                {user.first_name} {user.last_name}
              </div>
              <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm text-slate-500">
                {user.email}
              </div>
            </div>
          </section>

          {/* Section Livraison */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Adresse de livraison</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Adresse complète</label>
                <Input name="address" placeholder="123 rue de la Paix" required className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none px-6" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Code Postal</label>
                  <Input name="postal_code" placeholder="75000" required className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none px-6" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Ville</label>
                  <Input name="city" placeholder="Paris" required className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none px-6" />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-20 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl font-black italic uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Validation...
              </>
            ) : (
              `Confirmer • ${totalPrice.toFixed(2)} €`
            )}
          </Button>
        </form>

        {/* Panier Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-slate-50 dark:bg-slate-900 border-none rounded-2xl overflow-hidden shadow-none">
            <CardHeader className="bg-slate-100 dark:bg-slate-800 p-8">
              <CardTitle className="text-xl font-black italic uppercase italic tracking-tighter">Ma Sélection</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="max-h-[400px] overflow-auto pr-4 space-y-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700 p-1">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-black italic uppercase tracking-tight line-clamp-1">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantité : {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black italic">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t-2 border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>Sous-total</span>
                  <span className="text-slate-900 dark:text-white">{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>Livraison</span>
                  <span className="text-green-500">Gratuite 🚀</span>
                </div>
                <div className="flex justify-between pt-4 text-3xl font-black italic tracking-tighter uppercase">
                  <span>Total</span>
                  <span className="text-primary">{totalPrice.toFixed(2)} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}