"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/payment.services.ts
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMyPayments(): Promise<ApiResponse<any[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/payments/my-payments`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch payments");
    }

    return res.json();
}

export async function createCheckoutSession(appointmentId: string): Promise<ApiResponse<any>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/payments/create-checkout-session`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        body: JSON.stringify({ appointmentId })
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create checkout session");
    }

    return res.json();
}

import { httpClient } from "@/lib/axios/httpClient";

export const getAllPaymentsAdmin = async (params?: Record<string, unknown>): Promise<ApiResponse<any[]>> => {
    return await httpClient.get<any[]>("/payments", { params });
};

