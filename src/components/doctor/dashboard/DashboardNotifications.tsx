/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, Clock, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/providers/NotificationProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
  getNotificationMeta,
  getSafeNotificationContent,
  getNotificationHref,
  formatNotificationTime,
} from "@/components/notifications/notificationHelpers";

export function DashboardNotifications({ notifications: initialNotifications }: { notifications?: any[] }) {
  const t = useTranslations("doctorDashboard");
  const router = useRouter();
  const { user } = useAuth();
  const {
    notifications: liveNotifications,
    markAsRead,
    removeNotification,
  } = useNotifications();

  const currentNotifications = liveNotifications.length > 0
    ? liveNotifications
    : initialNotifications || [];

  const recentNotifications = currentNotifications.slice(0, 5);

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    const href = getNotificationHref(notification, user?.role || "DOCTOR");
    router.push(href);
  };

  return (
    <Card className="h-full border-border/70 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
          <Bell className="size-4 text-doctorly-primary" />
          <span>{t("notificationsTitle")}</span>
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-xs text-doctorly-primary hover:text-doctorly-primary/80">
          <Link href="/doctor/notifications">{t("viewAll")}</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border rounded-2xl border-dashed bg-muted/10">
            <Bell className="size-8 mb-2 opacity-30 text-muted-foreground" />
            <p className="text-xs font-medium">{t("emptyStates.noNotifications")}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentNotifications.map((notification) => {
              const meta = getNotificationMeta(notification.type);
              const safe = getSafeNotificationContent(notification, user?.role || "DOCTOR");
              const isUnread = !notification.isRead;

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isUnread
                      ? "bg-doctorly-primary/5 border-doctorly-primary/30 hover:bg-doctorly-primary/10"
                      : "bg-card border-border/60 hover:bg-muted/30"
                  }`}
                >
                  {/* Left Icon */}
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center shrink-0 border border-border/50 shadow-2xs mt-0.5 ${meta.iconBgClass}`}
                  >
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-12">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className={`text-xs truncate ${isUnread ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                        {safe.title}
                      </p>
                      {isUnread && (
                        <span className="size-1.5 rounded-full bg-doctorly-primary shrink-0" />
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                      {safe.message}
                    </p>

                    <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                      <Clock className="size-2.5" />
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Actions (Mark as Read / Delete) */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {isUnread && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="p-1 rounded-md text-muted-foreground hover:text-doctorly-primary hover:bg-doctorly-primary/10 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="p-1 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

