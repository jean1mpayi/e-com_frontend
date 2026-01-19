"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");

    return (
        <>
            {!isDashboard && <Navbar />}
            <div className={!isDashboard ? "min-h-screen" : ""}>
                {children}
            </div>
            {!isDashboard && <BottomNav />}
        </>
    );
}
