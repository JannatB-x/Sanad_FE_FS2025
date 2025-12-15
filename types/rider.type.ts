export interface IRider {
  _id: string;
  userId: string;
  licenseNumber: string;
  vehicleInfo: IVehicleInfo;
  currentLocation?: ILocation;
  isAvailable: boolean;
  rating?: number;
  totalRides?: number;
  earnings?: number;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVehicleInfo {
  type: string;
  model: string;
  plateNumber: string;
  color: string;
  year?: number;
  image?: string;
}

export interface ILocation {
  lat: number;
  lng: number;
  address?: string;
}

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
  breakdown?: {
    rides: number;
    tips: number;
    bonuses: number;
  };
}

export interface NearbyRider {
  _id: string;
  userId: string;
  vehicleInfo: IVehicleInfo;
  currentLocation: ILocation;
  rating: number;
  totalRides: number;
  distance: number; // in kilometers
  estimatedTime: number; // in minutes
}

export interface CreateRiderData {
  userId: string;
  licenseNumber: string;
  vehicleInfo: IVehicleInfo;
  companyId?: string;
}

export interface UpdateRiderData {
  licenseNumber?: string;
  vehicleInfo?: IVehicleInfo;
  isAvailable?: boolean;
  currentLocation?: ILocation;
  companyId?: string;
}

export interface RiderResponse {
  success: boolean;
  data: IRider;
}

export interface RidersResponse {
  success: boolean;
  data: IRider[];
}
