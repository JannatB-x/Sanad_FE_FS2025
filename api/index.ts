import axios, { type AxiosRequestHeaders } from "axios";
import { removeToken } from "./storage";

// API Configuration
// For iOS Simulator: Use your computer's local IP address instead of localhost
// Example: http://192.168.1.100:3000/api
// To find your IP: On Mac run `ipconfig getifaddr en0` or check System Preferences > Network
// Set EXPO_PUBLIC_API_URL environment variable or update the default below
const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000, // 10 second timeout
});

instance.interceptors.request.use(
  async (config) => {
    let token: string | null = null;

    try {
      // Use require for React Native compatibility (static import causes bundling issues)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const storageModule = require("./storage");
      const getTokenFn = storageModule.getToken;

      if (getTokenFn && typeof getTokenFn === "function") {
        token = await getTokenFn();
      } else {
        console.warn("getToken is not available from storage module");
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

      console.log("=== Request Interceptor ===");
      console.log("URL:", config.url);
      console.log("Method:", config.method?.toUpperCase());
      console.log("Token present:", !!cleanToken);
      console.log("Token length:", cleanToken.length);
      console.log(
        "Authorization header:",
        `Bearer ${cleanToken.substring(0, 20)}...`
      );
      console.log("Request headers:", JSON.stringify(config.headers, null, 2));
      console.log("Request data:", config.data);
      console.log("===========================");
    } else {
      console.error("=== Request Interceptor ERROR ===");
      console.error("No token found in storage!");
      console.error("URL:", config.url);
      console.error("Method:", config.method);
      console.error("=================================");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
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
        await removeToken();
        console.log(`Token cleared due to 401 error`);
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
