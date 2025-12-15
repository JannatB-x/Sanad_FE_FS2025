// api/ride.api.ts
import apiClient from "./index";
import { ENDPOINTS } from "../constants/API";

export interface CreateRideData {
  pickupLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  dropoffLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  scheduledTime?: string;
  needsWheelchair?: boolean;
  needsPatientBed?: boolean;
  wheelchairType?: string;
  passengers?: number;
  specialRequirements?: string;
}

export interface UpdateRideData {
  pickupLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  dropoffLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  scheduledTime?: string;
  needsWheelchair?: boolean;
  needsPatientBed?: boolean;
  wheelchairType?: string;
  passengers?: number;
  specialRequirements?: string;
}

export interface RateRideData {
  rating: number;
  review?: string;
}

export interface PriceCalculation {
  price: number;
  distance: number;
  breakdown: {
    baseFare: number;
    distanceFare: number;
    total: number;
  };
}

export const rideAPI = {
  // Create a new ride (book a ride)
  createRide: async (data: CreateRideData) => {
    return await apiClient.post("/rides", data);
  },

  // Get ride by ID
  getRideById: async (rideId: string) => {
    return await apiClient.get(`/rides/${rideId}`);
  },

  // Update ride (pickup/dropoff locations, etc.)
  updateRide: async (rideId: string, data: UpdateRideData) => {
    return await apiClient.patch(ENDPOINTS.RIDES.UPDATE(rideId), data);
  },

  // Get all rides (admin)
  getRides: async () => {
    return await apiClient.get("/rides");
  },

  // Get user's rides
  getMyRides: async () => {
    return await apiClient.get("/rides/my-rides");
  },

  // Get ride history with filters
  getRideHistory: async (filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
  }) => {
    return await apiClient.get("/rides/history", { params: filters });
  },

  // Update ride status
  updateRideStatus: async (rideId: string, status: string) => {
    return await apiClient.put(`/rides/${rideId}/status`, { status });
  },

  // Cancel a ride
  cancelRide: async (rideId: string, reason?: string) => {
    return await apiClient.delete(`/rides/${rideId}`, {
      data: { reason },
    });
  },

  // Rate a ride
  rateRide: async (rideId: string, data: RateRideData) => {
    return await apiClient.post(`/rides/${rideId}/rate`, data);
  },

  // Calculate ride price
  calculatePrice: async (
    pickupLocation: { lat: number; lng: number },
    dropoffLocation: { lat: number; lng: number }
  ): Promise<PriceCalculation> => {
    return await apiClient.post("/rides/calculate-price", {
      pickupLocation,
      dropoffLocation,
    });
  },

  // Get nearby riders/drivers
  getNearbyRiders: async (location: { lat: number; lng: number }) => {
    return await apiClient.get("/rides/nearby-riders", {
      params: location,
    });
  },

  // Accept ride (rider accepts)
  acceptRide: async (rideId: string) => {
    return await apiClient.post(`/rides/${rideId}/accept`);
  },

  // Start ride (rider starts)
  startRide: async (rideId: string) => {
    return await apiClient.post(`/rides/${rideId}/start`);
  },

  // Complete ride (rider completes)
  completeRide: async (rideId: string) => {
    return await apiClient.post(`/rides/${rideId}/complete`);
  },

  // Get active ride (for both user and rider)
  getActiveRide: async () => {
    return await apiClient.get("/rides/active");
  },

  // Get upcoming rides
  getUpcomingRides: async () => {
    return await apiClient.get("/rides/upcoming");
  },

  // Get completed rides
  getCompletedRides: async () => {
    return await apiClient.get("/rides/completed");
  },

  // Get ride statistics
  getRideStats: async () => {
    return await apiClient.get("/rides/stats");
  },

  // Track ride in real-time (get current ride status)
  trackRide: async (rideId: string) => {
    return await apiClient.get(`/rides/${rideId}/track`);
  },

  // Search for suitable vehicles based on needs
  searchVehicles: async (filters: {
    needsWheelchair?: boolean;
    needsPatientBed?: boolean;
    wheelchairType?: string;
    needsMedicalEquipment?: boolean;
    minCapacity?: number;
  }) => {
    return await apiClient.post("/rides/search-vehicles", filters);
  },
};
