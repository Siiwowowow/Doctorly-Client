"use server";
// src/services/specialty.services.ts
import { ApiResponse, Specialty } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export async function getAllSpecialties(): Promise<ApiResponse<Specialty[]>> {
    const res = await fetch(`${BASE_API_URL}/specialties`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch specialties");
    }

    return res.json();
}

export async function getSpecialtyById(id: string): Promise<ApiResponse<Specialty>> {
    return await serverFetch<Specialty>(`/specialties/${id}`);
}

export async function createSpecialty(data: Partial<Specialty> | FormData): Promise<ApiResponse<Specialty>> {
    if (data instanceof FormData) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        const headers: Record<string, string> = {};
        const cookieHeader = [
            accessToken ? `accessToken=${accessToken}` : "",
            sessionToken ? `better-auth.session_token=${sessionToken}` : "",
        ].filter(Boolean).join("; ");
        if (cookieHeader) headers["Cookie"] = cookieHeader;

        const res = await fetch(`${BASE_API_URL}/specialties`, {
            method: "POST",
            headers,
            body: data,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to create specialty");
        }
        return res.json();
    }

    return await serverFetch<Specialty>("/specialties", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateSpecialty(id: string, data: Partial<Specialty>): Promise<ApiResponse<Specialty>> {
    return await serverFetch<Specialty>(`/specialties/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function deleteSpecialty(id: string): Promise<ApiResponse<Specialty>> {
    return await serverFetch<Specialty>(`/specialties/${id}`, {
        method: "DELETE",
    });
}
