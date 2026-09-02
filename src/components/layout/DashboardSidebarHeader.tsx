"use client";

import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Activity, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface DashboardSidebarHeaderProps {
  title: string;
  icon: React.ElementType;
}

export function DashboardSidebarHeader({ title, icon: Icon }: DashboardSidebarHeaderProps) {
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const t = useTranslations("common");

  return (
    <div className="p-3 sm:p-4 border-b border-border/50 flex items-center justify-between gap-2 h-16 shrink-0">
      {/* Brand & Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <Link
          href="/"
          className="flex size-8.5 shrink-0 items-center justify-center rounded-xl bg-doctorly-primary text-white shadow-md shadow-doctorly-primary/20"
          title="Doctorly Healthcare"
        >
          <Activity className="size-4.5" />
        </Link>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-extrabold text-sm text-foreground tracking-tight truncate">
              Doctorly
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold truncate flex items-center gap-1">
              <Icon className="size-3 text-doctorly-primary inline" />
              {title}
            </span>
          </div>
        )}
      </div>

      {/* Actions: Mobile Close Button or Desktop Toggle */}
      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(false)}
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label={t("close") || "Close sidebar"}
        >
          <X className="size-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="size-8 rounded-lg text-muted-foreground hover:text-doctorly-primary hover:bg-doctorly-primary/10 transition-colors shrink-0"
          title={isCollapsed ? (t("expandSidebar") || "Expand sidebar") : (t("collapseSidebar") || "Collapse sidebar")}
          aria-label={isCollapsed ? (t("expandSidebar") || "Expand sidebar") : (t("collapseSidebar") || "Collapse sidebar")}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      )}
    </div>
  );
}
