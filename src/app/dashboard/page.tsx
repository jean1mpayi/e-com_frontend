"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable, schema } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { useAuth } from "@/context/AuthContext"
import { fetchAPI } from "@/lib/api"
import { z } from "zod"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: number;
  stock: number;
  slug: string;
}

export default function DashboardPage() {
  const { setTheme } = useTheme()
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = React.useState<any>(null);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<z.infer<typeof schema>[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/profile");
      } else if (!user.is_superuser) {
        router.push("/profile");
      } else {
        fetchData();
      }
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const [statsData, chartDataRes, productsData] = await Promise.all([
        fetchAPI("/dashboard/stats/"),
        fetchAPI("/dashboard/chart/"),
        fetchAPI<Product[]>("/products/top-selling/")
      ]);

      console.log("Stats received:", statsData);
      setStats(statsData);
      setChartData(chartDataRes as any[]);

      // Map products to schema
      const mappedProducts = (productsData as Product[]).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock || 0,
        image: p.image,
        category: "Default" // Backend doesn't send category name yet
      }));
      setProducts(mappedProducts);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    // Keep the layout while loading to avoid jump
    return (
      <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center">
            Chargement des données...
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!user || !user.is_superuser) return null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={chartData} />
              </div>
              <DataTable data={products} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
