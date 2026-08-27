"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/notification.services.ts
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMyNotifications(): Promise<ApiResponse<any[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/notifications`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch notifications");
    }

    return res.json();
}

export async function markNotificationAsRead(id: string): Promise<ApiResponse<any>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        }
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to mark notification as read");
    }

    return res.json();
}

export async function markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        }
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to mark all notifications as read");
    }

    return res.json();
}

