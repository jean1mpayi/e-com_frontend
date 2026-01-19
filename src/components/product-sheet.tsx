"use client"

import * as React from "react"
import { toast } from "sonner"
import { fetchAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IconPlus, IconLoader } from "@tabler/icons-react"

interface Category {
    id: number;
    name: string;
    slug: string;
}

export function ProductSheet({
    product,
    onSuccess,
    trigger,
    open,
    onOpenChange
}: {
    product?: any,
    onSuccess?: () => void,
    trigger?: React.ReactNode,
    open?: boolean,
    onOpenChange?: (open: boolean) => void
}) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = open !== undefined
    const finalOpen = isControlled ? open : internalOpen
    const setFinalOpen = isControlled ? onOpenChange : setInternalOpen

    const [loading, setLoading] = React.useState(false)
    const [categories, setCategories] = React.useState<Category[]>([])

    // Form State
    const [name, setName] = React.useState(product?.name || "")
    const [description, setDescription] = React.useState(product?.description || "")
    const [price, setPrice] = React.useState(product?.price || "")
    const [stock, setStock] = React.useState(product?.stock || "")
    // Handle category ID vs Name. If product exists, we might need its category ID. 
    // Assuming backend serializer now provides 'category' as ID or we have it. 
    // If product has nested category, we need to map it. 
    const [category, setCategory] = React.useState(product?.category?.toString() || "")
    const [image, setImage] = React.useState<File | null>(null)

    React.useEffect(() => {
        if (finalOpen) {
            fetchCategories()
            if (product) {
                setName(product.name)
                setDescription(product.description)
                setPrice(product.price)
                setStock(product.stock)
                // If product.category is an object (from reading), retrieve ID. 
                // If it's just ID (from some contexts), use it.
                // Our updated serializer sends 'category' as ID (write) but 'category_details' (read).
                // But wait, ProductSerializer for read (GET) has 'category' as ID? 
                // Correct: 'category' is PrimaryKeyRelatedField (write), so response might behave differently depending on view/serializer.
                // Let's rely on what we have. 
                // If product came from DataTable, it was mapped. 
                // We should pass raw product object if possible.
                // Let's assume passed product has category ID in 'category'. 
                // If not, we might fail to pre-select. 
                const catId = product.category?.id || product.category
                setCategory(catId?.toString() || "")
            }
        }
    }, [finalOpen, product])

    const fetchCategories = async () => {
        try {
            const data = await fetchAPI<Category[]>("/categories/")
            setCategories(data)
        } catch (err) {
            console.error("Failed to fetch categories", err)
            toast.error("Erreur de chargement des catégories")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!category) {
            toast.error("Veuillez sélectionner une catégorie")
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("stock", stock)
            formData.append("category", category)

            if (image) {
                formData.append("image", image)
            }

            const url = product ? `/products/${product.slug}/` : "/products/"
            const method = product ? "PATCH" : "POST"

            await fetchAPI(url, {
                method: method,
                body: formData,
            })

            toast.success(product ? "Produit modifié !" : "Produit ajouté avec succès !")
            setFinalOpen?.(false)
            if (!product) resetForm() // Only reset on create
            if (onSuccess) onSuccess()
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Erreur")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setName("")
        setDescription("")
        setPrice("")
        setStock("")
        setCategory("")
        setImage(null)
    }

    return (
        <Sheet open={finalOpen} onOpenChange={setFinalOpen}>
            <SheetTrigger asChild>
                {trigger || (
                    <Button>
                        <IconPlus className="mr-2 size-4" />
                        Ajouter un produit
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>{product ? "Modifier le produit" : "Nouveau Produit"}</SheetTitle>
                    <SheetDescription>
                        {product ? "Modifiez les informations du produit." : "Ajoutez un nouveau produit à votre catalogue. Remplissez tous les champs nécessaires."}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nom du produit</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Basket Nike Air" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            placeholder="Description détaillée..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Prix (€)</Label>
                            <Input id="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.00" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock initial</Label>
                            <Input id="stock" type="number" value={stock} onChange={e => setStock(e.target.value)} required placeholder="0" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[0.8rem] text-muted-foreground">
                            Le produit doit être lié à une catégorie existante.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline" type="button">Annuler</Button>
                        </SheetClose>
                        <Button type="submit" disabled={loading}>
                            {loading && <IconLoader className="mr-2 size-4 animate-spin" />}
                            Enregistrer
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
