// api/index.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, API_TIMEOUT, API_ENABLED } from "../constants/API";

// API Client - Disabled for offline editing
const apiClient = axios.create({
  baseURL: API_BASE_URL || "http://disabled",
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept all requests to block API calls when disabled
apiClient.interceptors.request.use(
  async (config) => {
    if (!API_ENABLED) {
      throw new Error(
        "API connections are disabled. Enable API_ENABLED in constants/API.ts to connect to backend."
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token from storage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    // Return only the data from response
    return response.data;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear stored auth data
      await AsyncStorage.multiRemove(["token", "user", "userType"]);
      // You might want to redirect to login here
    }

    // Handle network errors
    if (!error.response) {
      const networkError = error.code === "ECONNABORTED"
        ? "Request timeout. Please check your connection and try again."
        : error.message?.includes("Network")
        ? "Network error. Please check your connection and ensure the server is running."
        : "Network error. Please check your connection.";
      return Promise.reject(new Error(networkError));
    }

    // Handle different error response formats
    const errorData = error.response.data;
    let message = "Something went wrong";

    if (errorData?.message) {
      message = errorData.message;
    } else if (errorData?.error) {
      message = errorData.error;
    } else if (typeof errorData === "string") {
      message = errorData;
    } else if (errorData?.errors && Array.isArray(errorData.errors)) {
      // Handle validation errors array
      message = errorData.errors.map((e: any) => e.message || e).join(", ");
    }

    // Add status code context for debugging
    if (error.response.status === 400) {
      message = message || "Invalid request. Please check your input.";
    } else if (error.response.status === 401) {
      message = message || "Unauthorized. Please check your credentials.";
    } else if (error.response.status === 403) {
      message = message || "Forbidden. You don't have permission.";
    } else if (error.response.status === 404) {
      message = message || "Endpoint not found.";
    } else if (error.response.status === 409) {
      message = message || "Conflict. This email may already be registered.";
    } else if (error.response.status >= 500) {
      message = message || "Server error. Please try again later.";
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
