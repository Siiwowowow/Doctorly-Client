"use server";
// src/services/prescription.services.ts
import { ApiResponse, Prescription } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export async function getMyPrescriptions(): Promise<ApiResponse<Prescription[]>> {
    return await serverFetch<Prescription[]>("/prescriptions/my-prescriptions");
}

export async function getAllPrescriptions(queryParams?: Record<string, unknown>): Promise<ApiResponse<Prescription[]>> {
    return await serverFetch<Prescription[]>("/prescriptions", { params: queryParams });
}

export async function getPrescriptionById(id: string): Promise<ApiResponse<Prescription>> {
    return await serverFetch<Prescription>(`/prescriptions/${id}`);
}

export async function createPrescription(data: Partial<Prescription>): Promise<ApiResponse<Prescription>> {
    return await serverFetch<Prescription>("/prescriptions", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function deletePrescription(id: string): Promise<ApiResponse<Prescription>> {
    return await serverFetch<Prescription>(`/prescriptions/${id}`, {
        method: "DELETE",
    });
}

export async function getAllPrescriptionsAdmin(params?: Record<string, unknown>): Promise<ApiResponse<Prescription[]>> {
    return await serverFetch<Prescription[]>("/prescriptions", { params });
}
