import { apiRequest } from "./client";
import type { AuthResponse, User } from "../types/index.ts";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  core_values?: string[];
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  // Backend expects: POST /api/users/login with { Email, Password }
  // Convert camelCase to PascalCase for backend
  try {
    return await apiRequest<AuthResponse>("/users/login", {
      method: "POST",
      body: {
        Email: input.email,
        Password: input.password,
      },
      requiresAuth: false,
    });
  } catch (error: any) {
    if (error?.status === 404) {
      throw new Error(
        "Login endpoint not found. Please ensure the backend server is running and has the /api/users/login route registered."
      );
    }
    throw error;
  }
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  // Backend expects: POST /api/users/register with PascalCase fields
  try {
    console.log("[Auth API] Registering user with:", {
      email: input.email,
      username: input.username,
    });

    const response = await apiRequest<AuthResponse>("/users/register", {
      method: "POST",
      body: {
        Email: input.email,
        Password: input.password,
        Name: input.username,
        Username: input.username,
      },
      requiresAuth: false,
    });

    console.log("[Auth API] Registration successful");
    return response;
  } catch (error: any) {
    console.error("[Auth API] Registration error:", {
      status: error?.status,
      message: error?.message,
      code: error?.code,
      isNetworkError: error?.isNetworkError,
      response: error?.response?.data,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      fullURL:
        error?.config?.baseURL && error?.config?.url
          ? `${error.config.baseURL}${error.config.url}`
          : undefined,
    });

    // Handle network errors
    if (error?.isNetworkError || !error?.response) {
      throw error; // Re-throw network error as-is (it already has a good message)
    }

    if (error?.status === 404) {
      throw new Error(
        "Registration endpoint not found. Please ensure the backend server is running and has the /api/users/register route registered."
      );
    }

    // Re-throw with better error message
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
}

export async function getProfile(): Promise<User> {
  // Backend has GET /api/users/me endpoint with authorize middleware
  const response = await apiRequest<{ message: string; user: User }>(
    "/users/me",
    {
      method: "GET",
      requiresAuth: true,
    }
  );
  return response.user;
}
