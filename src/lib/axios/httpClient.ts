// src/lib/axios/httpClient.ts
import { ApiResponse } from '@/types/api.types';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

// Axios response interceptor for automatic token refresh and request retry
instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

        if (!error.response || !originalRequest) {
            return Promise.reject(error);
        }

        const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register') ||
            originalRequest.url?.includes('/auth/refresh-token') ||
            originalRequest.url?.includes('/auth/logout');

        // Only handle 401 on non-auth endpoints and not already retried
        if (error.response.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => instance(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh endpoint with credentials (sends refreshToken & sessionToken cookies)
                await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                processQueue(null);
                isRefreshing = false;
                return instance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError);
                isRefreshing = false;

                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    if (currentPath !== '/login') {
                        window.location.href = `/login?reason=expired&redirect=${encodeURIComponent(currentPath)}`;
                    }
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
};

const httpPost = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
};

const httpPut = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
};

const httpPatch = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
};

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const response = await instance.delete<ApiResponse<TData>>(endpoint, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
};

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
    instance,
};
