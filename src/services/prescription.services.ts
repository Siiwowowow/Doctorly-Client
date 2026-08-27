"use server";
// src/services/prescription.services.ts
import { ApiResponse, Prescription } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMyPrescriptions(): Promise<ApiResponse<Prescription[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/prescriptions/my-prescriptions`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch prescriptions");
    }

    return res.json();
}

export async function getPrescriptionById(id: string): Promise<ApiResponse<Prescription>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/prescriptions/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch prescription details");
    }

    return res.json();
}

export async function createPrescription(data: Partial<Prescription>): Promise<ApiResponse<Prescription>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/prescriptions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create prescription");
    }

    return res.json();
}

import { httpClient } from "@/lib/axios/httpClient";

export const getAllPrescriptionsAdmin = async (params?: Record<string, unknown>): Promise<ApiResponse<Prescription[]>> => {
    return await httpClient.get<Prescription[]>("/prescriptions", { params });
};

