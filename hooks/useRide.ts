// hooks/useRide.ts
import { useState, useCallback } from "react";
import { rideAPI, UpdateRideData } from "../api/ride.api";
import { IRide, CreateRideData, RideStatus } from "../types/ride.type";
import { ILocation } from "../types/location.type";

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

  const createRide = useCallback(
    async (data: CreateRideData): Promise<IRide> => {
      try {
        setLoading(true);
        setError(null);
        const response = await rideAPI.createRide(data);
        const ride = response as unknown as IRide;
        setActiveRide(ride);
        setRides((prev) => [...prev, ride]);
        return ride;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to create ride";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateRide = useCallback(
    async (rideId: string, data: UpdateRideData): Promise<IRide> => {
      try {
        setLoading(true);
        setError(null);
        const response = await rideAPI.updateRide(rideId, data);
        const ride = response as unknown as IRide;

        // Update active ride if it's the current one
        if (activeRide?._id === rideId) {
          setActiveRide(ride);
        }

        // Update rides list
        setRides((prev) => prev.map((r) => (r._id === rideId ? ride : r)));

        return ride;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to update ride";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [activeRide]
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
      const response = await rideAPI.getMyRides();
      const rides = response as unknown as IRide[];
      setRides(rides);
    } catch (err: any) {
      setError(err.message || "Failed to get rides");
    } finally {
      setLoading(false);
    }
  }, []);

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
        await rideAPI.cancelRide(rideId, reason);

        // Update local state
        setRides((prev) => prev.filter((ride) => ride._id !== rideId));
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
    [activeRide]
  );

  const rateRide = useCallback(
    async (rideId: string, rating: number, review?: string) => {
      try {
        setLoading(true);
        setError(null);
        await rideAPI.rateRide(rideId, { rating, review });

        // Update local state
        setRides((prev) =>
          prev.map((ride) =>
            ride._id === rideId ? { ...ride, rating, review } : ride
          )
        );
      } catch (err: any) {
        const errorMsg = err.message || "Failed to rate ride";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
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
