"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/patient.services.ts
import { ApiResponse, Patient } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export async function getPatientProfile(): Promise<ApiResponse<Patient>> {
    return await serverFetch<Patient>("/patients/me");
}

export async function getAllPatients(queryParams?: Record<string, any>): Promise<ApiResponse<Patient[]>> {
    return await serverFetch<Patient[]>("/patients", { params: queryParams });
}

export async function getPatientById(id: string): Promise<ApiResponse<Patient>> {
    return await serverFetch<Patient>(`/patients/${id}`);
}

export const updatePatientProfile = async (id: string, data: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    return await serverFetch<Patient>(`/patients/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

export const deletePatient = async (id: string): Promise<ApiResponse<Patient>> => {
    return await serverFetch<Patient>(`/patients/${id}`, {
        method: "DELETE",
    });
};
