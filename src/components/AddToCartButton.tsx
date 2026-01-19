"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, ShoppingCart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);

    setTimeout(() => {
      addToCart(product);

      toast.success(`${product.name} ajouté !`, {
        description: "Le produit a été ajouté à votre panier avec succès.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        action: {
          label: "Voir Panier",
          onClick: () => router.push("/cart"),
        },
      });

      setIsAdding(false);
    }, 400);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.stock <= 0 || isAdding}
      className="w-full h-14 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-lg"
    >
      {isAdding ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Ajout...</span>
        </>
      ) : product.stock > 0 ? (
        <>
          <ShoppingCart className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wide">
            ajouter au panier
          </span>
        </>
      ) : (
        "Rupture de stock"
      )}
    </Button>
  );
}