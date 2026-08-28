/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/doctor.services.ts
import { ApiResponse, Doctor } from "@/types/api.types";
import { httpClient } from "@/lib/axios/httpClient";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export async function getAllDoctors(queryParams?: Record<string, any>): Promise<ApiResponse<Doctor[]>> {
    const url = new URL(`${BASE_API_URL}/doctors`);
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch doctors");
    }

    return res.json();
}

export async function getDoctorById(id: string): Promise<ApiResponse<Doctor>> {
    const res = await fetch(`${BASE_API_URL}/doctors/${id}`, {
        next: { revalidate: 60 },
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
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const cookieHeader = [
        accessToken ? `accessToken=${accessToken}` : "",
        sessionToken ? `better-auth.session_token=${sessionToken}` : "",
    ].filter(Boolean).join("; ");
    if (cookieHeader) headers["Cookie"] = cookieHeader;

    const res = await fetch(`${BASE_API_URL}/doctors/update-my-profile`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
    }

    return res.json();
}

export const getAllDoctorsAdmin = async (params?: Record<string, unknown>): Promise<ApiResponse<Doctor[]>> => {
    return await httpClient.get<Doctor[]>("/doctors", { params });
};

export const updateDoctor = async (id: string, data: Partial<Doctor>): Promise<ApiResponse<Doctor>> => {
    return await httpClient.patch<Doctor>(`/doctors/${id}`, data);
};

export const deleteDoctor = async (id: string): Promise<ApiResponse<Doctor>> => {
    return await httpClient.delete<Doctor>(`/doctors/${id}`);
};
