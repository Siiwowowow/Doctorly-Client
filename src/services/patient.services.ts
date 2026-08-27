"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/patient.services.ts
import { ApiResponse, Patient } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPatientProfile(): Promise<ApiResponse<Patient>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/patients/me`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch patient profile");
    }

    return res.json();
}

export async function getAllPatients(queryParams?: Record<string, any>): Promise<ApiResponse<Patient[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const url = new URL(`${BASE_API_URL}/patients`);
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch patients");
    }

    return res.json();
}

export async function getPatientById(id: string): Promise<ApiResponse<Patient>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/patients/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch patient details");
    }

    return res.json();
}

import { httpClient } from "@/lib/axios/httpClient";

export const updatePatientProfile = async (id: string, data: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    return await httpClient.patch<Patient>(`/patients/${id}`, data);
};

export const updatePatientStatus = async (id: string, data: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    return await httpClient.patch<Patient>(`/patients/${id}`, data);
};

export const deletePatient = async (id: string): Promise<ApiResponse<Patient>> => {
    return await httpClient.delete<Patient>(`/patients/${id}`);
};

