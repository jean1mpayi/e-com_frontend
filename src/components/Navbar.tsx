"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 border-b px-4 md:px-8 py-3 flex justify-between items-center bg-background/80 backdrop-blur-md z-50 transition-colors"
      >
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold italic tracking-tighter uppercase">Ma Boutique</h1>
        </Link>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.form
                key="search-form"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                onSubmit={handleSearch}
                className="flex items-center gap-2"
              >
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-32 md:w-64 bg-slate-100 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-primary"
                  autoFocus
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart" aria-label="Voir le panier">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white dark:border-slate-900 animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* Profile Avatar */}
          <Link href="/profile" className="ml-1">
            <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-primary transition-all">
              {user ? (
                <img
                  src={user.profile?.avatar
                    ? `http://127.0.0.1:8000${user.profile.avatar}`
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name || user.username}`
                  }
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-slate-400" />
              )}
            </div>
          </Link>
        </div>
      </motion.nav>
      <div className="h-16" />
    </>
  );
}