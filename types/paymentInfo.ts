// Payment status enum - matches backend enum
export type PaymentStatus = "pending" | "completed" | "failed";

// Payment method enum - matches backend enum
export type PaymentMethod = "cash" | "card" | "wallet";

// Payment type enum - matches backend enum
export type PaymentType = "ride" | "booking" | "other";

// Payment interface - matches backend payment model
export interface Payment {
  _id?: string; // MongoDB _id
  riderId: string; // ObjectId reference to User
  driverId: string; // ObjectId reference to Driver
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate: string; // ISO date string
  paymentRef: string;
  paymentType: PaymentType;
  transactionId: string;
  transactionDate: string; // ISO date string
  transactionAmount: number;
  // Populated fields (when fetched with relations)
  rider?: any; // Populated User
  driver?: any; // Populated Driver
}

// PaymentInfo interface (for UI display)
export interface PaymentInfo {
  Id: string;
  UserId: string;
  PaymentId: string;
  Amount: number;
  Status: PaymentStatus;
  PaymentMethod: PaymentMethod;
  Date: string;
  // Populated fields (when fetched with relations)
  User?: any;
  Payment?: Payment;
}
