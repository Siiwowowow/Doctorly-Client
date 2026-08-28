"use server";
// src/services/schedule.services.ts
import { ApiResponse, Schedule } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export async function getAllSchedules(queryParams?: Record<string, unknown>): Promise<ApiResponse<Schedule[]>> {
    return await serverFetch<Schedule[]>("/schedules", { params: queryParams as Record<string, string> });
}

export async function getScheduleById(id: string): Promise<ApiResponse<Schedule>> {
    return await serverFetch<Schedule>(`/schedules/${id}`);
}

export async function createSchedule(data: { startDate: string; endDate: string; startTime: string; endTime: string }): Promise<ApiResponse<Schedule[]>> {
    return await serverFetch<Schedule[]>("/schedules", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function deleteSchedule(id: string): Promise<ApiResponse<Schedule>> {
    return await serverFetch<Schedule>(`/schedules/${id}`, {
        method: "DELETE",
    });
}
