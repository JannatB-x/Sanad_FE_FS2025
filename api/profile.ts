import instance from "./index";
import { removeToken } from "./client";

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
  Avatar?: string; // Profile picture URL
  Documents?: string[]; // Array of document URLs
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
    // Backend has GET /api/users/me endpoint with authorize middleware
    console.log("[Profile API] Attempting to fetch profile from /users/me");
    const response = await instance.get("/users/me");
    console.log("[Profile API] Profile fetch successful:", response.status);
    // Backend returns: { message, user: { id, name, email, role, ... } }
    const userData = response.data.user || response.data;

    // Map backend response (camelCase) to UserProfile format (PascalCase)
    if (userData) {
      return {
        Id: userData.id || userData._id || "",
        Name: userData.name || userData.Name || "",
        Role: userData.role || userData.Role || "user",
        Email: userData.email || userData.Email || "",
        Identification:
          userData.identification || userData.Identification || "",
        Password: "", // Password is not returned from backend
        MedicalHistory:
          userData.medicalHistory || userData.MedicalHistory || "",
        Disabilities: userData.disabilities || userData.Disabilities || "",
        FunctionalNeeds:
          userData.functionalNeeds || userData.FunctionalNeeds || "",
        Location: userData.location || userData.Location || "",
        Bookings: userData.bookings || userData.Bookings || [],
        EmergencyContact:
          userData.emergencyContact || userData.EmergencyContact || "",
        EmergencyContactPhone:
          userData.emergencyContactPhone ||
          userData.EmergencyContactPhone ||
          "",
        EmergencyContactRelationship:
          userData.emergencyContactRelationship ||
          userData.EmergencyContactRelationship ||
          "",
        SavedServices: userData.savedServices || userData.SavedServices || [],
        SavedTransporters:
          userData.savedTransporters || userData.SavedTransporters || [],
        SavedLocations:
          userData.savedLocations || userData.SavedLocations || [],
      };
    }
    throw new Error("No user data received");
  } catch (error: any) {
    console.error("[Profile API] Error fetching profile:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.response?.data?.message || error?.message,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
    });

    // Handle specific error statuses
    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error?.response?.status === 404) {
      console.warn(
        "[Profile API] /users/me endpoint returned 404, trying fallback"
      );
      // Continue to fallback below
    }

    // Try fallback: decode token to get user ID (if /users/me is not available)
    try {
      // Use require for React Native compatibility
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      const token = await AsyncStorage.getItem("auth_token");

      if (token) {
        const userId = decodeToken(token);
        if (userId) {
          const response = await instance.get(`/users/${userId}`);
          const userData = response.data.user || response.data;

          // Map backend response to UserProfile format
          if (userData) {
            return {
              Id: userData._id || userData.id || "",
              Name: userData.Name || userData.name || "",
              Role: userData.Role || userData.role || "user",
              Email: userData.Email || userData.email || "",
              Identification:
                userData.Identification || userData.identification || "",
              Password: "",
              MedicalHistory:
                userData.MedicalHistory || userData.medicalHistory || "",
              Disabilities:
                userData.Disabilities || userData.disabilities || "",
              FunctionalNeeds:
                userData.FunctionalNeeds || userData.functionalNeeds || "",
              Location: userData.Location || userData.location || "",
              Bookings: userData.Bookings || userData.bookings || [],
              EmergencyContact:
                userData.EmergencyContact || userData.emergencyContact || "",
              EmergencyContactPhone:
                userData.EmergencyContactPhone ||
                userData.emergencyContactPhone ||
                "",
              EmergencyContactRelationship:
                userData.EmergencyContactRelationship ||
                userData.emergencyContactRelationship ||
                "",
              SavedServices:
                userData.SavedServices || userData.savedServices || [],
              SavedTransporters:
                userData.SavedTransporters || userData.savedTransporters || [],
              SavedLocations:
                userData.SavedLocations || userData.savedLocations || [],
              Avatar: userData.avatar || userData.Avatar || "",
              Documents: userData.documents || userData.Documents || [],
            };
          }
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

    // If all attempts fail, throw original error with better message
    let errorMessage =
      "Failed to fetch profile. Please ensure you are logged in.";

    if (error?.response?.status === 404) {
      errorMessage =
        "Profile endpoint not found. Please check your backend configuration.";
    } else if (error?.response?.status === 401) {
      errorMessage = "Session expired. Please login again.";
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }

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
 * @param userId - User ID (deprecated, now uses /users/me endpoint)
 * @param data - Profile data to update (PascalCase fields for backend)
 * @returns Promise with updated profile data
 */
export const updateProfile = async (
  userId: string,
  data: UpdateProfileData
): Promise<UserProfile> => {
  try {
    // Convert UpdateProfileData to PascalCase for backend
    const backendData: any = {};
    if (data.Name !== undefined) backendData.Name = data.Name;
    if (data.Email !== undefined) backendData.Email = data.Email;
    if (data.Identification !== undefined)
      backendData.Identification = data.Identification;
    if (data.MedicalHistory !== undefined)
      backendData.MedicalHistory = data.MedicalHistory;
    if (data.Disabilities !== undefined)
      backendData.Disabilities = data.Disabilities;
    if (data.FunctionalNeeds !== undefined)
      backendData.FunctionalNeeds = data.FunctionalNeeds;
    if (data.Location !== undefined) backendData.Location = data.Location;
    if (data.EmergencyContact !== undefined)
      backendData.EmergencyContact = data.EmergencyContact;
    if (data.EmergencyContactPhone !== undefined)
      backendData.EmergencyContactPhone = data.EmergencyContactPhone;
    if (data.EmergencyContactRelationship !== undefined)
      backendData.EmergencyContactRelationship =
        data.EmergencyContactRelationship;
    if (data.SavedServices !== undefined)
      backendData.SavedServices = data.SavedServices;
    if (data.SavedTransporters !== undefined)
      backendData.SavedTransporters = data.SavedTransporters;
    if (data.SavedLocations !== undefined)
      backendData.SavedLocations = data.SavedLocations;

    // Backend has PUT /api/users/me endpoint with authorize middleware
    const response = await instance.put("/users/me", backendData);
    const userData = response.data.user || response.data;

    // Map backend response to UserProfile format
    if (userData) {
      return {
        Id: userData.id || userData._id || userId || "",
        Name: userData.name || userData.Name || "",
        Role: userData.role || userData.Role || "user",
        Email: userData.email || userData.Email || "",
        Identification:
          userData.identification || userData.Identification || "",
        Password: "",
        MedicalHistory:
          userData.medicalHistory || userData.MedicalHistory || "",
        Disabilities: userData.disabilities || userData.Disabilities || "",
        FunctionalNeeds:
          userData.functionalNeeds || userData.FunctionalNeeds || "",
        Location: userData.location || userData.Location || "",
        Bookings: userData.bookings || userData.Bookings || [],
        EmergencyContact:
          userData.emergencyContact || userData.EmergencyContact || "",
        EmergencyContactPhone:
          userData.emergencyContactPhone ||
          userData.EmergencyContactPhone ||
          "",
        EmergencyContactRelationship:
          userData.emergencyContactRelationship ||
          userData.EmergencyContactRelationship ||
          "",
        SavedServices: userData.savedServices || userData.SavedServices || [],
        SavedTransporters:
          userData.savedTransporters || userData.SavedTransporters || [],
        SavedLocations:
          userData.savedLocations || userData.SavedLocations || [],
        Avatar: userData.avatar || userData.Avatar || "",
        Documents: userData.documents || userData.Documents || [],
      };
    }
    throw new Error("No user data received");
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
