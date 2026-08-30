/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/providers/NotificationProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  X,
  Clock,
  Sparkles,
  Inbox,
  Filter,
  ExternalLink,
} from "lucide-react";
import {
  getNotificationMeta,
  getSafeNotificationContent,
  getNotificationHref,
  formatNotificationTime,
} from "./notificationHelpers";

interface NotificationCenterProps {
  title?: string;
  subtitle?: string;
}

export function NotificationCenter({
  title = "Notifications",
  subtitle = "Stay updated on your consultations, prescriptions, payments, and account activity.",
}: NotificationCenterProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllRead,
    fetchNotifications,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");

  const readCount = notifications.filter((n) => n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true;
  });

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    const href = getNotificationHref(notification, user?.role);
    router.push(href);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-xs">
                <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNotifications()}
            disabled={loading}
            className="rounded-xl border-border/60 shadow-xs"
            title="Refresh notifications"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => markAllAsRead()}
              className="rounded-xl bg-doctorly-primary text-white hover:bg-doctorly-primary/90 shadow-sm"
            >
              <CheckCheck className="size-3.5 mr-1.5" />
              Mark all as read
            </Button>
          )}

          {readCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearAllRead()}
              className="rounded-xl border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors shadow-xs"
            >
              <Trash2 className="size-3.5 mr-1.5" />
              Clear read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border/50 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground font-bold">
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("unread")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "unread"
                ? "bg-background text-doctorly-primary shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 ? (
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                {unreadCount}
              </span>
            ) : (
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground font-bold">
                0
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("read")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "read"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Read</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground font-bold">
              {readCount}
            </span>
          </button>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Filter className="size-3.5" />
          <span>
            Showing {filteredNotifications.length} of {notifications.length}
          </span>
        </div>
      </div>

      {/* Notifications Cards List */}
      {filteredNotifications.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/10 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted/60 p-6 shadow-inner text-muted-foreground/60 mb-4">
              {activeTab === "unread" ? <Sparkles className="size-10 text-doctorly-primary" /> : <Inbox className="size-10" />}
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {activeTab === "unread"
                ? "No unread notifications"
                : activeTab === "read"
                ? "No read notifications"
                : "No notifications yet"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              {activeTab === "unread"
                ? "You are completely up to date! New updates will appear here."
                : "When you receive consultations, records or payment updates, they will appear here."}
            </p>
            {activeTab !== "all" && notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("all")}
                className="mt-4 rounded-xl"
              >
                View all notifications ({notifications.length})
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notification) => {
              const meta = getNotificationMeta(notification.type);
              const safe = getSafeNotificationContent(notification, user?.role);
              const isUnread = !notification.isRead;

              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer shadow-xs ${
                    isUnread
                      ? `bg-doctorly-primary/4 dark:bg-doctorly-primary/8 border-doctorly-primary/30 border-l-4 ${meta.borderColor} shadow-sm shadow-doctorly-primary/5 hover:bg-doctorly-primary/10`
                      : "bg-card border-border/60 hover:border-border/90 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center shrink-0 border border-border/50 shadow-xs ${meta.iconBgClass}`}
                    >
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-8">
                      {/* Top Badges & Time */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${meta.badgeClass}`}
                        >
                          {meta.badgeLabel}
                        </span>

                        {isUnread ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-doctorly-primary text-white shadow-xs">
                            <span className="size-1.5 rounded-full bg-white animate-pulse" />
                            NEW
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="size-3" /> Read
                          </span>
                        )}

                        <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                          <Clock className="size-3" />
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>

                      {/* Title & Safe Message */}
                      <h3
                        className={`text-base tracking-tight ${
                          isUnread ? "font-bold text-foreground" : "font-semibold text-foreground/85"
                        }`}
                      >
                        {safe.title}
                      </h3>
                      <p
                        className={`text-sm mt-1 leading-relaxed ${
                          isUnread ? "text-foreground/90 font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {safe.message}
                      </p>

                      {/* Footer Actions */}
                      <div className="mt-3 flex items-center gap-3 pt-2 border-t border-border/40 text-xs">
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>

                        <span className="inline-flex items-center gap-1 text-doctorly-primary text-xs font-semibold ml-2 hover:underline">
                          <span>Open</span>
                          <ExternalLink className="size-3" />
                        </span>

                        {isUnread && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="ml-auto inline-flex items-center gap-1 font-semibold text-doctorly-primary hover:text-doctorly-primary/80 transition-colors hover:underline"
                          >
                            <Check className="size-3.5" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Right Cross (X) Dismiss Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="absolute top-3.5 right-3.5 p-1.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                    title="Dismiss notification"
                    aria-label="Dismiss notification"
                  >
                    <X className="size-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
