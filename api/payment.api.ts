// api/payment.api.ts
import apiClient from "./index";

export interface CreatePaymentData {
  rideId: string;
  amount: number;
  currency?: string; // Default: KWD
  paymentMethod?: "card" | "knet" | "benefit";
  saveCard?: boolean;
}

export interface TapPaymentResponse {
  id: string;
  status: "INITIATED" | "CAPTURED" | "FAILED" | "CANCELLED";
  amount: number;
  currency: string;
  redirect: {
    url: string;
  };
  transaction: {
    url: string;
  };
}

export interface PaymentMethod {
  id: string;
  type: "card" | "knet" | "benefit";
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
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export const paymentAPI = {
  // Create payment for a ride
  createPayment: async (
    data: CreatePaymentData
  ): Promise<TapPaymentResponse> => {
    return await apiClient.post("/payments/create", data);
  },

  // Verify payment status
  verifyPayment: async (paymentId: string) => {
    return await apiClient.get(`/payments/verify/${paymentId}`);
  },

  // Get payment by ID
  getPaymentById: async (paymentId: string) => {
    return await apiClient.get(`/payments/${paymentId}`);
  },

  // Get user payment history
  getPaymentHistory: async (filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    limit?: number;
  }) => {
    return await apiClient.get("/payments/history", { params: filters });
  },

  // Process payment after Tap redirect
  processPayment: async (tapId: string, rideId: string) => {
    return await apiClient.post("/payments/process", { tapId, rideId });
  },

  // Refund payment
  refundPayment: async (paymentId: string, reason?: string) => {
    return await apiClient.post(`/payments/${paymentId}/refund`, { reason });
  },

  // Save payment method
  savePaymentMethod: async (data: {
    type: "card" | "knet";
    token: string;
    setAsDefault?: boolean;
  }) => {
    return await apiClient.post("/payments/methods", data);
  },

  // Get saved payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    return await apiClient.get("/payments/methods");
  },

  // Delete payment method
  deletePaymentMethod: async (methodId: string) => {
    return await apiClient.delete(`/payments/methods/${methodId}`);
  },

  // Set default payment method
  setDefaultPaymentMethod: async (methodId: string) => {
    return await apiClient.put(`/payments/methods/${methodId}/default`);
  },

  // Get payment summary/stats
  getPaymentStats: async () => {
    return await apiClient.get("/payments/stats");
  },

  // Handle payment webhook (backend will call this)
  handleWebhook: async (webhookData: any) => {
    return await apiClient.post("/payments/webhook", webhookData);
  },

  // Calculate payment amount for ride
  calculatePaymentAmount: async (rideId: string) => {
    return await apiClient.get(`/payments/calculate/${rideId}`);
  },

  // Pay for ride with saved method
  payWithSavedMethod: async (rideId: string, methodId: string) => {
    return await apiClient.post("/payments/pay-with-saved", {
      rideId,
      methodId,
    });
  },

  // Get payment receipt
  getPaymentReceipt: async (paymentId: string) => {
    return await apiClient.get(`/payments/${paymentId}/receipt`);
  },

  // Download payment receipt as PDF
  downloadReceipt: async (paymentId: string) => {
    return await apiClient.get(`/payments/${paymentId}/receipt/download`, {
      responseType: "blob",
    });
  },
};
