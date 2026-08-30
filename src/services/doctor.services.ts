"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/doctor.services.ts
import { ApiResponse, Doctor } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export async function getAllDoctors(queryParams?: Record<string, any>): Promise<ApiResponse<Doctor[]>> {
    return await serverFetch<Doctor[]>("/doctors", {
        params: queryParams,
        cache: "no-store",
    });
}

export async function getDoctorById(id: string): Promise<ApiResponse<Doctor>> {
    return await serverFetch<Doctor>(`/doctors/${id}`, {
        cache: "no-store",
    });
}

export async function updateMyProfile(data: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    return await serverFetch<Doctor>("/doctors/update-my-profile", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function updateDoctor(id: string, data: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    return await serverFetch<Doctor>(`/doctors/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function deleteDoctor(id: string): Promise<ApiResponse<Doctor>> {
    return await serverFetch<Doctor>(`/doctors/${id}`, {
        method: "DELETE",
    });
}

export const getAllDoctorsAdmin = getAllDoctors;
