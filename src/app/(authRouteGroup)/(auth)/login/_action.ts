/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getRedirectAfterLogin,
  UserRole,
} from "@/lib/authUtils";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/zod/auth.types";
import {
  ILoginPayload,
  loginZodSchema,
} from "@/zod/auth.validation";

import { redirect } from "next/navigation";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0]?.message || "Invalid input";

    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedPayload.data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      if (resData.message === "Email not verified") {
        redirect(`/verify-email?email=${encodeURIComponent(payload.email)}`);
      }
      return {
        success: false,
        message: resData.message || "Invalid email or password.",
      };
    }

    const { accessToken, refreshToken, token, user } = resData.data;
    const { role, needPasswordChange, email } = user;

    // Set secure cookies: access token (1d), refresh token (7d), session token (1d)
    await setTokenInCookies("accessToken", accessToken, 24 * 60 * 60);
    await setTokenInCookies("refreshToken", refreshToken, 7 * 24 * 60 * 60);
    if (token) {
      await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
    }

    // Password change flow
    if (needPasswordChange) {
      redirect(`/reset-password?email=${encodeURIComponent(email)}`);
    }

    // Role-based sanitized redirect
    const finalRedirect = getRedirectAfterLogin(
      role as UserRole,
      redirectPath
    );

    return {
      success: true,
      redirectUrl: finalRedirect,
      user,
    } as any;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Login action error:", error);

    return {
      success: false,
      message: error?.message || "Invalid email or password.",
    };
  }
};
