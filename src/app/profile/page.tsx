"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef } from "react";
import { useTheme } from "next-themes";
import {
    Settings,
    Package,
    Heart,
    ShieldCheck,
    LogOut,
    Moon,
    Sun,
    ChevronRight,
    Wallet,
    Mail,
    Lock,
    ArrowRight,
    Camera,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { fetchAPI } from "@/lib/api";

export default function ProfilePage() {
    const { user, loading, login, register, logout, refreshUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: ""
    });
    const [authLoading, setAuthLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            if (isLogin) {
                await login({ username: formData.email, password: formData.password });
                toast.success("Content de vous revoir !");
            } else {
                await register(formData);
                toast.success("Compte créé avec succès !");
            }
        } catch (err: any) {
            toast.error(err.message || "Une erreur est survenue");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            // Note: we need to handle FormData differently in fetchAPI or use direct fetch
            const token = localStorage.getItem("access_token");
            const res = await fetch("http://127.0.0.1:8000/api/user/upload-avatar/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Erreur upload");

            const data = await res.json();
            toast.success("Photo de profil mise à jour !");
            // Refresh user data using AuthContext
            await refreshUser();
        } catch (err) {
            toast.error("Échec de l'envoi de l'image");
        } finally {
            setUploadLoading(false);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const MenuItem = ({ icon: Icon, label, sublabel, color, onClick }: any) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                    <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</p>
                    {sublabel && <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{sublabel}</p>}
                </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
        </button>
    );

    if (!user) {
        return (
            <main className="container mx-auto px-4 py-10 max-w-md mb-24">
                <div className="text-center space-y-2 mb-10">
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
                        Ma Boutique <span className="text-primary italic">.</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Connectez-vous pour continuer</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
                >
                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="Prénom"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                    className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none"
                                />
                                <Input
                                    placeholder="Nom"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                    className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none"
                                />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Email ou Nom d'utilisateur"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="h-12 pl-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                type="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="h-12 pl-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={authLoading}
                            className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black italic uppercase tracking-wider text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                        >
                            {authLoading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
                            {!authLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        {isLogin ? "Nouveau ici ?" : "Déjà un compte ?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-primary font-black italic uppercase tracking-tighter"
                        >
                            {isLogin ? "Créer un compte" : "Connexion"}
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    const avatarUrl = user.profile?.avatar
        ? `http://127.0.0.1:8000${user.profile.avatar}`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name || user.username}`;

    return (
        <main className="container mx-auto px-4 py-8 mb-24 space-y-8 max-w-2xl animate-in fade-in duration-500">
            {/* Profile Header */}
            <section className="relative flex flex-col items-center text-center space-y-4 pt-4">
                <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-full blur-[2px] opacity-20 group-hover:opacity-40 transition duration-500"></div>

                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-background dark:border-slate-800 shadow-2xl bg-slate-100 dark:bg-slate-800 group">
                        {uploadLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 text-white">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all z-10 opacity-0 group-hover:opacity-100 text-white"
                            >
                                <Camera className="h-8 w-8" />
                            </button>
                        )}
                        <img
                            src={avatarUrl}
                            alt={user.username}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                        />
                    </div>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-2.5 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all text-primary"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
                        {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide flex items-center justify-center gap-2">
                        <Mail className="h-3 w-3" />
                        {user.email}
                    </p>
                </div>
            </section>

            {/* Stats Board - Real Data from Backend */}
            <section className="grid grid-cols-3 gap-3">
                {[
                    { icon: Package, label: "Commandes", value: user.orders_count || 0, color: "text-blue-500" },
                    { icon: Heart, label: "Favoris", value: user.wishlist_count || 0, color: "text-pink-500" },
                    { icon: Wallet, label: "Pièces", value: 0, color: "text-amber-500" } // Stat simulée
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl text-center space-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
                    >
                        <p className={`text-2xl font-black italic ${stat.color}`}>{stat.value}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </section>

            {/* Settings Grid */}
            <div className="grid gap-4">
                <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <MenuItem
                        icon={theme === 'dark' ? Sun : Moon}
                        label={`Thème ${theme === 'dark' ? 'Clair' : 'Sombre'}`}
                        sublabel="Changer l'apparence"
                        color="bg-indigo-500"
                        onClick={toggleTheme}
                    />
                </section>

                <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-50 dark:divide-slate-800">
                    {user.is_superuser && (
                        <MenuItem
                            icon={Settings}
                            label="Dashboard Vendeur"
                            sublabel="Gérer la boutique"
                            color="bg-primary"
                            onClick={() => router.push("/dashboard")}
                        />
                    )}
                    <MenuItem
                        icon={Package}
                        label="Historique des commandes"
                        sublabel="Suivre mes colis"
                        color="bg-blue-500"
                        onClick={() => router.push("/orders")}
                    />
                    <MenuItem
                        icon={Heart}
                        label="Ma Liste de souhaits"
                        sublabel="Produits sauvegardés"
                        color="bg-pink-500"
                    />
                    <MenuItem
                        icon={ShieldCheck}
                        label="Sécurité & Compte"
                        sublabel="Gérer mes accès"
                        color="bg-green-500"
                    />
                </section>
            </div>

            {/* Logout */}
            <Button
                onClick={logout}
                variant="ghost"
                className="w-full h-16 rounded-2xl text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 font-black italic uppercase tracking-wider text-sm gap-3 transition-all border border-dashed border-red-100 dark:border-red-900/30"
            >
                <LogOut className="h-5 w-5" />
                Déconnexion
            </Button>

            <p className="text-center text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] py-4">
                Ma Boutique Premium 💎
            </p>
        </main>
    );
}
