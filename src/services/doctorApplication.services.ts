/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/doctorApplication.services.ts
import { httpClient } from "@/lib/axios/httpClient";
import {
    ApiResponse,
    Doctor,
    DoctorApplication,
    DoctorApplicationDocument,
    DoctorApplicationStatus,
    DocumentVerificationStatus,
} from "@/types/api.types";

export const getAllDoctorApplications = async (
    params?: Record<string, any>
): Promise<ApiResponse<DoctorApplication[]>> => {
    return await httpClient.get<DoctorApplication[]>("/doctor-applications", { params });
};

export const getDoctorApplicationById = async (
    id: string
): Promise<ApiResponse<DoctorApplication>> => {
    return await httpClient.get<DoctorApplication>(`/doctor-applications/${id}`);
};

export const getMyDoctorApplication = async (): Promise<ApiResponse<DoctorApplication>> => {
    return await httpClient.get<DoctorApplication>("/doctor-applications/my-application");
};

export const updateDoctorApplicationStatus = async (
    id: string,
    status: DoctorApplicationStatus
): Promise<ApiResponse<DoctorApplication>> => {
    return await httpClient.patch<DoctorApplication>(`/doctor-applications/${id}/status`, { status });
};

export const verifyDoctorDocument = async (
    applicationId: string,
    documentId: string,
    payload: {
        verificationStatus: DocumentVerificationStatus;
        adminNote?: string;
    }
): Promise<ApiResponse<DoctorApplicationDocument>> => {
    return await httpClient.patch<DoctorApplicationDocument>(
        `/doctor-applications/${applicationId}/documents/${documentId}`,
        payload
    );
};

export const approveDoctorApplication = async (
    id: string
): Promise<ApiResponse<{ application: DoctorApplication; doctor: Doctor }>> => {
    return await httpClient.post<{ application: DoctorApplication; doctor: Doctor }>(
        `/doctor-applications/${id}/approve`,
        {}
    );
};

export const rejectDoctorApplication = async (
    id: string,
    rejectionReason: string
): Promise<ApiResponse<DoctorApplication>> => {
    return await httpClient.post<DoctorApplication>(`/doctor-applications/${id}/reject`, {
        rejectionReason,
    });
};

export const requestResubmissionDoctorApplication = async (
    id: string,
    rejectionReason: string
): Promise<ApiResponse<DoctorApplication>> => {
    return await httpClient.post<DoctorApplication>(
        `/doctor-applications/${id}/request-resubmission`,
        {
            rejectionReason,
        }
    );
};

export const trackDoctorApplication = async (
    identifier: string
): Promise<ApiResponse<DoctorApplication>> => {
    return await httpClient.get<DoctorApplication>(`/doctor-applications/track/${identifier}`);
};
