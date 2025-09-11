import { authCookies } from "@/lib/cookies-client";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Configuration de base pour les appels API
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://api.lurnix.tech/api";

// Types pour les erreurs d'API
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Instance Axios
const http = axios.create({
  baseURL: API_BASE_URL,
});

// Options de requête étendues
type RequestOptions = AxiosRequestConfig & {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
};

export const apiClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = authCookies.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    };

    if (token && !options.skipAuth && !(options.headers as any)?.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: AxiosRequestConfig = {
      url: endpoint,
      method: options.method || "GET",
      headers,
      params: options.params,
      data: (options as any).body ?? options.data,
      withCredentials: options.withCredentials,
      signal: options.signal,
    };

    try {
      const response = await http.request<T>(config);
      return response.data as T;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<any>;
        const status = err.response?.status ?? 0;
        const data = err.response?.data ?? {};
        const message = data?.message || err.message || `HTTP ${status}`;
        const code = data?.code as string | undefined;
        const details = (data?.details || data) as Record<string, any> | undefined;
        throw new ApiError(message, status, code, details);
      }
      throw new ApiError("Network error or server unavailable", 0, "NETWORK_ERROR");
    }
  },

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", data });
  },

  put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", data });
  },

  patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", data });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
