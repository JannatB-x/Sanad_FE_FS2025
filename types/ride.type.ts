// types/ride.types.ts
import { ILocation } from "./location.type";

export enum RideStatus {
  REQUESTED = "requested",
  ACCEPTED = "accepted",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface IRide {
  _id: string;
  userId: string;
  riderId?: string;
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  status: RideStatus;
  price?: number;
  distance?: number;
  duration?: number;
  scheduledTime?: string;
  startTime?: string;
  endTime?: string;
  rating?: number;
  review?: string;
  needsWheelchair?: boolean;
  needsPatientBed?: boolean;
  wheelchairType?: string;
  passengers?: number;
  specialRequirements?: string;
  createdAt: string;
  updatedAt?: string;
  rider?: {
    _id: string;
    name: string;
    profileImage?: string;
    vehicleInfo: {
      type: string;
      model: string;
      plateNumber: string;
      color: string;
    };
    rating?: number;
  };
  user?: {
    _id: string;
    name: string;
    profileImage?: string;
    emergencyContact?: string;
    emergencyContactPhone?: string;
  };
}

export interface CreateRideData {
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  scheduledTime?: string;
  needsWheelchair?: boolean;
  needsPatientBed?: boolean;
  wheelchairType?: string;
  passengers?: number;
  specialRequirements?: string;
}

export interface UpdateRideData {
  pickupLocation?: ILocation;
  dropoffLocation?: ILocation;
  scheduledTime?: string;
  needsWheelchair?: boolean;
  needsPatientBed?: boolean;
  wheelchairType?: string;
  passengers?: number;
  specialRequirements?: string;
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

export interface RateRideData {
  rating: number;
  review?: string;
}

export interface RideHistoryFilter {
  status?: RideStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface RideResponse {
  success: boolean;
  data: IRide;
}

export interface RidesResponse {
  success: boolean;
  data: IRide[];
}

export interface RideStatsResponse {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalSpent?: number;
  totalEarned?: number;
  averageRating?: number;
}
