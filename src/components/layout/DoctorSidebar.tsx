/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
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
  MessageSquare,
  Stethoscope,
} from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { DashboardSidebarHeader } from "./DashboardSidebarHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
];

export function DoctorSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const t = useTranslations("dashboardHeaders");
  const tCommon = useTranslations("common");

  const isActiveRoute = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "D";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="p-0">
        <DashboardSidebarHeader title={t("doctorDashboard")} icon={Stethoscope} />
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2">Clinical Portal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {doctorItems.map((item) => {
                const translationKey =
                  item.title === "My Profile"
                    ? "profile"
                    : item.title === "Messages"
                    ? "chat"
                    : item.title.charAt(0).toLowerCase() + item.title.slice(1).replace(/ /g, "");
                const translatedTitle =
                  t(translationKey as any) || tCommon(translationKey as any) || item.title;
                const active = isActiveRoute(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={translatedTitle}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                      }}
                      className={`rounded-xl font-medium transition-colors ${active ? "bg-doctorly-primary/10 text-doctorly-primary font-semibold" : ""}`}
                    >
                      <Link href={item.url} prefetch={true} className="flex items-center gap-3">
                        <item.icon className={`size-4.5 shrink-0 ${active ? "text-doctorly-primary" : "text-muted-foreground"}`} />
                        <span>{translatedTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/50 mt-auto bg-background/50">
        <SidebarMenu>
          <SidebarMenuItem>
            {!isCollapsed ? (
              <div className="flex items-center gap-3 p-2 mb-2 rounded-xl bg-muted/40 border border-border/40">
                <Avatar className="size-8.5 border border-border shrink-0">
                  <AvatarImage src={user?.uploadedImage || user?.image || ""} alt={user?.name || "Doctor"} />
                  <AvatarFallback className="bg-doctorly-primary/10 text-doctorly-primary font-bold text-xs">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="font-semibold text-xs text-foreground truncate">{user?.name || "Doctor"}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
                </div>
              </div>
            ) : null}

            <SidebarMenuButton
              onClick={() => {
                if (isMobile) setOpenMobile(false);
                logout();
              }}
              tooltip={tCommon("logout") || "Log Out"}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl font-medium"
            >
              <LogOut className="size-4 shrink-0 text-destructive" />
              <span>{tCommon("logout") || "Log Out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
