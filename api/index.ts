import axios, { type AxiosRequestHeaders } from "axios";
import { API_URL } from "../constants/config";

// API Configuration - Use the same base URL as api/client.ts
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

instance.interceptors.request.use(
  async (config) => {
    // Validate config exists
    if (!config) {
      console.error("Request interceptor: config is undefined");
      return Promise.reject(new Error("Request config is undefined"));
    }

    let token: string | null = null;

    try {
      // Use the same token storage as api/client.ts (auth_token key)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;

      // Try to get token from the correct key first
      token = await AsyncStorage.getItem("auth_token");

      // If not found, check the old key and migrate if present
      if (!token) {
        const oldToken = await AsyncStorage.getItem("token");
        if (oldToken) {
          console.log(
            "[Token Migration] Found token in old location, migrating..."
          );
          // Migrate to new key
          await AsyncStorage.setItem("auth_token", oldToken);
          await AsyncStorage.removeItem("token");
          token = oldToken;
        }
      }

      if (token) {
        // Ensure token doesn't have Bearer prefix and is trimmed
        token = token.trim();
        if (token.startsWith("Bearer ")) {
          token = token.substring(7).trim();
        }
      }
    } catch (error) {
      console.error("Error getting token in interceptor:", error);
      // Continue without token - some endpoints don't require auth
    }

    if (token) {
      // Ensure token doesn't already have Bearer prefix
      const cleanToken = token.trim().startsWith("Bearer ")
        ? token.trim().substring(7).trim()
        : token.trim();

      const headers = (config.headers ?? {}) as AxiosRequestHeaders;
      headers.Authorization = `Bearer ${cleanToken}`;
      config.headers = headers;

      // Log calendar requests for debugging
      if (config.url?.includes("calendar")) {
        console.log("[Calendar Request] URL:", config.url);
        console.log("[Calendar Request] Method:", config.method);
        console.log("[Calendar Request] Has token:", !!cleanToken);
      }

      // Safe logging
      try {
        console.log("=== Request Interceptor ===");
        console.log("URL:", config.url);
        console.log("Method:", config.method?.toUpperCase());
        console.log("Token present:", !!cleanToken);
        console.log("Token length:", cleanToken.length);
        console.log(
          "Authorization header:",
          `Bearer ${cleanToken.substring(0, 20)}...`
        );
        console.log("===========================");
      } catch (logError) {
        // If logging fails, continue silently
      }
    } else {
      // Safe error logging
      try {
        console.warn("=== Request Interceptor ===");
        console.warn("No token found in storage");
        console.warn("URL:", config?.url);
        console.warn("Method:", config?.method);
        console.warn("===========================");
      } catch (logError) {
        // If logging fails, continue silently
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => {
    // Log calendar responses for debugging
    if (response.config.url?.includes("calendar")) {
      console.log(
        "[Calendar Response] Success:",
        response.status,
        response.config.url
      );
    }
    return response;
  },
  async (error) => {
    // Log calendar errors for debugging
    if (error.config?.url?.includes("calendar")) {
      console.error("[Calendar Error] Details:", {
        status: error?.response?.status,
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
        fullURL: `${error.config.baseURL}${error.config.url}`,
        message: error?.response?.data?.message || error?.message,
      });
    }
    // Handle network errors (no response from server)
    if (!error.response) {
      const errorMessage = error.message || "Network error";
      const isNetworkError =
        errorMessage.includes("Network Error") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("ECONNREFUSED") ||
        errorMessage.includes("ENOTFOUND");

      if (isNetworkError) {
        // Safe error logging - avoid logging full error object which may have circular references
        try {
          console.error("=== Network Error ===");
          console.error("Message:", errorMessage);
          console.error("URL:", error.config?.url);
          console.error("Base URL:", error.config?.baseURL);
          console.error("Code:", error.code);
          console.error("=====================");
        } catch (logError) {
          // If logging fails, just log a simple message
          console.error("Network error occurred");
        }

        // Create a more user-friendly error with helpful details
        const baseURL = error.config?.baseURL || "the server";
        const networkError = new Error(
          `Unable to connect to ${baseURL}. Please ensure:\n1. The backend server is running\n2. You're using the correct server URL\n3. For iOS Simulator, use your computer's IP address instead of localhost`
        );
        (networkError as any).isNetworkError = true;
        (networkError as any).originalError = error;
        return Promise.reject(networkError);
      }
    }

    // Handle HTTP status errors
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      const status = error?.response?.status;
      const errorMessage =
        error?.response?.data?.message || error?.response?.data?.error || "";
      const requestUrl = error?.config?.url;
      const requestMethod = error?.config?.method;

      console.error(
        `${status} ${
          status === 401 ? "Unauthorized" : "Forbidden"
        } - Token expired or invalid:`,
        {
          url: requestUrl,
          method: requestMethod,
          message: errorMessage,
          fullError: error?.response?.data,
        }
      );

      // Only clear token on 401 (Unauthorized) - 403 might be permission-based
      if (status === 401) {
        try {
          // Use the same token storage as api/client.ts (auth_token key)
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const AsyncStorage =
            require("@react-native-async-storage/async-storage").default;
          await AsyncStorage.removeItem("auth_token");
          console.log(`Token cleared due to 401 error`);
        } catch (error) {
          console.error("Error removing token:", error);
        }
      } else {
        // For 403, log but don't clear token - might be a permission issue
        console.warn(
          `403 Forbidden - Token may still be valid, but access denied`
        );
      }

      // The error will be handled by the component's error handler
      // which should redirect to login
    }

    return Promise.reject(error);
  }
);

export { instance };

export default instance;
