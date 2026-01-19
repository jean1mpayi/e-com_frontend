"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string | number;
    image: string;
    slug: string;
    category?: {
      name: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-background dark:bg-slate-900 p-0 m-0">
      {/* Zone Image avec lien vers le détail */}
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-xl">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          {/* Optionnel : Badge de catégorie sur l'image */}
          {product.category?.name && (
            <Badge className="absolute top-2 left-2 bg-background/80 dark:bg-slate-900/80 text-foreground hover:bg-background backdrop-blur-sm border-none text-[10px]">
              {product.category.name}
            </Badge>
          )}
        </div>
      </Link>

      {/* Contenu textuel */}
      <CardContent className="p-3 space-y-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-sm md:text-base text-foreground truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-foreground">
            {product.price} €
          </p>
        </div>
      </CardContent>

      {/* Action : Ajouter au panier */}
      <CardFooter className="py-2 px-[5] pt-0">
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}