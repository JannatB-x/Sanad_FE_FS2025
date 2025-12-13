import instance from "./index";
import { removeToken } from "./storage";

export interface UserProfile {
  Id: string;
  Name: string;
  Role: string;
  Email: string;
  Identification: string;
  Password: string;
  MedicalHistory: string;
  Disabilities: string;
  FunctionalNeeds: string;
  Location: string;
  Bookings: string[];
  EmergencyContact: string;
  EmergencyContactPhone: string;
  EmergencyContactRelationship: string;
  SavedServices: string[];
  SavedTransporters: string[];
  SavedLocations: string[];
}

export interface UpdateProfileData {
  Name?: string;
  Email?: string;
  Identification?: string;
  Password?: string;
  MedicalHistory?: string;
  Disabilities?: string;
  FunctionalNeeds?: string;
  Location?: string;
  EmergencyContact?: string;
  EmergencyContactPhone?: string;
  EmergencyContactRelationship?: string;
  SavedServices?: string[];
  SavedTransporters?: string[];
  SavedLocations?: string[];
}

/**
 * Decode JWT token to extract user ID
 * @param token - JWT token string
 * @returns User ID or null
 */
const decodeToken = (token: string): string | null => {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = parts[1];
    // Replace URL-safe base64 characters
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed for base64 decoding
    const paddedPayload = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    // Decode base64 - React Native compatible approach
    let decoded: any;
    try {
      // Try atob first (available in React Native)
      if (typeof atob !== "undefined") {
        decoded = JSON.parse(atob(paddedPayload));
      } else if (typeof Buffer !== "undefined") {
        // Fallback to Buffer if available
        decoded = JSON.parse(
          Buffer.from(paddedPayload, "base64").toString("utf-8")
        );
      } else {
        // Manual base64 decode as last resort
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let result = "";
        let i = 0;
        while (i < paddedPayload.length) {
          const enc1 = chars.indexOf(paddedPayload.charAt(i++));
          const enc2 = chars.indexOf(paddedPayload.charAt(i++));
          const enc3 = chars.indexOf(paddedPayload.charAt(i++));
          const enc4 = chars.indexOf(paddedPayload.charAt(i++));
          const bitmap = (enc1 << 18) | (enc2 << 12) | (enc3 << 6) | enc4;
          if (enc3 !== 64) result += String.fromCharCode((bitmap >> 16) & 255);
          if (enc4 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
        }
        decoded = JSON.parse(result);
      }
    } catch (decodeError) {
      console.error("Base64 decode error:", decodeError);
      return null;
    }

    // Try common JWT payload fields for user ID
    return (
      decoded.userId ||
      decoded.user_id ||
      decoded.id ||
      decoded.Id ||
      decoded.sub ||
      null
    );
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Get current user profile
 * Tries /users/me endpoint first, falls back to decoding token and using /users/:id
 * @returns Promise with user profile data
 */
export const getMyProfile = async (): Promise<UserProfile> => {
  try {
    // Try /users/me endpoint first
    const response = await instance.get("/users/me");
    return response.data.user || response.data;
  } catch (error: any) {
    // If /users/me fails, try to decode token and use /users/:id
    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    // Try fallback: decode token to get user ID
    try {
      // Use require for React Native compatibility (static import causes bundling issues)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const storageModule = require("./storage");
      const getTokenFn = storageModule.getToken;

      if (!getTokenFn || typeof getTokenFn !== "function") {
        console.error("getToken is not available from storage module");
        throw new Error("getToken function not available");
      }

      const token = await getTokenFn();
      if (token) {
        const userId = decodeToken(token);
        if (userId) {
          const response = await instance.get(`/users/${userId}`);
          return response.data.user || response.data;
        } else {
          console.warn("Could not extract user ID from token");
        }
      } else {
        console.warn("No token found in storage");
      }
    } catch (fallbackError: any) {
      console.error("Fallback profile fetch failed:", fallbackError);
      // Don't throw here, let the original error be thrown below
    }

    // If all attempts fail, throw original error
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch profile. Please ensure you are logged in.";
    throw new Error(errorMessage);
  }
};

/**
 * Get user profile by ID
 * @param userId - User ID
 * @returns Promise with user profile data
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await instance.get(`/users/${userId}`);
    return response.data.user || response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch profile";
    throw new Error(errorMessage);
  }
};

/**
 * Update user profile
 * @param userId - User ID
 * @param data - Profile data to update
 * @returns Promise with updated profile data
 */
export const updateProfile = async (
  userId: string,
  data: UpdateProfileData
): Promise<UserProfile> => {
  try {
    const response = await instance.put(`/users/${userId}`, data);
    return response.data.user || response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to update profile";
    throw new Error(errorMessage);
  }
};

/**
 * Logout user by removing token
 */
export const logout = async (): Promise<void> => {
  await removeToken();
};
