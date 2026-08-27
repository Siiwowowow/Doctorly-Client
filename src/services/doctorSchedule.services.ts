/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
// src/services/doctorSchedule.services.ts
import { ApiResponse, DoctorSchedule } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createDoctorSchedule(scheduleIds: string[]): Promise<ApiResponse<DoctorSchedule[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/doctor-schedules/create-my-doctor-schedule`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        body: JSON.stringify({ scheduleIds })
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create doctor schedule");
    }

    return res.json();
}

export async function getMyDoctorSchedules(queryParams?: Record<string, any>): Promise<ApiResponse<DoctorSchedule[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const url = new URL(`${BASE_API_URL}/doctor-schedules/my-doctor-schedules`);
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
        throw new Error("Failed to fetch doctor schedules");
    }

    return res.json();
}

export async function deleteDoctorSchedule(scheduleId: string): Promise<ApiResponse<any>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/doctor-schedules/delete-my-doctor-schedule/${scheduleId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        }
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete doctor schedule");
    }

    return res.json();
}

export async function getDoctorSchedulesByDoctorId(doctorId: string, queryParams?: Record<string, any>): Promise<ApiResponse<DoctorSchedule[]>> {
    const url = new URL(`${BASE_API_URL}/doctor-schedules/doctor/${doctorId}`);
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch doctor schedules");
    }

    return res.json();
}

import { httpClient } from "@/lib/axios/httpClient";

export const getAllDoctorSchedulesAdmin = async (params?: Record<string, unknown>): Promise<ApiResponse<DoctorSchedule[]>> => {
    return await httpClient.get<DoctorSchedule[]>("/doctor-schedules", { params });
};

