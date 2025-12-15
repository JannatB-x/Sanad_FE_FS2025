// api/user.api.ts
import apiClient from "./index";

export interface UpdateProfileData {
  name?: string;
  diseases?: string[];
  disabilityLevel?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

export interface EmergencyContactInfo {
  emergencyContact: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export interface MedicalInfo {
  diseases: string[];
  disabilityLevel: string;
  statusDocuments?: string[];
}

export const userAPI = {
  // Get all users (admin only)
  getUsers: async () => {
    return await apiClient.get("/users");
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    return await apiClient.get(`/users/${userId}`);
  },

  // Get current user profile
  getProfile: async () => {
    return await apiClient.get("/users/profile");
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData) => {
    return await apiClient.put("/users/profile", data);
  },

  // Update emergency contact
  updateEmergencyContact: async (data: EmergencyContactInfo) => {
    return await apiClient.put("/users/emergency-contact", data);
  },

  // Update medical info
  updateMedicalInfo: async (data: MedicalInfo) => {
    return await apiClient.put("/users/medical-info", data);
  },

  // Get user ride history
  getRideHistory: async (userId?: string) => {
    const url = userId
      ? `/users/${userId}/ride-history`
      : "/users/ride-history";
    return await apiClient.get(url);
  },

  // Get user ride ratings
  getRideRatings: async (userId?: string) => {
    const url = userId
      ? `/users/${userId}/ride-ratings`
      : "/users/ride-ratings";
    return await apiClient.get(url);
  },

  // Get user appointments
  getUserAppointments: async (userId?: string) => {
    const url = userId
      ? `/users/${userId}/appointments`
      : "/users/appointments";
    return await apiClient.get(url);
  },

  // Update user location
  updateUserLocation: async (userId: string, location: any) => {
    return await apiClient.put(`/users/${userId}/location`, location);
  },

  // Get user location
  getUserLocation: async (userId: string) => {
    return await apiClient.get(`/users/${userId}/location`);
  },

  // Upload status document (single)
  uploadStatusDocument: async (file: any) => {
    const formData = new FormData();
    formData.append("statusDocument", {
      uri: file.uri,
      type: file.type || "application/pdf",
      name: file.name || "document.pdf",
    } as any);

    return await apiClient.put("/users/status-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload multiple status documents
  uploadStatusDocuments: async (files: any[]) => {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("statusDocuments", {
        uri: file.uri,
        type: file.type || "application/pdf",
        name: file.name || `document-${index}.pdf`,
      } as any);
    });

    return await apiClient.put("/users/status-documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload profile image
  uploadProfileImage: async (file: any) => {
    const formData = new FormData();
    formData.append("profileImage", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || "profile.jpg",
    } as any);

    return await apiClient.put("/users/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete user account
  deleteAccount: async () => {
    return await apiClient.delete("/users/account");
  },

  // Update user (admin)
  updateUser: async (userId: string, data: any) => {
    return await apiClient.put(`/users/${userId}`, data);
  },

  // Delete user (admin)
  deleteUser: async (userId: string) => {
    return await apiClient.delete(`/users/${userId}`);
  },
};
