// Ride status enum - matches backend enum
export type RideStatus =
  | "requested"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

// Ride type enum (not in backend model, but may be used)
export type RideType =
  | "standard"
  | "wheelchair_accessible"
  | "medical_transport"
  | "emergency";

// Payment method enum - matches backend enum
export type PaymentMethod = "cash" | "card" | "wallet";

// Location interface - matches backend pickup/dropoff structure
export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

// Ride interface - matches backend ride model
export interface Ride {
  _id?: string; // MongoDB _id
  riderId: string; // ObjectId reference to User
  driverId?: string; // ObjectId reference to Driver
  status: RideStatus;
  pickup: Location;
  dropoff: Location;
  fare: number;
  distance: number; // in km
  duration: number; // in minutes
  paymentMethod: PaymentMethod;
  requestedAt: string; // ISO date string
  acceptedAt?: string; // ISO date string
  completedAt?: string; // ISO date string
  // Populated fields (when fetched with relations)
  rider?: any; // Populated User
  driver?: any; // Populated Driver
}

// RideRequest interface (for creating ride requests)
export interface RideRequest {
  pickup: Location;
  dropoff: Location;
  paymentMethod: PaymentMethod;
}

// Legacy interface (for backward compatibility)
export interface RideRequestResponse extends RideRequest {
  Id: string;
  Status: RideStatus;
  CreatedAt: string;
  UpdatedAt: string;
}
