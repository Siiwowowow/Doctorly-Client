// src/lib/serverFetch.ts
import { cookies } from "next/headers";
import { ApiResponse } from "@/types/api.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

interface ServerFetchOptions extends RequestInit {
    params?: Record<string, unknown>;
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
}

export async function serverFetch<T>(
    endpoint: string,
    options: ServerFetchOptions = {}
): Promise<ApiResponse<T>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let url = `${BASE_API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    if (options.params) {
        const searchParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryStr = searchParams.toString();
        if (queryStr) {
            url += `${url.includes("?") ? "&" : "?"}${queryStr}`;
        }
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
    };

    const cookieHeader = [
        accessToken ? `accessToken=${accessToken}` : "",
        sessionToken ? `better-auth.session_token=${sessionToken}` : "",
        refreshToken ? `refreshToken=${refreshToken}` : "",
    ].filter(Boolean).join("; ");

    if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { params, ...fetchOptions } = options;

    let res = await fetch(url, {
        ...fetchOptions,
        headers,
        cache: options.cache || "no-store",
    });

    if (res.status === 401 && refreshToken && sessionToken) {
        try {
            const refreshRes = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
                },
            });

            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                const newAccess = refreshData.data?.accessToken;
                const newRefresh = refreshData.data?.refreshToken;
                const newSession = refreshData.data?.token;

                if (newAccess) {
                    cookieStore.set("accessToken", newAccess, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                        maxAge: 24 * 60 * 60,
                    });
                }
                if (newRefresh) {
                    cookieStore.set("refreshToken", newRefresh, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                        maxAge: 7 * 24 * 60 * 60,
                    });
                }
                if (newSession) {
                    cookieStore.set("better-auth.session_token", newSession, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                        maxAge: 24 * 60 * 60,
                    });
                }

                headers["Cookie"] = [
                    newAccess ? `accessToken=${newAccess}` : (accessToken ? `accessToken=${accessToken}` : ""),
                    newSession ? `better-auth.session_token=${newSession}` : (sessionToken ? `better-auth.session_token=${sessionToken}` : ""),
                    newRefresh ? `refreshToken=${newRefresh}` : (refreshToken ? `refreshToken=${refreshToken}` : ""),
                ].filter(Boolean).join("; ");

                res = await fetch(url, {
                    ...fetchOptions,
                    headers,
                    cache: options.cache || "no-store",
                });
            }
        } catch (e) {
            console.error("Server auto-refresh error:", e);
        }
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return res.json();
}
