"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-2xl max-w-md mx-auto border border-dashed border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8">Il semblerait que vous n'ayez pas encore fait votre choix.</p>
        <Button asChild>
          <Link href="/">Retour à la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Votre Panier ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-primary font-bold">{item.price} €</p>
                </div>

                {/* Contrôle de quantité */}
                <div className="flex items-center gap-2 border rounded-md p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => addToCart(item)}
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold border-b pb-4">Résumé</h2>
              <div className="flex justify-between text-lg">
                <span>Sous-total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-xl font-bold">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <Button className="w-full mt-4 py-6 text-lg group" asChild>
                <Link href="/checkout">
                  Passer à la commande
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}