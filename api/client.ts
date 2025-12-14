import axios, { AxiosInstance, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/config";
import type { ApiError } from "../types/index";

const TOKEN_KEY = "auth_token";

console.log("[API Client] Configured API URL:", API_URL);

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout (reduced from 90 for faster failure detection)
  headers: {
    "Content-Type": "application/json",
  },
  // Add validateStatus to handle all responses
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    console.log(
      "[API Client] Request:",
      config.method?.toUpperCase(),
      config.url
    );

    // Only add token if Authorization header is not explicitly set to undefined
    // This allows apiRequest to control when auth is needed
    if (config.headers?.Authorization === undefined) {
      // Don't add token for public endpoints
      return config;
    }

    // Add token if not already present and not explicitly disabled
    if (!config.headers?.Authorization) {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.log("[API Client] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("[API Client] Response:", response.status, response.config.url);
    return response;
  },
  (error: AxiosError<{ message?: string; context_log_id?: string }>) => {
    console.log("[API Client] Error:", error.code, error.message);

    // Handle network errors (no response from server)
    if (!error.response) {
      const errorMessage = error.message || "Network error";
      const isNetworkError =
        errorMessage.includes("Network Error") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("ECONNREFUSED") ||
        errorMessage.includes("ENOTFOUND") ||
        error.code === "ECONNREFUSED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ERR_NETWORK";

      if (isNetworkError) {
        const fullURL = `${error.config?.baseURL || API_URL}${
          error.config?.url || ""
        }`;
        console.error("[API Client] Network Error Details:", {
          message: errorMessage,
          code: error.code,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          fullURL: fullURL,
          timeout: api.defaults.timeout,
        });

        // Create a more user-friendly error
        const networkError = new Error(
          `Unable to connect to server at ${fullURL}.\n\nPlease check:\n1. The backend server is running on ${
            error.config?.baseURL || API_URL
          }\n2. Your device/emulator can reach the server IP\n3. No firewall is blocking the connection\n4. For iOS Simulator, ensure you're using the correct IP address\n\nError: ${errorMessage}`
        );
        (networkError as any).isNetworkError = true;
        (networkError as any).originalError = error;
        (networkError as any).code = error.code;
        return Promise.reject(networkError);
      }
    }

    // Better error logging for 404s
    if (error.response?.status === 404) {
      console.error("[API Client] 404 Error Details:", {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
        message: error.response?.data?.message || "Route not found",
      });
    } else if (error.response) {
      console.log(
        "[API Client] Error details:",
        JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
          code: error.code,
        })
      );
    }

    const apiError: ApiError & {
      response?: { data?: any };
      isNetworkError?: boolean;
    } = {
      message:
        error.response?.data?.message || error.message || "Request failed",
      status: error.response?.status,
      response: error.response ? { data: error.response.data } : undefined,
      isNetworkError: !error.response,
    };
    return Promise.reject(apiError);
  }
);

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  requiresAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, requiresAuth = true } = options;

  // Ensure endpoint starts with / for proper URL construction
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  // Build config object
  const config: any = {
    url: normalizedEndpoint,
    method,
    data: body,
  };

  // For non-auth requests, explicitly set Authorization to undefined
  // This tells the interceptor not to add a token
  if (!requiresAuth) {
    config.headers = {
      ...config.headers,
      Authorization: undefined,
    };
  }

  console.log("[API Request] Making request:", {
    method,
    endpoint: normalizedEndpoint,
    fullURL: `${API_URL}${normalizedEndpoint}`,
    requiresAuth,
    hasBody: !!body,
  });

  const response = await api.request<T>(config);

  // Check for error status codes and throw appropriate errors
  if (response.status >= 400) {
    const errorMessage =
      (response.data as any)?.message ||
      `Request failed with status ${response.status}`;

    const error: ApiError & {
      response?: { data?: any };
      isNetworkError?: boolean;
    } = {
      message: errorMessage,
      status: response.status,
      response: { data: response.data },
    };

    // Add network error flag for 4xx/5xx that aren't network errors
    if (response.status >= 500) {
      error.isNetworkError = false;
    }

    console.error("[API Request] Request failed:", {
      status: response.status,
      endpoint: normalizedEndpoint,
      message: errorMessage,
    });

    throw error;
  }

  return response.data;
}

export default api;
