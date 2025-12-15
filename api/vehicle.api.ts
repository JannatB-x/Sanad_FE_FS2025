// api/vehicle.api.ts
import apiClient from "./index";

export interface CreateVehicleData {
  companyId: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  capacity: number;
  vehicleType:
    | "standard"
    | "wheelchair_accessible"
    | "patient_bed"
    | "ambulance"
    | "medical_transport";
  accessibilityFeatures: string[];
  hasPatientBed: boolean;
  hasOxygenSupport: boolean;
  hasMedicalEquipment: boolean;
  medicalEquipmentList?: string[];
  isWheelchairAccessible: boolean;
  wheelchairType?: string[];
  hasWheelchairRamp: boolean;
  hasWheelchairLift: boolean;
}

export interface VehicleFilterOptions {
  needsWheelchair?: boolean;
  needsPatientBed?: boolean;
  wheelchairType?: string;
  needsMedicalEquipment?: boolean;
  minCapacity?: number;
}

export const vehicleAPI = {
  // Create a new vehicle
  createVehicle: async (data: CreateVehicleData) => {
    return await apiClient.post("/vehicles", data);
  },

  // Get all vehicles
  getVehicles: async () => {
    return await apiClient.get("/vehicles");
  },

  // Get vehicle by ID
  getVehicleById: async (vehicleId: string) => {
    return await apiClient.get(`/vehicles/${vehicleId}`);
  },

  // Update vehicle
  updateVehicle: async (vehicleId: string, data: any) => {
    return await apiClient.put(`/vehicles/${vehicleId}`, data);
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId: string) => {
    return await apiClient.delete(`/vehicles/${vehicleId}`);
  },

  // Search/filter vehicles based on needs
  searchVehicles: async (filters: VehicleFilterOptions) => {
    return await apiClient.post("/vehicles/search", filters);
  },

  // Get company vehicles
  getCompanyVehicles: async (companyId: string) => {
    return await apiClient.get(`/vehicles/company/${companyId}`);
  },

  // Assign rider to vehicle
  assignRiderToVehicle: async (vehicleId: string, riderId: string) => {
    return await apiClient.put(`/vehicles/${vehicleId}/assign-rider`, {
      riderId,
    });
  },

  // Toggle vehicle availability
  toggleVehicleAvailability: async (vehicleId: string) => {
    return await apiClient.put(`/vehicles/${vehicleId}/toggle-availability`);
  },

  // Upload vehicle documents
  uploadVehicleDocument: async (
    vehicleId: string,
    file: any,
    documentType: string
  ) => {
    const formData = new FormData();
    formData.append(documentType, {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || `${documentType}.jpg`,
    } as any);
    formData.append("documentType", documentType);

    return await apiClient.put(
      `/vehicles/${vehicleId}/upload-document`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Get available vehicles for booking
  getAvailableVehicles: async (filters?: VehicleFilterOptions) => {
    return await apiClient.get("/vehicles/available", { params: filters });
  },
};
