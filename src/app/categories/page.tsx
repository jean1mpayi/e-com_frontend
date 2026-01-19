"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/ProductSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    slug: string;
    description: string;
    stock: number;
    category: {
        name: string;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState<"price" | "-price" | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchAPI<Category[]>("/categories/");
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategory(data[0].slug);
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            if (!selectedCategory) return;
            setProductsLoading(true);
            try {
                let url = `/products/?category=${selectedCategory}`;
                if (sortOrder) {
                    url += `&ordering=${sortOrder}`;
                }
                const data = await fetchAPI<Product[]>(url);
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setProductsLoading(false);
            }
        };
        loadProducts();
    }, [selectedCategory, sortOrder]);

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8 space-y-8">
                <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
                <div className="flex flex-row gap-4 overflow-x-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex-shrink-0" />
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-6 md:py-10 space-y-8 mb-20">
            {/* Title & Sorting Buttons */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-foreground">
                        Explorer <span className="text-primary italic">.</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Découvrez notre collection par catégorie</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={sortOrder === "price" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "price" ? null : "price")}
                        className="rounded-full px-4 h-9 gap-2 transition-all"
                    >
                        <ArrowUpWideNarrow className="h-4 w-4" />
                        <span className="text-xs font-bold whitespace-nowrap">Prix Croissant</span>
                    </Button>
                    <Button
                        variant={sortOrder === "-price" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "-price" ? null : "-price")}
                        className="rounded-full px-4 h-9 gap-2 transition-all"
                    >
                        <ArrowDownWideNarrow className="h-4 w-4" />
                        <span className="text-xs font-bold whitespace-nowrap">Prix Décroissant</span>
                    </Button>
                </div>
            </div>

            {/* Categories Row (Trending style) */}
            <section className="space-y-4">
                <div className="flex flex-row gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`flex-shrink-0 px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 border-2 ${selectedCategory === cat.slug
                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                : "bg-background border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Results Section */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={(selectedCategory || "all") + (sortOrder || "none")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="space-y-6"
                >
                    {productsLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-full mb-6 text-slate-200 dark:text-slate-800">
                                <Tag className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Aucun produit trouvé</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-2 italic">
                                La catégorie <span className="text-primary font-bold">"{selectedCategory}"</span> ne contient pas encore d'articles. Revenez bientôt !
                            </p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
