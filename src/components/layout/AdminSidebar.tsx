/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UserRound,
  CalendarDays,
  Activity,
  Clock,
  FileText,
  Pill,
  CreditCard,
  Bell,
  LogOut,
  ShieldAlert,
  Home,
  UserCheck
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

const adminItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Doctor Applications",
    url: "/admin/doctor-applications",
    icon: UserCheck,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Doctors",
    url: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    title: "Patients",
    url: "/admin/patients",
    icon: UserRound,
  },
  {
    title: "Appointments",
    url: "/admin/appointments",
    icon: CalendarDays,
  },
  {
    title: "Specialties",
    url: "/admin/specialties",
    icon: Activity,
  },
  {
    title: "Schedules",
    url: "/admin/schedules",
    icon: Clock,
  },
  {
    title: "Medical Records",
    url: "/admin/medical-records",
    icon: FileText,
  },
  {
    title: "Prescriptions",
    url: "/admin/prescriptions",
    icon: Pill,
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
  },
]

export function AdminSidebar() {
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
            <ShieldAlert size={20} />
          </div>
          <span className="truncate">{t("adminDashboard")}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administrative</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const translationKey = item.title.charAt(0).toLowerCase() + item.title.slice(1).replace(/ /g, '')
                const translatedTitle = t(translationKey as any) || tCommon(translationKey as any) || item.title

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
                <ShieldAlert size={24} />
              </div>
              <div className="flex flex-col overflow-hidden text-sm">
                <span className="font-medium truncate">{user?.name || "Admin"}</span>
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
