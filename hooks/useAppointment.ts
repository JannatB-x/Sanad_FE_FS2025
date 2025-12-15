// hooks/useAppointment.ts
import { useState, useCallback } from "react";
import { appointmentAPI } from "../api/appointment.api";
import {
  IAppointment,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../types/appointment.type";

interface UseAppointmentsReturn {
  appointments: IAppointment[];
  loading: boolean;
  error: string | null;
  createAppointment: (data: CreateAppointmentData) => Promise<IAppointment>;
  getAppointments: () => Promise<void>;
  getUpcomingAppointments: () => Promise<void>;
  getAppointmentById: (id: string) => Promise<IAppointment>;
  updateAppointment: (id: string, data: UpdateAppointmentData) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  getAppointmentsByMonth: (year: number, month: number) => Promise<void>;
}

export const useAppointments = (): UseAppointmentsReturn => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAppointment = useCallback(
    async (data: CreateAppointmentData): Promise<IAppointment> => {
      try {
        setLoading(true);
        setError(null);
        const response = await appointmentAPI.createAppointment(data);
        const appointment = response as unknown as IAppointment;
        setAppointments((prev) => [...prev, appointment]);
        return appointment;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to create appointment";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentAPI.getAppointments();
      const appointments = response as unknown as IAppointment[];
      setAppointments(appointments);
    } catch (err: any) {
      setError(err.message || "Failed to get appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUpcomingAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentAPI.getUpcomingAppointments();
      const appointments = response as unknown as IAppointment[];
      setAppointments(appointments);
    } catch (err: any) {
      setError(err.message || "Failed to get upcoming appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  const getAppointmentById = useCallback(
    async (id: string): Promise<IAppointment> => {
      try {
        setLoading(true);
        setError(null);
        const response = await appointmentAPI.getAppointmentById(id);
        const appointment = response as unknown as IAppointment;
        return appointment;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to get appointment";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAppointment = useCallback(
    async (id: string, data: UpdateAppointmentData) => {
      try {
        setLoading(true);
        setError(null);
        const response = await appointmentAPI.updateAppointment(id, data);
        const updated = response as unknown as IAppointment;
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === id ? updated : appointment
          )
        );
      } catch (err: any) {
        const errorMsg = err.message || "Failed to update appointment";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAppointment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await appointmentAPI.deleteAppointment(id);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== id)
      );
    } catch (err: any) {
      const errorMsg = err.message || "Failed to delete appointment";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAppointmentsByMonth = useCallback(
    async (year: number, month: number) => {
      try {
        setLoading(true);
        setError(null);
        const response = await appointmentAPI.getAppointmentsByMonth(
          year,
          month
        );
        const appointments = response as unknown as IAppointment[];
        setAppointments(appointments);
      } catch (err: any) {
        setError(err.message || "Failed to get appointments by month");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    appointments,
    loading,
    error,
    createAppointment,
    getAppointments,
    getUpcomingAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByMonth,
  };
};
