// Driver status enum
export type DriverStatus = "available" | "busy" | "offline" | "on_break";

// DriverInfo interface - matches backend driver model
export interface DriverInfo {
  _id?: string; // MongoDB _id
  userId: string; // ObjectId reference to User
  licenseNumber: string;
  vehicleInfo: string; // ObjectId reference to Vehicle
  isAvailable: boolean;
  currentLocation?: string; // ObjectId reference to Location
  earnings: number;
  rating: number;
  bookings?: string[]; // Array of ObjectId references
  // Populated fields (when fetched with relations)
  user?: any; // Populated User
  vehicle?: any; // Populated Vehicle
  location?: any; // Populated Location
}
