import instance from "./index";
import type { Payment, PaymentInfo } from "../types/paymentInfo";

// Backend payment endpoints
// GET /api/payments
// GET /api/payments/:id
// POST /api/payments
// PUT /api/payments/:id
// DELETE /api/payments/:id
// Controller also has: processPayment, paymentCallback (not in router)

const getAllPayments = async (): Promise<Payment[]> => {
  const { data } = await instance.get("/payments");
  return data.payments || data;
};

const getPaymentById = async (id: string): Promise<Payment> => {
  const { data } = await instance.get(`/payments/${id}`);
  return data.payment || data;
};

const createPayment = async (payment: Partial<Payment>): Promise<Payment> => {
  const { data } = await instance.post("/payments", payment);
  return data.newPayment || data.payment || data;
};

const updatePayment = async (
  id: string,
  payment: Partial<Payment>
): Promise<Payment> => {
  const { data } = await instance.put(`/payments/${id}`, payment);
  return data.payment || data;
};

const deletePayment = async (id: string): Promise<void> => {
  await instance.delete(`/payments/${id}`);
};

// Process payment (backend has this in controller but not in router)
const processPayment = async (payload: {
  rideId: string;
  amount: number;
  driverId?: string;
}) => {
  // TODO: Backend needs to add POST /api/payments/process route
  const { data } = await instance.post("/payments/process", payload);
  return data;
};

export {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  processPayment,
};

