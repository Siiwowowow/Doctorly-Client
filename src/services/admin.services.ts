"use server";
// src/services/admin.services.ts
import { ApiResponse, User, Role, UserStatus } from "@/types/api.types";
import { httpClient } from "@/lib/axios/httpClient";

export interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalPayments: number;
  activeDoctors: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
}

export const getAdminDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return await httpClient.get<DashboardStats>("/admin/dashboard-stats");
};

export const getAllUsers = async (params?: Record<string, unknown>): Promise<ApiResponse<User[]>> => {
  return await httpClient.get<User[]>("/users", { params });
};

export const updateUserStatus = async (userId: string, status: UserStatus): Promise<ApiResponse<User>> => {
  return await httpClient.patch<User>(`/users/${userId}/status`, { status });
};

export const updateUserRole = async (userId: string, role: Role): Promise<ApiResponse<User>> => {
  return await httpClient.patch<User>(`/users/${userId}/role`, { role });
};

export const deleteUser = async (userId: string): Promise<ApiResponse<User>> => {
  return await httpClient.delete<User>(`/users/${userId}`);
};
