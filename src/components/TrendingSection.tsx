"use client";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function TrendingSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI("/products/trending/")
      .then((data: any) => setProducts(data))
      .catch((err) => console.error("Erreur tendances:", err))
      .finally(() => setLoading(false));
  }, []);

  // Skeleton interne pour ne pas casser le layout pendant le fetch
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-row gap-4 overflow-x-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-32 md:w-40 rounded-2xl flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-2">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Tendances <span className="text-xl">🔥</span>
      </h2>
      
      {/* Scroll horizontal fluide */}
      <div className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {products.map((product) => (
          <Link 
            href={`/product/${product.slug}`} 
            key={product.id} 
            className="relative flex-shrink-0 w-32 md:w-40 aspect-[3/4] rounded-2xl overflow-hidden group shadow-sm"
          >
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-3 w-full">
              <h3 className="text-white text-xs md:text-sm font-semibold leading-tight line-clamp-2">
                {product.name}
              </h3>
              <p className="text-white/80 text-[10px] font-bold mt-1">{product.price} €</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}