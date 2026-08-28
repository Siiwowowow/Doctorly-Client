"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/payment.services.ts
import { ApiResponse } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export async function createCheckoutSession(appointmentId: string): Promise<ApiResponse<{ paymentUrl: string; sessionId: string }>> {
    return await serverFetch<{ paymentUrl: string; sessionId: string }>("/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ appointmentId }),
    });
}

export async function initiatePayment(appointmentId: string): Promise<ApiResponse<{ paymentUrl: string; sessionId: string }>> {
    return await createCheckoutSession(appointmentId);
}

export async function verifyPaymentSession(sessionId: string): Promise<ApiResponse<{ isPaid: boolean; appointment: any; payment: any }>> {
    return await serverFetch<{ isPaid: boolean; appointment: any; payment: any }>(`/payments/verify-session/${sessionId}`);
}

export async function getMyPayments(queryParams?: Record<string, any>): Promise<ApiResponse<any[]>> {
    return await serverFetch<any[]>("/payments/my-payments", { params: queryParams });
}

export async function getAllPayments(queryParams?: Record<string, any>): Promise<ApiResponse<any[]>> {
    return await serverFetch<any[]>("/payments/my-payments", { params: queryParams });
}

export async function getAllPaymentsAdmin(params?: Record<string, unknown>): Promise<ApiResponse<any[]>> {
    return await serverFetch<any[]>("/payments/my-payments", { params });
}

export async function getPaymentInvoice(paymentId: string): Promise<ApiResponse<any>> {
    return await serverFetch<any>(`/payments/invoice/${paymentId}`);
}
