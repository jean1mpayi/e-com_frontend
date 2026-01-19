"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/ProductSkeleton";
import { Search } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    slug: string;
    description: string;
    stock: number;
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchAPI<Product[]>(`/products/?search=${encodeURIComponent(query)}`);
                setProducts(data);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            getProducts();
        } else {
            setLoading(false);
        }
    }, [query]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-xl font-medium">Aucun produit trouvé pour "{query}"</p>
                <p className="text-sm">Essayez d'autres mots-clés ou vérifiez l'orthographe.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Résultats pour "{query}" ({products.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<div>Chargement...</div>}>
                <SearchResults />
            </Suspense>
        </main>
    );
}
