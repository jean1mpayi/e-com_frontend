// src/components/SimilarProducts.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";

export function SimilarProducts({ categoryId, currentProductId }: { categoryId: number, currentProductId: number }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const data = await fetchAPI<any[]>(`/products/?category_id=${categoryId}`);
        const results = Array.isArray(data) ? data : [];
        const filtered = results
          .filter((p: any) => p.id !== currentProductId)
          .slice(0, 4);

        setProducts(filtered);
      } catch (err) {
        console.error("Erreur SimilarProducts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId, currentProductId]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
        VOUS AIMEREZ AUSSI <span className="text-primary italic">.</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          [...Array(2)].map((_, i) => <ProductSkeleton key={i} />)
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}