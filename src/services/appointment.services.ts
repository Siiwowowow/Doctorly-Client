"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/appointment.services.ts
import { ApiResponse, Appointment, AppointmentStatus } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export async function getMyAppointments(queryParams?: Record<string, any>): Promise<ApiResponse<Appointment[]>> {
    return await serverFetch<Appointment[]>("/appointments/my-appointments", { params: queryParams });
}

export async function getAllAppointments(queryParams?: Record<string, any>): Promise<ApiResponse<Appointment[]>> {
    return await serverFetch<Appointment[]>("/appointments", { params: queryParams });
}

export async function getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
    return await serverFetch<Appointment>(`/appointments/${id}`);
}

export async function createAppointment(data: { doctorId: string; scheduleId: string }): Promise<ApiResponse<Appointment>> {
    return await serverFetch<Appointment>("/appointments", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function bookAppointment(data: { doctorId: string; scheduleId: string }): Promise<ApiResponse<Appointment>> {
    return await createAppointment(data);
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<ApiResponse<Appointment>> {
    return await serverFetch<Appointment>(`/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}

export async function cancelAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return await serverFetch<Appointment>(`/appointments/${id}/cancel`, {
        method: "PATCH",
    });
}

export async function getAllAppointmentsAdmin(params?: Record<string, unknown>): Promise<ApiResponse<Appointment[]>> {
    return await serverFetch<Appointment[]>("/appointments", { params });
}
