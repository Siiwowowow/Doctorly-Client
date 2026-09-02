// src/services/auth.services.ts
"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";
import { cache } from "react";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export interface IRefreshTokenData {
    accessToken: string;
    refreshToken: string;
    token: string;
}

function isDynamicServerError(error: unknown): boolean {
    if (error && typeof error === "object") {
        if ("digest" in error && (error as { digest: string }).digest === "DYNAMIC_SERVER_USAGE") {
            return true;
        }
        if ("message" in error && typeof (error as { message: string }).message === "string") {
            const msg = (error as { message: string }).message;
            return msg.includes("DYNAMIC_SERVER_USAGE") || msg.includes("Dynamic server usage");
        }
    }
    return false;
}

export async function getNewTokensWithRefreshToken(
    refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; token: string } | null> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken || ""}`,
            },
        });

        if (!res.ok) return null;

        const { data } = await res.json();
        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if (!accessToken) return null;

        await setTokenInCookies("accessToken", accessToken, 24 * 60 * 60);
        if (newRefreshToken) await setTokenInCookies("refreshToken", newRefreshToken, 7 * 24 * 60 * 60);
        if (token) await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

        return { accessToken, refreshToken: newRefreshToken || refreshToken, token: token || sessionToken || "" };
    } catch (error) {
        if (isDynamicServerError(error)) {
            throw error;
        }
        console.error("Error in getNewTokensWithRefreshToken:", error);
        return null;
    }
}

export async function getSocketAuthTokens(): Promise<{ token: string | null; sessionToken: string | null }> {
    try {
        const cookieStore = await cookies();
        let accessToken = cookieStore.get("accessToken")?.value || null;
        let sessionToken = cookieStore.get("better-auth.session_token")?.value || null;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!accessToken && refreshToken) {
            const newTokens = await getNewTokensWithRefreshToken(refreshToken);
            if (newTokens) {
                accessToken = newTokens.accessToken;
                sessionToken = newTokens.token;
            }
        }

        return { token: accessToken, sessionToken };
    } catch (error) {
        if (isDynamicServerError(error)) {
            throw error;
        }
        console.error("Error in getSocketAuthTokens:", error);
        return { token: null, sessionToken: null };
    }
}


export const getUserInfo = cache(async () => {
    try {
        const cookieStore = await cookies();
        let accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;
        let sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!accessToken && refreshToken) {
            const newTokens = await getNewTokensWithRefreshToken(refreshToken);
            if (newTokens) {
                accessToken = newTokens.accessToken;
                sessionToken = newTokens.token;
            }
        }

        if (!accessToken) {
            return null;
        }

        let res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken || ""}`,
            },
            cache: "no-store",
        });

        if (res.status === 401 && refreshToken) {
            const newTokens = await getNewTokensWithRefreshToken(refreshToken);
            if (newTokens) {
                res = await fetch(`${BASE_API_URL}/auth/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `accessToken=${newTokens.accessToken}; better-auth.session_token=${newTokens.token}`,
                    },
                    cache: "no-store",
                });
            }
        }

        if (!res.ok) {
            return null;
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        if (isDynamicServerError(error)) {
            throw error;
        }
        console.error("Error fetching user info:", error);
        return null;
    }
});

export async function logoutUser() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;
        const accessToken = cookieStore.get("accessToken")?.value;

        // Try backend logout
        if (sessionToken || accessToken) {
            await fetch(`${BASE_API_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
                },
            }).catch(() => {});
        }

        cookieStore.delete({ name: "accessToken", path: "/" });
        cookieStore.delete({ name: "refreshToken", path: "/" });
        cookieStore.delete({ name: "better-auth.session_token", path: "/" });
        return true;
    } catch (error) {
        if (isDynamicServerError(error)) {
            throw error;
        }
        console.error("Logout failed", error);
        return false;
    }
}
