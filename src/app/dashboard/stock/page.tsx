"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { fetchAPI } from "@/lib/api"
import { DataTable } from "@/components/data-table" // We will reuse the UI but maybe bypass its internal state if we do server-side
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconSearch, IconSortAscending, IconSortDescending, IconPlus } from "@tabler/icons-react"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { toast } from "sonner"
import { ProductSheet } from "@/components/product-sheet"
import { CategorySheet } from "@/components/category-sheet"

export default function DashboardStockPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [products, setProducts] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [search, setSearch] = React.useState("")
    const [ordering, setOrdering] = React.useState("created_at") // Default sort
    const [categories, setCategories] = React.useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
    const [editingProduct, setEditingProduct] = React.useState<any>(null)

    // Fetch Categories for filter
    const fetchCategories = () => {
        fetchAPI("/categories/").then((data: any) => setCategories(data)).catch(console.error)
    }

    React.useEffect(() => {
        fetchCategories()
    }, [])

    // Fetch Products with params
    React.useEffect(() => {
        if (!authLoading && user?.is_superuser) {
            fetchData()
        }
    }, [user, authLoading, search, ordering, selectedCategory])

    const onProductAdded = () => {
        fetchData()
    }

    const onCategoryAdded = () => {
        fetchCategories()
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            let url = `/products/?ordering=${ordering}`
            if (search) url += `&search=${search}`
            if (selectedCategory && selectedCategory !== "all") url += `&category=${selectedCategory}`

            console.log("Fetching URL:", url)
            const data: any = await fetchAPI(url)
            console.log("Stock Data received:", data)

            let productList: any[] = [];

            if (Array.isArray(data)) {
                productList = data;
            } else if (data.results && Array.isArray(data.results)) {
                console.log("Using paginated results")
                productList = data.results;
            } else {
                console.error("Unknown data format:", data)
                setProducts([])
                return;
            }

            // Map products to schema
            const mapped = productList.map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                stock: p.stock,
                image: p.image
                    ? (p.image.startsWith("http") ? p.image : `http://127.0.0.1:8000${p.image}`)
                    : null,
                category: p.category_details?.name || "N/A",
                slug: p.slug
            }))
            setProducts(mapped)

        } catch (err) {
            console.error(err)
            toast.error("Erreur lors du chargement des produits")
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || (!user || !user.is_superuser)) return null

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Gestion du Stock ({products.length})</h1>
                            <p className="text-muted-foreground text-sm">Gérez votre inventaire, ajoutez des produits et suivez les tendances.</p>
                        </div>
                        <div className="flex gap-2">
                            <CategorySheet onSuccess={onCategoryAdded} />
                            <ProductSheet onSuccess={onProductAdded} />
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center bg-muted/30 p-4 rounded-lg border">
                        <div className="relative flex-1">
                            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Rechercher (nom, description)..."
                                className="pl-8 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px] bg-background">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les catégories</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={ordering} onValueChange={setOrdering}>
                                <SelectTrigger className="w-[180px] bg-background">
                                    <SelectValue placeholder="Trier par" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">Date d'ajout (Asc)</SelectItem>
                                    <SelectItem value="-created_at">Date d'ajout (Desc)</SelectItem>
                                    <SelectItem value="price">Prix (Croissant)</SelectItem>
                                    <SelectItem value="-price">Prix (Décroissant)</SelectItem>
                                    <SelectItem value="name">Nom (A-Z)</SelectItem>
                                    <SelectItem value="-name">Nom (Z-A)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex-1 rounded-lg border bg-background shadow-sm">
                        {/* Reusing DataTable but passing filtered data. 
                     Note: DataTable currently has its own header/pagination logic. 
                     For strictly 'server-side' driven page, we might just want the table part. 
                     But passing 'data' prop updates the table content. 
                 */}
                        {/* Reusing DataTable but passing filtered data. */}
                        <DataTable
                            data={products}
                            onEdit={(p) => setEditingProduct(p)}
                            onDelete={async (p) => {
                                if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
                                    try {
                                        const identifier = p.slug;
                                        if (!identifier) {
                                            toast.error("Erreur: Identifiant (slug) manquant")
                                            return
                                        }
                                        await fetchAPI(`/products/${identifier}/`, { method: "DELETE" })
                                        toast.success("Produit supprimé")
                                        fetchData()
                                    } catch (e) {
                                        console.error(e)
                                        toast.error("Erreur lors de la suppression")
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Edit Sheet Controlled */}
                    {editingProduct && (
                        <ProductSheet
                            product={editingProduct}
                            open={!!editingProduct}
                            onOpenChange={(open) => !open && setEditingProduct(null)}
                            onSuccess={() => {
                                fetchData()
                                setEditingProduct(null)
                            }}
                            trigger={<></>} // Hidden trigger
                        />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
