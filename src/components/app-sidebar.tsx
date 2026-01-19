"use client"

import {
  IconLayoutDashboard,
  IconBox,
  IconTruck,
  IconMessage,
  IconWorld,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const data = {
    user: {
      name: user ? (user.first_name || user.username) : "Admin",
      email: user?.email || "",
      avatar: user?.profile?.avatar || "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconLayoutDashboard,
        isActive: true,
      },
      {
        title: "Stock",
        url: "/dashboard/stock",
        icon: IconBox,
      },
      {
        title: "Livraison",
        url: "#", // Placeholder
        icon: IconTruck,
      },
      {
        title: "Message",
        url: "#", // Placeholder
        icon: IconMessage,
      },
      {
        title: "Site",
        url: "/", // Back to main site
        icon: IconWorld,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Seller Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
