"use server";
// src/services/schedule.services.ts
import { ApiResponse, Schedule } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllSchedules(queryParams?: Record<string, unknown>): Promise<ApiResponse<Schedule[]>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const url = new URL(`${BASE_API_URL}/schedules`);
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
        cache: "no-store" // We usually want the latest schedules for available slots
    });

    if (!res.ok) {
        throw new Error("Failed to fetch schedules");
    }

    return res.json();
}

