"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/chat.services.ts
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getOrCreateConversation(data: { participantId: string }): Promise<ApiResponse<any>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/chat/conversations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to get or create conversation");
    }

    return res.json();
}

export async function getMyConversations(): Promise<ApiResponse<any[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/chat/conversations`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch conversations");
    }

    return res.json();
}

export async function getConversationById(id: string): Promise<ApiResponse<any>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/chat/conversations/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch conversation details");
    }

    return res.json();
}

export async function getConversationMessages(id: string, queryParams?: Record<string, any>): Promise<ApiResponse<any[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const url = new URL(`${BASE_API_URL}/chat/conversations/${id}/messages`);
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch messages");
    }

    return res.json();
}

export async function markConversationAsRead(id: string): Promise<ApiResponse<any>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/chat/conversations/${id}/read`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        }
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to mark conversation as read");
    }

    return res.json();
}

export async function sendChatMessage(id: string, data: { content?: string, fileId?: string }): Promise<ApiResponse<any>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/chat/conversations/${id}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message");
    }

    return res.json();
}

