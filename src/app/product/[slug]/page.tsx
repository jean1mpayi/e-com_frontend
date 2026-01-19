import { fetchAPI } from "@/lib/api";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { SimilarProducts } from "@/components/SimilarProducts";
import { ReviewSection } from "@/components/ReviewSection";

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) return notFound();

  try {
    const product = await fetchAPI<any>(`/products/${slug}/`);

    if (!product) return notFound();

    return (
      <main className="mx-auto px-4 py-2 space-y-4 max-w-4xl mb-24 transition-colors">
        {/* Main Product Card - Ultra Compact for Mobile Peek */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center">
          <figure className="w-full h-[180px] md:h-[350px] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </figure>

          <div className="w-full p-4 md:p-8 space-y-3">
            <div className="space-y-1">
              <div className="inline-block px-3 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">
                {product.category.name}
              </div>
              <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white italic">
                {product.price} €
              </p>
            </div>

            <div className="h-px w-full bg-slate-50 dark:bg-slate-800" />

            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-medium leading-relaxed line-clamp-2">
              {product.description}
            </p>

            <div className="pt-1 mt-2 flex justify-end">

              <AddToCartButton product={product} />

            </div>
          </div>
        </div>

        {/* Similar Products Peek Section - Ultra tight */}
        <section className="px-1">
          <SimilarProducts
            categoryId={product.category.id}
            currentProductId={product.id}
          />
        </section>

        {/* Reviews Section */}
        <section className="px-1 pt-4 border-t border-slate-100 dark:border-slate-800">
          <ReviewSection reviews={product.reviews || []} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Erreur page détail:", error);
    return notFound();
  }
}