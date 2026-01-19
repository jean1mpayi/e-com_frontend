import { Suspense } from "react";
import { fetchAPI } from "@/lib/api";
import { ProductSkeleton } from "@/components/ProductSkeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartButton } from "@/components/AddToCartButton";
import TrendingSection from "@/components/TrendingSection";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  slug: string;
  description: string;
  stock: number;
}

async function ProductList() {
  const products = await fetchAPI<Product[]>("/products/");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all p-0">
          <Link href={`/product/${product.slug}`}>
            <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-xl ">
              <img 
                src={product.image} 
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
          
          <CardContent className="p-3">
            <h3 className="font-medium text-sm md:text-base truncate">{product.name}</h3>
            <p className="text-primary font-bold text-lg">{product.price} €</p>
          </CardContent>
          
          <CardFooter className="p-3 pt-0">
            <AddToCartButton product={product} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-2 ">
      <TrendingSection />
      <hr className="border-muted/30 my-8" />
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold tracking-tight uppercase italic tracking-tighter">Nos Produits <span className="text-primary">.</span></h2>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        }>
          <ProductList />
        </Suspense>
      </section>
    </main>
  );
}