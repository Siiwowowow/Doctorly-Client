/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Users,
  Clock,
  Home,
  MessageSquare
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
import { useTranslations } from "next-intl"

const doctorItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Profile",
    url: "/doctor/profile",
    icon: User,
  },
  {
    title: "Schedule",
    url: "/doctor/schedule",
    icon: Clock,
  },
  {
    title: "Appointments",
    url: "/doctor/appointments",
    icon: CalendarDays,
  },
  {
    title: "Patients",
    url: "/doctor/patients",
    icon: Users,
  },
  {
    title: "Prescriptions",
    url: "/doctor/prescriptions",
    icon: Pill,
  },
  {
    title: "Medical Records",
    url: "/doctor/medical-records",
    icon: FileText,
  },
  {
    title: "Notifications",
    url: "/doctor/notifications",
    icon: Bell,
  },
  {
    title: "Messages",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Payments",
    url: "/doctor/payments",
    icon: CreditCard,
  },
]

export function DoctorSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const t = useTranslations("dashboardHeaders")
  const tCommon = useTranslations("common")

  const isActiveRoute = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname === url || pathname.startsWith(`${url}/`);
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <User size={20} />
          </div>
          <span className="truncate">{t("doctorDashboard")}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {doctorItems.map((item) => {
                const translationKey = item.title === 'My Profile' ? 'profile' : item.title.charAt(0).toLowerCase() + item.title.slice(1).replace(/ /g, '');
                const translatedTitle = t(translationKey as any) || tCommon(translationKey as any) || item.title;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActiveRoute(item.url)} tooltip={translatedTitle}>
                      <Link href={item.url} prefetch={true}>
                        <item.icon />
                        <span>{translatedTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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
                <span className="font-medium truncate">{user?.name || "Doctor"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
            <SidebarMenuButton onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut />
              <span>{tCommon("logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
