// api/rider.api.ts
import apiClient from "./index";

export interface UpdateRiderLocationData {
  lat: number;
  lng: number;
  address?: string;
}

export interface RiderEarnings {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface NearbyRider {
  _id: string;
  userId: string;
  vehicleInfo: {
    type: string;
    model: string;
    plateNumber: string;
    color: string;
  };
  currentLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  rating: number;
  distance: number;
  estimatedTime: number;
}

export const riderAPI = {
  // Get all riders
  getRiders: async () => {
    return await apiClient.get("/riders");
  },

  // Get rider by ID
  getRiderById: async (riderId: string) => {
    return await apiClient.get(`/riders/${riderId}`);
  },

  // Get current rider profile
  getRiderProfile: async () => {
    return await apiClient.get("/riders/profile");
  },

  // Update rider profile
  updateRiderProfile: async (data: any) => {
    return await apiClient.put("/riders/profile", data);
  },

  // Get rider ride history
  getRiderRideHistory: async (riderId?: string) => {
    const url = riderId
      ? `/riders/${riderId}/ride-history`
      : "/riders/ride-history";
    return await apiClient.get(url);
  },

  // Update rider location
  updateRiderLocation: async (data: UpdateRiderLocationData) => {
    return await apiClient.put("/riders/location", data);
  },

  // Get rider location
  getRiderLocation: async (riderId: string) => {
    return await apiClient.get(`/riders/${riderId}/location`);
  },

  // Toggle rider availability (available/unavailable for rides)
  toggleAvailability: async () => {
    return await apiClient.put("/riders/availability");
  },

  // Update rider status (online/offline)
  updateRiderStatus: async (status: "online" | "offline") => {
    return await apiClient.put("/riders/status", { status });
  },

  // Get rider earnings
  getRiderEarnings: async (): Promise<RiderEarnings> => {
    return await apiClient.get("/riders/earnings");
  },

  // Get nearby riders for a location
  getNearbyRiders: async (location: {
    lat: number;
    lng: number;
  }): Promise<NearbyRider[]> => {
    return await apiClient.get("/riders/nearby", {
      params: location,
    });
  },

  // Accept a ride request (rider accepts)
  acceptRide: async (rideId: string) => {
    return await apiClient.post(`/rides/${rideId}/accept`);
  },

  // Start a ride (rider starts the trip)
  startRide: async (rideId: string) => {
    return await apiClient.post(`/rides/${rideId}/start`);
  },

  // Complete a ride (rider completes the trip)
  completeRide: async (rideId: string) => {
    return await apiClient.post(`/rides/${rideId}/complete`);
  },

  // Get active ride for rider
  getActiveRide: async () => {
    return await apiClient.get("/riders/active-ride");
  },

  // Upload rider license document
  uploadRiderLicense: async (file: any) => {
    const formData = new FormData();
    formData.append("driverLicense", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || "license.jpg",
    } as any);

    return await apiClient.put("/riders/license", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload vehicle image
  uploadVehicleImage: async (file: any) => {
    const formData = new FormData();
    formData.append("vehicleImage", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || "vehicle.jpg",
    } as any);

    return await apiClient.put("/riders/vehicle-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update rider vehicle info
  updateVehicleInfo: async (vehicleInfo: {
    type: string;
    model: string;
    plateNumber: string;
    color: string;
    year?: number;
  }) => {
    return await apiClient.put("/riders/vehicle-info", vehicleInfo);
  },

  // Delete rider account
  deleteRider: async (riderId: string) => {
    return await apiClient.delete(`/riders/${riderId}`);
  },
};
