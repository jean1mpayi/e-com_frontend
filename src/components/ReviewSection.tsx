"use client";

import { Star } from "lucide-react";

interface Review {
    id: number;
    user: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewSectionProps {
    reviews: Review[];
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
    return (
        <section className="mt-12 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-2xl font-bold">Avis Clients</h3>
                <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">
                        {reviews.length > 0
                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                            : "0.0"}
                    </span>
                    <span className="text-muted-foreground text-sm">({reviews.length} avis)</span>
                </div>
            </div>

            {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun avis pour ce produit pour le moment.</p>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-background dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-bold text-lg">{review.user}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(review.created_at).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
