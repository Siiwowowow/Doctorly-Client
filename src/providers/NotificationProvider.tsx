"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications,
} from "@/services/notification.services";
import { Notification } from "@/types/api.types";
import { getSafeNotificationContent, getNotificationHref } from "@/components/notifications/notificationHelpers";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAllRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  removeNotification: async () => {},
  clearAllRead: async () => {},
  fetchNotifications: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const { user, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await getMyNotifications();
      const notifs: Notification[] = res.data || [];
      // Sort newest first
      const sorted = notifs.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
      setUnreadCount(sorted.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time socket events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;
        return [notification, ...prev];
      });
      setUnreadCount((prev) => prev + 1);

      // Safe Privacy Content
      const safe = getSafeNotificationContent(notification, user?.role);
      const targetHref = getNotificationHref(notification, user?.role);

      toast.info(safe.title, {
        description: safe.message,
        action: {
          label: "View",
          onClick: () => {
            if (notification.id) {
              markAsRead(notification.id);
            }
            router.push(targetHref);
          },
        },
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.removeListener("notification:new", handleNewNotification);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, user?.role, router]);

  // Mark single as read (Optimistic & Real-time)
  const markAsRead = async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.isRead) return;

    // Instant optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all as read (Optimistic & Real-time)
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    // Instant optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Remove / Dismiss notification with cross icon (Optimistic & Real-time)
  const removeNotification = async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (!target) return;

    // Instant optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!target.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await deleteNotification(id);
      toast.success("Notification removed");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      // Revert if error
      setNotifications((prev) => [target, ...prev]);
      if (!target.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
      toast.error("Failed to remove notification");
    }
  };

  // Clear all read notifications
  const clearAllRead = async () => {
    const readOnes = notifications.filter((n) => n.isRead);
    if (readOnes.length === 0) return;

    // Instant optimistic update
    setNotifications((prev) => prev.filter((n) => !n.isRead));

    try {
      await deleteAllReadNotifications();
      toast.success("Read notifications cleared");
    } catch (error) {
      console.error("Failed to delete read notifications:", error);
      toast.error("Failed to clear read notifications");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
