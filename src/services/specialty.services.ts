"use server";
// src/services/specialty.services.ts
import { ApiResponse, Specialty } from "@/types/api.types";
import { httpClient } from "@/lib/axios/httpClient";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllSpecialties(): Promise<ApiResponse<Specialty[]>> {
    const res = await fetch(`${BASE_API_URL}/specialties`, {
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
        throw new Error("Failed to fetch specialties");
    }

    return res.json();
}

export const createSpecialty = async (data: Partial<Specialty>): Promise<ApiResponse<Specialty>> => {
    return await httpClient.post<Specialty>("/specialties", data);
};

export const updateSpecialty = async (id: string, data: Partial<Specialty>): Promise<ApiResponse<Specialty>> => {
    return await httpClient.patch<Specialty>(`/specialties/${id}`, data);
};

export const deleteSpecialty = async (id: string): Promise<ApiResponse<Specialty>> => {
    return await httpClient.delete<Specialty>(`/specialties/${id}`);
};
