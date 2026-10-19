"use server";

import { ApiResponse, Service } from "@/types/api.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export async function getAllServices(): Promise<ApiResponse<Service[]>> {
    const res = await fetch(`${BASE_API_URL}/services`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return res.json();
}
