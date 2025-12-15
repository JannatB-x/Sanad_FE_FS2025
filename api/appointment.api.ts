// api/appointment.api.ts
import apiClient from "./index";

export interface CreateAppointmentData {
  title: string;
  date: string;
  time: string;
  description?: string;
  rideId?: string;
}

export interface UpdateAppointmentData {
  title?: string;
  date?: string;
  time?: string;
  description?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
}

export const appointmentAPI = {
  // Create a new appointment
  createAppointment: async (data: CreateAppointmentData) => {
    return await apiClient.post("/appointments", data);
  },

  // Get all appointments for current user
  getAppointments: async () => {
    return await apiClient.get("/appointments");
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    return await apiClient.get("/appointments/upcoming");
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId: string) => {
    return await apiClient.get(`/appointments/${appointmentId}`);
  },

  // Update appointment
  updateAppointment: async (
    appointmentId: string,
    data: UpdateAppointmentData
  ) => {
    return await apiClient.put(`/appointments/${appointmentId}`, data);
  },

  // Delete appointment
  deleteAppointment: async (appointmentId: string) => {
    return await apiClient.delete(`/appointments/${appointmentId}`);
  },

  // Get appointments by date
  getAppointmentsByDate: async (date: string) => {
    return await apiClient.get("/appointments/by-date", {
      params: { date },
    });
  },

  // Get appointments by date range
  getAppointmentsByDateRange: async (startDate: string, endDate: string) => {
    return await apiClient.get("/appointments/by-date-range", {
      params: { startDate, endDate },
    });
  },

  // Get appointments for a specific month
  getAppointmentsByMonth: async (year: number, month: number) => {
    return await apiClient.get("/appointments/by-month", {
      params: { year, month },
    });
  },

  // Mark appointment as completed
  completeAppointment: async (appointmentId: string) => {
    return await apiClient.put(`/appointments/${appointmentId}/complete`);
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId: string, reason?: string) => {
    return await apiClient.put(`/appointments/${appointmentId}/cancel`, {
      reason,
    });
  },

  // Confirm appointment
  confirmAppointment: async (appointmentId: string) => {
    return await apiClient.put(`/appointments/${appointmentId}/confirm`);
  },
};
