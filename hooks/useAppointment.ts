// hooks/useAppointment.ts
import { useState, useCallback, useEffect } from "react";
import { appointmentAPI } from "../api/appointment.api";
import {
  IAppointment,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../types/appointment.type";
import { API_ENABLED } from "../constants/API";
import { useAuth } from "./useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const APPOINTMENTS_STORAGE_KEY = "appointments";

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
  const { user } = useAuth();

  // Load appointments from storage on mount (when API is disabled)
  useEffect(() => {
    const loadStoredAppointments = async () => {
      if (!API_ENABLED) {
        try {
          const stored = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
          if (stored) {
            const parsedAppointments = JSON.parse(stored) as IAppointment[];
            setAppointments(parsedAppointments);
          }
        } catch (error) {
          console.error("Error loading stored appointments:", error);
        }
      }
    };
    loadStoredAppointments();
  }, []);

  // Helper function to save appointments to storage
  const saveAppointmentsToStorage = useCallback(
    async (appointmentsToSave: IAppointment[]) => {
      if (!API_ENABLED) {
        try {
          await AsyncStorage.setItem(
            APPOINTMENTS_STORAGE_KEY,
            JSON.stringify(appointmentsToSave)
          );
        } catch (error) {
          console.error("Error saving appointments to storage:", error);
        }
      }
    },
    []
  );

  const createAppointment = useCallback(
    async (data: CreateAppointmentData): Promise<IAppointment> => {
      try {
        setLoading(true);
        setError(null);

        // API connections disabled - using mock appointment for development
        // TODO: Re-enable API call when backend is ready
        if (!API_ENABLED) {
          // Create mock appointment
          const mockAppointment: IAppointment = {
            _id: "appointment-" + Date.now(),
            userId: user?._id || "mock-user-id",
            title: data.title,
            date: data.date,
            time: data.time,
            description: data.description,
            status: "pending" as any, // Keep for type compatibility but not used
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Add to state immediately
          setAppointments((prev) => {
            const updated = [...prev, mockAppointment];
            // Save to storage
            saveAppointmentsToStorage(updated);
            return updated;
          });
          return mockAppointment;
        }

        // API enabled - make actual API call
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
    [user]
  );

  const getAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // API connections disabled - load from storage
      if (!API_ENABLED) {
        try {
          const stored = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
          if (stored) {
            const parsedAppointments = JSON.parse(stored) as IAppointment[];
            setAppointments(parsedAppointments);
          } else {
            // No stored appointments, keep current state
          }
        } catch (error) {
          console.error("Error loading appointments from storage:", error);
        }
        return;
      }

      const response = await appointmentAPI.getAppointments();
      const appointments = response as unknown as IAppointment[];
      setAppointments(appointments);
    } catch (err: any) {
      setError(err.message || "Failed to get appointments");
      // Don't clear appointments on error - keep existing ones
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

        // API connections disabled - using mock update for development
        if (!API_ENABLED) {
          // Find and update appointment in state
          setAppointments((prev) => {
            const updated = prev.map((appointment) => {
              if (appointment._id === id) {
                return {
                  ...appointment,
                  ...data,
                  updatedAt: new Date().toISOString(),
                } as IAppointment;
              }
              return appointment;
            });
            // Save to storage
            saveAppointmentsToStorage(updated);
            return updated;
          });
          return;
        }

        // API enabled - make actual API call
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

      // API connections disabled - using mock delete for development
      if (!API_ENABLED) {
        // Remove appointment from state
        setAppointments((prev) => {
          const updated = prev.filter((appointment) => appointment._id !== id);
          // Save to storage
          saveAppointmentsToStorage(updated);
          return updated;
        });
        return;
      }

      // API enabled - make actual API call
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
