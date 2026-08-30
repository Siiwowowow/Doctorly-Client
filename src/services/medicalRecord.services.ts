"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/medicalRecord.services.ts
import { ApiResponse } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export async function getMyMedicalRecords(): Promise<ApiResponse<any[]>> {
    return await serverFetch<any[]>("/medical-records/my-records");
}

export async function getAllMedicalRecords(queryParams?: Record<string, any>): Promise<ApiResponse<any[]>> {
    return await serverFetch<any[]>("/medical-records", { params: queryParams });
}

export async function getMedicalRecordById(id: string): Promise<ApiResponse<any>> {
    return await serverFetch<any>(`/medical-records/${id}`);
}

export async function createMedicalRecord(data: any): Promise<ApiResponse<any>> {
    return await serverFetch<any>("/medical-records", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateMedicalRecord(id: string, data: any): Promise<ApiResponse<any>> {
    return await serverFetch<any>(`/medical-records/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function getPatientMedicalRecords(patientId: string): Promise<ApiResponse<any[]>> {
    return await serverFetch<any[]>(`/medical-records/patient/${patientId}`);
}
