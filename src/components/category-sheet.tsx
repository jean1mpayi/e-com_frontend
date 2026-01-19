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
import { IconCategory, IconLoader, IconPlus } from "@tabler/icons-react"

export function CategorySheet({ onSuccess }: { onSuccess?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [name, setName] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await fetchAPI("/categories/", {
                method: "POST",
                body: JSON.stringify({ name }),
            })
            toast.success("Catégorie ajoutée !")
            setOpen(false)
            setName("")
            if (onSuccess) onSuccess()
        } catch (err: any) {
            console.error(err)
            toast.error("Erreur ajout catégorie")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <IconPlus className="mr-2 size-4" />
                    Ajouter Catégorie
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Nouvelle Catégorie</SheetTitle>
                    <SheetDescription>
                        Créez une nouvelle catégorie pour organiser vos produits.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="cat-name">Nom de la catégorie</Label>
                        <Input id="cat-name" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Sports" />
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
