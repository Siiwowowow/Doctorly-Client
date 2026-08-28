/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
// src/services/doctorSchedule.services.ts
import { ApiResponse, DoctorSchedule } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export async function createDoctorSchedule(scheduleIds: string[]): Promise<ApiResponse<DoctorSchedule[]>> {
    return await serverFetch<DoctorSchedule[]>("/doctor-schedules/create-my-doctor-schedule", {
        method: "POST",
        body: JSON.stringify({ scheduleIds }),
    });
}

export async function getMyDoctorSchedules(queryParams?: Record<string, any>): Promise<ApiResponse<DoctorSchedule[]>> {
    return await serverFetch<DoctorSchedule[]>("/doctor-schedules/my-doctor-schedules", { params: queryParams });
}

export async function getAllDoctorSchedules(queryParams?: Record<string, any>): Promise<ApiResponse<DoctorSchedule[]>> {
    return await serverFetch<DoctorSchedule[]>("/doctor-schedules", { params: queryParams });
}

export async function deleteDoctorSchedule(scheduleId: string): Promise<ApiResponse<any>> {
    return await serverFetch<any>(`/doctor-schedules/delete-my-doctor-schedule/${scheduleId}`, {
        method: "DELETE",
    });
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
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch doctor schedules");
    }

    return res.json();
}

export async function getAllDoctorSchedulesAdmin(params?: Record<string, unknown>): Promise<ApiResponse<DoctorSchedule[]>> {
    return await serverFetch<DoctorSchedule[]>("/doctor-schedules", { params });
}
