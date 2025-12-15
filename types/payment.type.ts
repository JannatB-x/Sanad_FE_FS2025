// types/payment.types.ts

export interface IPayment {
  _id: string;
  rideId: string;
  userId: string;
  riderId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  transactionId: string;
  tapPaymentId?: string;
  createdAt: string;
  updatedAt?: string;
  receipt?: string;
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

export enum PaymentMethodType {
  CARD = "card",
  KNET = "knet",
  BENEFIT = "benefit",
  CASH = "cash",
}

export interface TapPaymentRequest {
  amount: number;
  currency: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: {
      country_code: string;
      number: string;
    };
  };
  source: {
    id: string;
  };
  redirect: {
    url: string;
  };
  metadata?: {
    rideId?: string;
    userId?: string;
  };
}

export interface TapPaymentResponse {
  id: string;
  status: "INITIATED" | "CAPTURED" | "FAILED" | "CANCELLED";
  amount: number;
  currency: string;
  customer: any;
  redirect: {
    url: string;
  };
  transaction: {
    url: string;
  };
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  brand?: string;
  last4?: string;
  expiry?: {
    month: number;
    year: number;
  };
  isDefault?: boolean;
}

export interface PaymentHistory {
  _id: string;
  rideId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  transactionId: string;
  createdAt: string;
  ride?: {
    pickupLocation: { address: string };
    dropoffLocation: { address: string };
  };
}

export interface PaymentStats {
  totalSpent: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  averageRideAmount: number;
}
