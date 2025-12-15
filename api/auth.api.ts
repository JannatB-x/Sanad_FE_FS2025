// api/auth.api.ts
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

export const authAPI = {
  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
    return response as unknown as AuthResponse;
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, data);
    return response as unknown as AuthResponse;
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
