"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, MessageSquare, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navItems = [
    { icon: Home, label: "Accueil", href: "/" },
    { icon: Grid, label: "Catégorie", href: "/categories" },
    { icon: MessageSquare, label: "Discuter", href: "/chat" },
    { icon: ShoppingCart, label: "Panier", href: "/cart", showBadge: true },
    { icon: User, label: "Profil", href: "/profile" },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { totalItems } = useCart();

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-full shadow-lg shadow-slate-200/50 dark:shadow-none flex items-center gap-2 pointer-events-auto max-w-[90vw] overflow-x-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-1 group min-w-[60px]">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ y: -2 }}
                                className={`p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-y-[-4px]" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.showBadge && totalItems > 0 && (
                                    <span className="absolute top-0 right-1 bg-red-500 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold border border-white dark:border-slate-900">
                                        {totalItems}
                                    </span>
                                )}
                            </motion.div>

                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-active"
                                    className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full opacity-0"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
