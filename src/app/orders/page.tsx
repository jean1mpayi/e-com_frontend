"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    Package,
    ChevronRight,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    ArrowLeft,
    ShoppingBag,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const STATUS_MAP: any = {
    'pending': { label: 'En attente', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' },
    'paid': { label: 'Payée', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
    'shipped': { label: 'Expédiée', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    'delivered': { label: 'Livrée', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
    'cancelled': { label: 'Annulée', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
};

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchAPI<any[]>("/orders/")
                .then(setOrders)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="container mx-auto px-4 py-8 mb-24 max-w-3xl space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/profile" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
                    Mes Commandes <span className="text-primary italic">.</span>
                </h1>
            </div>

            {orders.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-2xl text-center border border-dashed border-slate-200 dark:border-slate-800">
                    <ShoppingBag className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Aucune commande pour le moment</p>
                    <Link href="/">
                        <Button className="mt-6 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 font-black italic uppercase tracking-wider">Explorer la boutique</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const status = STATUS_MAP[order.status] || STATUS_MAP.pending;
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${status.bg} ${status.color}`}>
                                                <StatusIcon className="h-5 w-5" />
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Commande #{order.id}</p>
                                        </div>
                                        <p className="text-lg font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                                            {order.total_paid} € <span className="text-xs font-medium text-slate-400 normal-case tracking-normal ml-2">le {new Date(order.created_at).toLocaleDateString()}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>
                                            {status.label}
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors ml-auto md:ml-0" />
                                    </div>
                                </div>

                                {/* Sneak peek items */}
                                <div className="px-8 pb-8 flex -space-x-4 overflow-hidden">
                                    {order.items?.slice(0, 3).map((item: any, idx: number) => (
                                        <div key={idx} className="h-12 w-12 rounded-xl border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-50 dark:bg-slate-800">
                                            {/* Pour simplifier ici j'utilise une div kleur car on n'a pas forcément l'URL de l'image directement dans OrderItemSerializer simplifié sans nesting profond */}
                                            <div className="h-full w-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                📦
                                            </div>
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <div className="h-12 w-12 rounded-xl border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black italic">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </main>
    );
}
