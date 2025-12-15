// api/auth.api.ts
// NOTE: API connections are currently disabled
// To enable: Set API_ENABLED = true in constants/API.ts and set API_BASE_URL
import apiClient from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser, UserType } from "../types/user.type";
import { ENDPOINTS } from "../constants/API";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: IUser;
}

// Backend response format (common pattern)
interface BackendAuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: IUser;
    token: string;
  };
  token?: string;
  user?: IUser;
}

export const authAPI = {
  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendAuthResponse>(
        ENDPOINTS.AUTH.REGISTER,
        data
      );

      // Handle different response formats
      // Format 1: { success: true, data: { user, token } }
      if (response.data?.user && response.data?.token) {
        return {
          success: true,
          token: response.data.token,
          user: response.data.user,
        };
      }

      // Format 2: { success: true, user, token } (flat structure)
      if (response.user && response.token) {
        return {
          success: true,
          token: response.token,
          user: response.user,
        };
      }

      // Format 3: Direct AuthResponse
      if ((response as any).token && (response as any).user) {
        return response as unknown as AuthResponse;
      }

      throw new Error(
        response.message || "Invalid response format from server"
      );
    } catch (error: any) {
      // Re-throw with more context
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.message) {
        throw error;
      }
      throw new Error("Registration failed. Please try again.");
    }
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendAuthResponse>(
        ENDPOINTS.AUTH.LOGIN,
        data
      );

      // Handle different response formats
      if (response.data?.user && response.data?.token) {
        return {
          success: true,
          token: response.data.token,
          user: response.data.user,
        };
      }

      if (response.user && response.token) {
        return {
          success: true,
          token: response.token,
          user: response.user,
        };
      }

      if ((response as any).token && (response as any).user) {
        return response as unknown as AuthResponse;
      }

      throw new Error(response.message || "Invalid response format from server");
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.message) {
        throw error;
      }
      throw new Error("Login failed. Please try again.");
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  // Get current user
  getMe: async (): Promise<IUser> => {
    const response = await apiClient.get(ENDPOINTS.AUTH.ME);
    const data = response as unknown as { user?: IUser } & IUser;
    // Handle both response formats: { user: IUser } or IUser directly
    return data.user || (data as IUser);
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  // Helper functions (used by AuthContext)
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  },

  getStoredToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem("token");
  },

  getStoredUser: async (): Promise<IUser | null> => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr) as IUser;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  },

  getUserType: async (): Promise<UserType | null> => {
    const userType = await AsyncStorage.getItem("userType");
    return userType as UserType | null;
  },

  // Clear all stored auth data
  clearAuthData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove(["token", "user", "userType"]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  },

  // Save auth data to storage
  saveAuthData: async (
    token: string,
    user: IUser,
    userType?: UserType
  ): Promise<void> => {
    try {
      const items: [string, string][] = [
        ["token", token],
        ["user", JSON.stringify(user)],
      ];
      if (userType) {
        items.push(["userType", userType]);
      }
      await AsyncStorage.multiSet(items);
    } catch (error) {
      console.error("Error saving auth data:", error);
      throw error;
    }
  },
};
