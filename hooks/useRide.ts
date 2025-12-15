// hooks/useRide.ts
import { useState, useCallback, useEffect } from "react";
import { rideAPI, UpdateRideData } from "../api/ride.api";
import { IRide, CreateRideData, RideStatus } from "../types/ride.type";
import { ILocation } from "../types/location.type";
import { API_ENABLED } from "../constants/API";
import { useAuth } from "./useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RIDES_STORAGE_KEY = "rides";

interface UseRideReturn {
  rides: IRide[];
  activeRide: IRide | null;
  loading: boolean;
  error: string | null;
  createRide: (data: CreateRideData) => Promise<IRide>;
  updateRide: (rideId: string, data: UpdateRideData) => Promise<IRide>;
  getRideById: (rideId: string) => Promise<IRide>;
  getMyRides: () => Promise<void>;
  getActiveRide: () => Promise<void>;
  cancelRide: (rideId: string, reason?: string) => Promise<void>;
  rateRide: (rideId: string, rating: number, review?: string) => Promise<void>;
  calculatePrice: (
    pickup: ILocation,
    dropoff: ILocation
  ) => Promise<{ price: number; distance: number }>;
}

export const useRide = (): UseRideReturn => {
  const [rides, setRides] = useState<IRide[]>([]);
  const [activeRide, setActiveRide] = useState<IRide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load rides from storage on mount (when API is disabled)
  useEffect(() => {
    const loadStoredRides = async () => {
      if (!API_ENABLED) {
        try {
          const stored = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
          if (stored) {
            const parsedRides = JSON.parse(stored) as IRide[];
            setRides(parsedRides);
          }
        } catch (error) {
          console.error("Error loading stored rides:", error);
        }
      }
    };
    loadStoredRides();
  }, []);

  // Helper function to save rides to storage
  const saveRidesToStorage = useCallback(
    async (ridesToSave: IRide[]) => {
      if (!API_ENABLED) {
        try {
          await AsyncStorage.setItem(
            RIDES_STORAGE_KEY,
            JSON.stringify(ridesToSave)
          );
        } catch (error) {
          console.error("Error saving rides to storage:", error);
        }
      }
    },
    []
  );

  const createRide = useCallback(
    async (data: CreateRideData): Promise<IRide> => {
      try {
        setLoading(true);
        setError(null);

        // API connections disabled - using mock ride for development
        if (!API_ENABLED) {
          // Create mock ride
          const mockRide: IRide = {
            _id: "ride-" + Date.now(),
            userId: user?._id || "mock-user-id",
            pickupLocation: data.pickupLocation,
            dropoffLocation: data.dropoffLocation,
            status: RideStatus.REQUESTED,
            needsWheelchair: data.needsWheelchair,
            needsPatientBed: data.needsPatientBed,
            wheelchairType: data.wheelchairType,
            passengers: data.passengers ? parseInt(data.passengers.toString()) : 1,
            specialRequirements: data.specialRequirements,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Add to state immediately
          setRides((prev) => {
            const updated = [...prev, mockRide];
            // Save to storage
            saveRidesToStorage(updated);
            return updated;
          });
          setActiveRide(mockRide);
          return mockRide;
        }

        // API enabled - make actual API call
        const response = await rideAPI.createRide(data);
        const ride = response as unknown as IRide;
        setActiveRide(ride);
        setRides((prev) => {
          const updated = [...prev, ride];
          saveRidesToStorage(updated);
          return updated;
        });
        return ride;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to create ride";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [user, saveRidesToStorage]
  );

  const updateRide = useCallback(
    async (rideId: string, data: UpdateRideData): Promise<IRide> => {
      try {
        setLoading(true);
        setError(null);

        // API connections disabled - using mock update for development
        if (!API_ENABLED) {
          // Find and update ride in state
          let updatedRide: IRide | null = null;
          setRides((prev) => {
            const updated = prev.map((ride) => {
              if (ride._id === rideId) {
                updatedRide = {
                  ...ride,
                  ...data,
                  updatedAt: new Date().toISOString(),
                } as IRide;
                // Update active ride if it's the current one
                if (activeRide?._id === rideId) {
                  setActiveRide(updatedRide);
                }
                return updatedRide;
              }
              return ride;
            });
            saveRidesToStorage(updated);
            return updated;
          });
          if (updatedRide) {
            return updatedRide;
          }
          throw new Error("Ride not found");
        }

        // API enabled - make actual API call
        const response = await rideAPI.updateRide(rideId, data);
        const ride = response as unknown as IRide;

        // Update active ride if it's the current one
        if (activeRide?._id === rideId) {
          setActiveRide(ride);
        }

        // Update rides list
        setRides((prev) => {
          const updated = prev.map((r) => (r._id === rideId ? ride : r));
          saveRidesToStorage(updated);
          return updated;
        });

        return ride;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to update ride";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [activeRide, saveRidesToStorage]
  );

  const getRideById = useCallback(async (rideId: string): Promise<IRide> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getRideById(rideId);
      const ride = response as unknown as IRide;
      return ride;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to get ride";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyRides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // API connections disabled - load from storage
      if (!API_ENABLED) {
        try {
          const stored = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
          if (stored) {
            const parsedRides = JSON.parse(stored) as IRide[];
            setRides(parsedRides);
          } else {
            // No stored rides, keep current state
          }
        } catch (error) {
          console.error("Error loading rides from storage:", error);
        }
        return;
      }

      const response = await rideAPI.getMyRides();
      const rides = response as unknown as IRide[];
      setRides(rides);
      await saveRidesToStorage(rides);
    } catch (err: any) {
      setError(err.message || "Failed to get rides");
      // Don't clear rides on error - keep existing ones
    } finally {
      setLoading(false);
    }
  }, [saveRidesToStorage]);

  const getActiveRide = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getActiveRide();
      const ride = response as unknown as IRide | null;
      setActiveRide(ride);
    } catch (err: any) {
      setError(err.message || "Failed to get active ride");
      setActiveRide(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelRide = useCallback(
    async (rideId: string, reason?: string) => {
      try {
        setLoading(true);
        setError(null);

        // API connections disabled - using mock cancel for development
        if (!API_ENABLED) {
          // Update ride status to cancelled instead of removing
          setRides((prev) => {
            const updated = prev.map((ride) => {
              if (ride._id === rideId) {
                return {
                  ...ride,
                  status: RideStatus.CANCELLED,
                  updatedAt: new Date().toISOString(),
                } as IRide;
              }
              return ride;
            });
            saveRidesToStorage(updated);
            return updated;
          });
          if (activeRide?._id === rideId) {
            setActiveRide(null);
          }
          return;
        }

        // API enabled - make actual API call
        await rideAPI.cancelRide(rideId, reason);

        // Update local state
        setRides((prev) => {
          const updated = prev.filter((ride) => ride._id !== rideId);
          saveRidesToStorage(updated);
          return updated;
        });
        if (activeRide?._id === rideId) {
          setActiveRide(null);
        }
      } catch (err: any) {
        const errorMsg = err.message || "Failed to cancel ride";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [activeRide, saveRidesToStorage]
  );

  const rateRide = useCallback(
    async (rideId: string, rating: number, review?: string) => {
      try {
        setLoading(true);
        setError(null);

        // API connections disabled - using mock rate for development
        if (!API_ENABLED) {
          // Update ride with rating and review
          setRides((prev) => {
            const updated = prev.map((ride) =>
              ride._id === rideId
                ? { ...ride, rating, review, updatedAt: new Date().toISOString() }
                : ride
            );
            saveRidesToStorage(updated);
            return updated;
          });
          return;
        }

        // API enabled - make actual API call
        await rideAPI.rateRide(rideId, { rating, review });

        // Update local state
        setRides((prev) => {
          const updated = prev.map((ride) =>
            ride._id === rideId ? { ...ride, rating, review } : ride
          );
          saveRidesToStorage(updated);
          return updated;
        });
      } catch (err: any) {
        const errorMsg = err.message || "Failed to rate ride";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [saveRidesToStorage]
  );

  const calculatePrice = useCallback(
    async (
      pickup: ILocation,
      dropoff: ILocation
    ): Promise<{ price: number; distance: number }> => {
      try {
        setLoading(true);
        setError(null);
        const response = await rideAPI.calculatePrice(
          { lat: pickup.lat, lng: pickup.lng },
          { lat: dropoff.lat, lng: dropoff.lng }
        );
        const result = response as unknown as {
          price: number;
          distance: number;
        };
        return result;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to calculate price";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    rides,
    activeRide,
    loading,
    error,
    createRide,
    updateRide,
    getRideById,
    getMyRides,
    getActiveRide,
    cancelRide,
    rateRide,
    calculatePrice,
  };
};
