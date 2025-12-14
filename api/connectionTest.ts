/**
 * Connection test utility to verify backend server connectivity
 */

import { API_URL } from "../constants/config";
import api from "./client";

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    url: string;
    status?: number;
    error?: string;
    code?: string;
  };
}

/**
 * Test connection to the backend server
 * @returns Promise with connection test result
 */
export async function testConnection(): Promise<ConnectionTestResult> {
  const testUrl = `${API_URL.replace("/api", "")}/api`; // Test the /api endpoint

  try {
    console.log("[Connection Test] Testing connection to:", testUrl);

    const response = await api.get("/", {
      timeout: 10000, // 10 second timeout for connection test
    });

    console.log("[Connection Test] Success:", response.status);

    return {
      success: true,
      message: "Successfully connected to server",
      details: {
        url: testUrl,
        status: response.status,
      },
    };
  } catch (error: any) {
    console.error("[Connection Test] Failed:", error);

    const isNetworkError =
      !error.response &&
      (error.code === "ECONNREFUSED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ERR_NETWORK" ||
        error.message?.includes("Network Error") ||
        error.message?.includes("timeout"));

    if (isNetworkError) {
      return {
        success: false,
        message: `Cannot connect to server at ${API_URL}`,
        details: {
          url: testUrl,
          error: error.message || "Network error",
          code: error.code,
        },
      };
    }

    // If we got a response, the server is reachable but returned an error
    return {
      success: true, // Server is reachable
      message: `Server is reachable but returned status ${error.response?.status}`,
      details: {
        url: testUrl,
        status: error.response?.status,
        error: error.response?.data?.message || error.message,
      },
    };
  }
}

/**
 * Test if the registration endpoint is accessible
 * @returns Promise with endpoint test result
 */
export async function testRegistrationEndpoint(): Promise<ConnectionTestResult> {
  try {
    console.log("[Connection Test] Testing registration endpoint");

    // Try to hit the endpoint (will fail with validation error, but that means it's reachable)
    const response = await api.post(
      "/users/register",
      {
        Email: "test@test.com",
        Password: "test",
      },
      {
        timeout: 10000,
        validateStatus: () => true, // Accept any status code
      }
    );

    // If we get a response (even 400), the endpoint exists
    if (response.status === 400 || response.status === 201) {
      return {
        success: true,
        message: "Registration endpoint is accessible",
        details: {
          url: `${API_URL}/users/register`,
          status: response.status,
        },
      };
    }

    return {
      success: false,
      message: `Registration endpoint returned unexpected status: ${response.status}`,
      details: {
        url: `${API_URL}/users/register`,
        status: response.status,
      },
    };
  } catch (error: any) {
    const isNetworkError =
      !error.response &&
      (error.code === "ECONNREFUSED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ERR_NETWORK");

    if (isNetworkError) {
      return {
        success: false,
        message: `Cannot reach registration endpoint at ${API_URL}/users/register`,
        details: {
          url: `${API_URL}/users/register`,
          error: error.message || "Network error",
          code: error.code,
        },
      };
    }

    // If we got a response, the endpoint exists
    return {
      success: true,
      message: "Registration endpoint is accessible",
      details: {
        url: `${API_URL}/users/register`,
        status: error.response?.status,
      },
    };
  }
}
