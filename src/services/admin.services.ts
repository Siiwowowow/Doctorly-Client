"use server";
// src/services/admin.services.ts
import { ApiResponse, Admin } from "@/types/api.types";
import { serverFetch } from "@/lib/serverFetch";

export const getAllAdmins = async (params?: Record<string, unknown>): Promise<ApiResponse<Admin[]>> => {
  return await serverFetch<Admin[]>("/admins", { params });
};

export const deleteAdmin = async (adminId: string): Promise<ApiResponse<Admin>> => {
  return await serverFetch<Admin>(`/admins/${adminId}`, {
    method: "DELETE",
  });
};
