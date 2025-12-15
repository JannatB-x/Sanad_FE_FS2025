// api/company.api.ts
import apiClient from "../api/index";

export interface CreateCompanyData {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  licenseNumber: string;
  licenseExpirationDate: string;
}

export interface UpdateCompanyData {
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
  logo?: string;
}

export const companyAPI = {
  // Create company
  createCompany: async (data: CreateCompanyData) => {
    return await apiClient.post("/companies", data);
  },

  // Get all companies
  getCompanies: async () => {
    return await apiClient.get("/companies");
  },

  // Get company by ID
  getCompanyById: async (companyId: string) => {
    return await apiClient.get(`/companies/${companyId}`);
  },

  // Get company profile (current company)
  getCompanyProfile: async () => {
    return await apiClient.get("/companies/profile");
  },

  // Update company
  updateCompany: async (companyId: string, data: UpdateCompanyData) => {
    return await apiClient.put(`/companies/${companyId}`, data);
  },

  // Delete company
  deleteCompany: async (companyId: string) => {
    return await apiClient.delete(`/companies/${companyId}`);
  },

  // Get company riders
  getCompanyRiders: async (companyId: string) => {
    return await apiClient.get(`/companies/${companyId}/riders`);
  },

  // Add rider to company
  addRiderToCompany: async (companyId: string, riderId: string) => {
    return await apiClient.post(`/companies/${companyId}/riders`, { riderId });
  },

  // Remove rider from company
  removeRiderFromCompany: async (companyId: string, riderId: string) => {
    return await apiClient.delete(`/companies/${companyId}/riders/${riderId}`);
  },

  // Get company vehicles
  getCompanyVehicles: async (companyId: string) => {
    return await apiClient.get(`/companies/${companyId}/vehicles`);
  },

  // Upload company logo
  uploadCompanyLogo: async (companyId: string, file: any) => {
    const formData = new FormData();
    formData.append("logo", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || "logo.jpg",
    } as any);

    return await apiClient.put(`/companies/${companyId}/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload license image
  uploadLicenseImage: async (companyId: string, file: any) => {
    const formData = new FormData();
    formData.append("licenseImage", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || "license.jpg",
    } as any);

    return await apiClient.put(
      `/companies/${companyId}/license-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Get company statistics
  getCompanyStats: async (companyId: string) => {
    return await apiClient.get(`/companies/${companyId}/stats`);
  },
};
