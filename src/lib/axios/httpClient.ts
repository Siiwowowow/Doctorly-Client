import { ApiResponse } from '@/types/api.types';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiCache } from '../apiCache';

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
                    const isProtected = /^\/(admin|doctor|user|patient|chat|video-call|book)(\/|$)/.test(currentPath);
                    if (isProtected && currentPath !== '/login') {
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
    cache?: boolean; // Default true for GET
    ttlMs?: number;  // TTL in milliseconds (default 5 mins)
    staleMs?: number; // Stale time in milliseconds (default 1 min)
}

/**
 * Perform a GET request with instant memory caching & background revalidation (SWR)
 */
const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    const useCache = options?.cache !== false;
    const cacheKey = apiCache.makeKey(endpoint, options?.params);

    if (useCache) {
        const cached = apiCache.get<ApiResponse<TData>>(cacheKey);
        if (cached) {
            // If stale, revalidate in background without blocking caller
            if (cached.isStale) {
                apiCache.fetchWithDeduplication(cacheKey, async () => {
                    const response = await instance.get<ApiResponse<TData>>(endpoint, {
                        params: options?.params,
                        headers: options?.headers,
                    });
                    apiCache.set(cacheKey, response.data, options?.ttlMs, options?.staleMs);
                    return response.data;
                }).catch(() => {});
            }
            return cached.data;
        }
    }

    // Network fetch with request deduplication
    const fetchPromise = () =>
        instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        }).then((res) => {
            if (useCache) {
                apiCache.set(cacheKey, res.data, options?.ttlMs, options?.staleMs);
            }
            return res.data;
        });

    return apiCache.fetchWithDeduplication(cacheKey, fetchPromise);
};

const httpPost = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    // Invalidate relevant cache on mutation
    apiCache.invalidate(endpoint.split('?')[0]);
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
};

const httpPut = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    apiCache.invalidate(endpoint.split('?')[0]);
    const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
};

const httpPatch = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    apiCache.invalidate(endpoint.split('?')[0]);
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
        params: options?.params,
        headers: options?.headers,
    });
    return response.data;
};

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    apiCache.invalidate(endpoint.split('?')[0]);
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
    cache: apiCache,
};

