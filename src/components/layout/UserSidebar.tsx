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
  Home,
  MessageSquare,
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
    title: "Messages",
    url: "/chat",
    icon: MessageSquare,
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
];

export function UserSidebar() {
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

  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="p-0">
        <DashboardSidebarHeader title={t("patientDashboard")} icon={User} />
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2">Patient Portal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => {
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
                  <AvatarImage src={user?.uploadedImage || user?.image || ""} alt={user?.name || "Patient"} />
                  <AvatarFallback className="bg-doctorly-primary/10 text-doctorly-primary font-bold text-xs">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="font-semibold text-xs text-foreground truncate">{user?.name || "Patient"}</span>
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
