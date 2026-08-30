"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/providers/NotificationProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  Inbox,
} from "lucide-react";
import {
  getNotificationMeta,
  getSafeNotificationContent,
  getNotificationHref,
  formatNotificationTime,
} from "@/components/notifications/notificationHelpers";

export function NavbarNotifications() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isOpen, setIsOpen] = useState(false);

  const notificationsUrl = user?.role === "DOCTOR" 
    ? "/doctor/notifications" 
    : user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
    ? "/admin/notifications"
    : "/user/notifications";

  const displayedNotifications = filter === "unread" 
    ? notifications.filter((n) => !n.isRead) 
    : notifications;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    const href = getNotificationHref(notification, user?.role);
    router.push(href);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-doctorly-primary focus-visible:ring-1 focus-visible:ring-doctorly-primary"
          aria-label="Notifications"
        >
          <motion.div
            whileHover={{ rotate: [0, -12, 12, -8, 8, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Bell className="size-4.5" />
          </motion.div>

          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-background shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[400px] rounded-2xl border border-border/70 bg-background/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Header */}
        <div className="bg-muted/40 px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-foreground">Notifications</span>
            {unreadCount > 0 ? (
              <span className="inline-flex items-center gap-1 bg-doctorly-primary/10 text-doctorly-primary text-[11px] font-semibold px-2 py-0.5 rounded-full border border-doctorly-primary/20">
                <span className="size-1.5 rounded-full bg-doctorly-primary animate-pulse" />
                {unreadCount} New
              </span>
            ) : (
              <span className="text-muted-foreground text-xs font-normal">All caught up</span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="inline-flex items-center gap-1 text-xs font-medium text-doctorly-primary hover:text-doctorly-primary/80 transition-colors p-1 rounded-md hover:bg-doctorly-primary/5"
              title="Mark all as read"
            >
              <CheckCheck className="size-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-border/50 bg-muted/20 px-3 pt-2 gap-2 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`pb-2 px-2 font-medium transition-colors relative ${
              filter === "all"
                ? "text-doctorly-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({notifications.length})
            {filter === "all" && (
              <motion.div
                layoutId="dropdown-filter-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-doctorly-primary rounded-full"
              />
            )}
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`pb-2 px-2 font-medium transition-colors relative ${
              filter === "unread"
                ? "text-doctorly-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({unreadCount})
            {filter === "unread" && (
              <motion.div
                layoutId="dropdown-filter-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-doctorly-primary rounded-full"
              />
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40 scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {displayedNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 px-4 text-center text-muted-foreground flex flex-col items-center justify-center"
              >
                <div className="p-3 bg-muted/50 rounded-full mb-3 text-muted-foreground/60">
                  {filter === "unread" ? <Sparkles className="size-6" /> : <Inbox className="size-6" />}
                </div>
                <p className="font-semibold text-sm text-foreground">
                  {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                  {filter === "unread"
                    ? "You've read all your recent notifications."
                    : "When new updates arrive, they will appear here."}
                </p>
              </motion.div>
            ) : (
              displayedNotifications.map((notification) => {
                const meta = getNotificationMeta(notification.type);
                const safe = getSafeNotificationContent(notification, user?.role);
                const isUnread = !notification.isRead;

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0, transition: { duration: 0.2 } }}
                    className={`group relative p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isUnread
                        ? "bg-doctorly-primary/[0.04] hover:bg-doctorly-primary/[0.08]"
                        : "bg-background hover:bg-muted/50"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Left Icon with Badge */}
                    <div
                      className={`size-8 rounded-xl flex items-center justify-center shrink-0 border border-border/50 shadow-xs ${meta.iconBgClass}`}
                    >
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isUnread ? "text-foreground font-bold" : "text-foreground/80"
                          }`}
                        >
                          {safe.title}
                        </span>

                        {isUnread && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-doctorly-primary text-white shrink-0">
                            NEW
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs leading-relaxed line-clamp-2 ${
                          isUnread ? "text-foreground/90 font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {safe.message}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                        {!isUnread && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                            <Check className="size-3" /> Read
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Dismiss / Cross button */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      {isUnread && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-doctorly-primary hover:bg-doctorly-primary/10 rounded-md transition-all"
                          title="Mark as read"
                        >
                          <Check className="size-3.5" />
                        </button>
                      )}

                      {/* Cross Symbol to Dismiss */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="p-1 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                        title="Dismiss notification"
                        aria-label="Dismiss notification"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-muted/40 px-4 py-2.5 border-t border-border/50 text-center">
          <Link
            href={notificationsUrl}
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-doctorly-primary hover:text-doctorly-primary/80 transition-colors w-full py-1 rounded-lg hover:bg-doctorly-primary/5"
          >
            <span>View all in Notification Center</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
