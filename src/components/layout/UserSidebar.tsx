"use client"

import * as React from "react"
import {
  LayoutDashboard,
  User,
  CalendarDays,
  FileText,
  Pill,
  Bell,
  CreditCard,
  LogOut,
  Home,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/AuthProvider"
import Link from "next/link"
import { usePathname } from "next/navigation"

const userItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Profile",
    url: "/user/profile",
    icon: User,
  },
  {
    title: "Appointments",
    url: "/user/appointments",
    icon: CalendarDays,
  },
  {
    title: "Medical Records",
    url: "/user/medical-records",
    icon: FileText,
  },
  {
    title: "Prescriptions",
    url: "/user/prescriptions",
    icon: Pill,
  },
  {
    title: "Notifications",
    url: "/user/notifications",
    icon: Bell,
  },
  {
    title: "Payments",
    url: "/user/payments",
    icon: CreditCard,
  },
]

export function UserSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <User size={20} />
          </div>
          <span className="truncate">Patient Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <User size={24} />
              </div>
              <div className="flex flex-col overflow-hidden text-sm">
                <span className="font-medium truncate">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
            <SidebarMenuButton onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
