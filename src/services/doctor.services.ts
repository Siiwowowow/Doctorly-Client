/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/doctor.services.ts
import { ApiResponse, Doctor } from "@/types/api.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllDoctors(queryParams?: Record<string, any>): Promise<ApiResponse<Doctor[]>> {
    const url = new URL(`${BASE_API_URL}/doctors`);
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        next: { revalidate: 60 }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch doctors");
    }

    return res.json();
}

export async function getDoctorById(id: string): Promise<ApiResponse<Doctor>> {
    const res = await fetch(`${BASE_API_URL}/doctors/${id}`, {
        next: { revalidate: 60 }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch doctor details");
    }

    return res.json();
}

export async function updateMyProfile(data: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/doctors/update-my-profile`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
    }

    return res.json();
}

import { httpClient } from "@/lib/axios/httpClient";

export const getAllDoctorsAdmin = async (params?: Record<string, unknown>): Promise<ApiResponse<Doctor[]>> => {
    return await httpClient.get<Doctor[]>("/doctors", { params });
};

export const updateDoctorStatus = async (id: string, data: Partial<Doctor>): Promise<ApiResponse<Doctor>> => {
    return await httpClient.patch<Doctor>(`/doctors/${id}`, data);
};

export const deleteDoctor = async (id: string): Promise<ApiResponse<Doctor>> => {
    return await httpClient.delete<Doctor>(`/doctors/${id}`);
};
