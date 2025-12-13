// History type enum - matches backend enum
export type HistoryType = "ride" | "payment" | "booking" | "service" | "other";

// History interface - matches backend history model
export interface History {
  _id?: string; // MongoDB _id
  userId: string; // ObjectId reference to User
  type: HistoryType;
  action: string;
  description: string;
  relatedId?: string; // ObjectId reference (to Ride, Payment, etc.)
  metadata?: Record<string, any>;
  createdAt: string; // ISO date string
  // Populated fields (when fetched with relations)
  user?: any; // Populated User
}

// HistoryInfo interface (for UI display)
export interface HistoryInfo {
  UserId: string;
  TotalRides: number;
  CompletedRides: number;
  CancelledRides: number;
  TotalSpent: number;
  History: History[];
  // Populated fields
  User?: any;
}
