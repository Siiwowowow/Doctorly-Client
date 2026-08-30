"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/notification.services.ts
import { ApiResponse } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export async function getMyNotifications(): Promise<ApiResponse<any[]>> {
    try {
        return await serverFetch<any[]>("/notifications");
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return {
            success: false,
            message: "Failed to fetch notifications",
            data: [],
        };
    }
}

export async function markNotificationAsRead(id: string): Promise<ApiResponse<any>> {
    try {
        return await serverFetch<any>(`/notifications/${id}/read`, {
            method: "PATCH",
        });
    } catch (error: any) {
        console.error("Error marking notification as read:", error);
        return {
            success: false,
            message: error.message || "Failed to mark notification as read",
            data: null,
        };
    }
}

export async function markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
    try {
        return await serverFetch<any>("/notifications/read-all", {
            method: "PATCH",
        });
    } catch (error: any) {
        console.error("Error marking all notifications as read:", error);
        return {
            success: false,
            message: error.message || "Failed to mark all notifications as read",
            data: null,
        };
    }
}

export async function deleteNotification(id: string): Promise<ApiResponse<any>> {
    try {
        return await serverFetch<any>(`/notifications/${id}`, {
            method: "DELETE",
        });
    } catch (error: any) {
        console.error("Error deleting notification:", error);
        return {
            success: false,
            message: error.message || "Failed to delete notification",
            data: null,
        };
    }
}

export async function deleteAllReadNotifications(): Promise<ApiResponse<any>> {
    try {
        return await serverFetch<any>("/notifications/read", {
            method: "DELETE",
        });
    } catch (error: any) {
        console.error("Error deleting read notifications:", error);
        return {
            success: false,
            message: error.message || "Failed to delete read notifications",
            data: null,
        };
    }
}
