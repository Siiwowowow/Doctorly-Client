"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/appointment.services.ts
import { ApiResponse, Appointment, AppointmentStatus } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMyAppointments(queryParams?: Record<string, any>): Promise<ApiResponse<Appointment[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const url = new URL(`${BASE_API_URL}/appointments/my-appointments`);
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
        throw new Error("Failed to fetch appointments");
    }

    return res.json();
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<ApiResponse<Appointment>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        body: JSON.stringify({ status })
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update appointment status");
    }

    return res.json();
}

export async function getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/appointments/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch appointment details");
    }

    return res.json();
}

export async function createAppointment(data: { doctorId: string; scheduleId: string }): Promise<ApiResponse<Appointment>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/appointments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Appointment creation failed with errorData:", JSON.stringify(errorData, null, 2));
        throw new Error(errorData.message || "Failed to create appointment");
    }

    return res.json();
}

export async function cancelAppointment(id: string): Promise<ApiResponse<Appointment>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${BASE_API_URL}/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${cookieStore.get("better-auth.session_token")?.value}`
        }
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to cancel appointment");
    }

    return res.json();
}

import { httpClient } from "@/lib/axios/httpClient";

export const getAllAppointmentsAdmin = async (params?: Record<string, unknown>): Promise<ApiResponse<Appointment[]>> => {
    return await httpClient.get<Appointment[]>("/appointments", { params });
};

