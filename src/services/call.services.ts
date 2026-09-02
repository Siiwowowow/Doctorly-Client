"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/call.services.ts
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function initiateCall(data: {
  receiverId?: string;
  appointmentId?: string;
  isVideoCall?: boolean;
  type?: "VIDEO" | "AUDIO" | string;
}): Promise<ApiResponse<any>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  const resolvedType = data.type || (data.isVideoCall === false ? "AUDIO" : "VIDEO");

  const res = await fetch(`${BASE_API_URL}/calls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
    },
    body: JSON.stringify({
      receiverId: data.receiverId,
      appointmentId: data.appointmentId,
      type: resolvedType,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to initiate call");
  }

  return res.json();
}

export async function acceptCall(callId: string): Promise<ApiResponse<any>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  const res = await fetch(`${BASE_API_URL}/calls/${callId}/accept`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to accept call");
  }

  return res.json();
}

export async function endCall(callId: string, reason?: string): Promise<ApiResponse<any>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  const res = await fetch(`${BASE_API_URL}/calls/${callId}/end`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
    },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to end call");
  }

  return res.json();
}

export async function rejectCall(callId: string, reason?: string): Promise<ApiResponse<any>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  const res = await fetch(`${BASE_API_URL}/calls/${callId}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
    },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reject call");
  }

  return res.json();
}

export async function getCallById(callId: string): Promise<ApiResponse<any>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  const res = await fetch(`${BASE_API_URL}/calls/${callId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch call details");
  }

  return res.json();
}
