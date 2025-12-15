// context/Ride.context.tsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  type FC,
  type ReactNode,
} from "react";
import {
  rideAPI,
  type CreateRideData,
  type UpdateRideData,
  type PriceCalculation,
} from "../api/ride.api";
import {
  IRide,
  RideStatus,
  type RideHistoryFilter,
  type RateRideData,
  type RideStatsResponse,
} from "../types/ride.type";
import { NearbyRider } from "../types/rider.type";

interface RideContextType {
  // Current/Active Ride
  activeRide: IRide | null;
  currentRide: IRide | null; // Alias for activeRide

  // Ride Lists
  rides: IRide[];
  rideHistory: IRide[];
  upcomingRides: IRide[];
  completedRides: IRide[];

  // Nearby Riders
  nearbyRiders: NearbyRider[];

  // Price Calculation
  priceCalculation: PriceCalculation | null;

  // Stats
  rideStats: RideStatsResponse | null;

  // Loading States
  loading: boolean;
  calculatingPrice: boolean;
  searchingRiders: boolean;

  // Error State
  error: string | null;

  // Actions - Ride Management
  createRide: (data: CreateRideData) => Promise<IRide>;
  updateRide: (rideId: string, data: UpdateRideData) => Promise<IRide>;
  cancelRide: (rideId: string, reason?: string) => Promise<void>;
  getRideById: (rideId: string) => Promise<IRide>;
  refreshActiveRide: () => Promise<void>;

  // Actions - Ride Status (for riders)
  acceptRide: (rideId: string) => Promise<void>;
  startRide: (rideId: string) => Promise<void>;
  completeRide: (rideId: string) => Promise<void>;
  updateRideStatus: (rideId: string, status: RideStatus) => Promise<void>;

  // Actions - Ride Lists
  getMyRides: () => Promise<void>;
  getRideHistory: (filters?: RideHistoryFilter) => Promise<void>;
  getUpcomingRides: () => Promise<void>;
  getCompletedRides: () => Promise<void>;

  // Actions - Price & Search
  calculatePrice: (
    pickupLocation: { lat: number; lng: number },
    dropoffLocation: { lat: number; lng: number }
  ) => Promise<PriceCalculation>;
  getNearbyRiders: (location: { lat: number; lng: number }) => Promise<void>;

  // Actions - Rating
  rateRide: (rideId: string, data: RateRideData) => Promise<void>;

  // Actions - Tracking
  trackRide: (rideId: string) => Promise<IRide>;

  // Actions - Stats
  getRideStats: () => Promise<void>;

  // Utility
  clearError: () => void;
  setActiveRide: (ride: IRide | null) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider: FC<RideProviderProps> = ({ children }) => {
  // State
  const [activeRide, setActiveRide] = useState<IRide | null>(null);
  const [rides, setRides] = useState<IRide[]>([]);
  const [rideHistory, setRideHistory] = useState<IRide[]>([]);
  const [upcomingRides, setUpcomingRides] = useState<IRide[]>([]);
  const [completedRides, setCompletedRides] = useState<IRide[]>([]);
  const [nearbyRiders, setNearbyRiders] = useState<NearbyRider[]>([]);
  const [priceCalculation, setPriceCalculation] =
    useState<PriceCalculation | null>(null);
  const [rideStats, setRideStats] = useState<RideStatsResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [searchingRiders, setSearchingRiders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load active ride on mount
  useEffect(() => {
    refreshActiveRide();
  }, []);

  // Create a new ride
  const createRide = async (data: CreateRideData): Promise<IRide> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.createRide(data);
      const ride = response as unknown as IRide;

      // Set as active ride if it's not scheduled
      if (!data.scheduledTime) {
        setActiveRide(ride);
      }

      return ride;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update a ride (pickup/dropoff locations, etc.)
  const updateRide = async (
    rideId: string,
    data: UpdateRideData
  ): Promise<IRide> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.updateRide(rideId, data);
      const ride = response as unknown as IRide;

      // Update active ride if it's the current one
      if (activeRide?._id === rideId) {
        setActiveRide(ride);
      }

      // Recalculate price if locations changed (use updated ride data)
      if (data.pickupLocation || data.dropoffLocation) {
        const pickup = data.pickupLocation || ride.pickupLocation;
        const dropoff = data.dropoffLocation || ride.dropoffLocation;
        if (pickup && dropoff) {
          // Calculate price in background without blocking
          calculatePrice(
            { lat: pickup.lat, lng: pickup.lng },
            { lat: dropoff.lat, lng: dropoff.lng }
          ).catch((err) => {
            console.error("Error recalculating price:", err);
          });
        }
      }

      // Refresh lists
      await getMyRides();

      return ride;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cancel a ride
  const cancelRide = async (rideId: string, reason?: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await rideAPI.cancelRide(rideId, reason);

      // Remove from active ride if it's the current one
      if (activeRide?._id === rideId) {
        setActiveRide(null);
      }

      // Refresh lists
      await getMyRides();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get ride by ID
  const getRideById = async (rideId: string): Promise<IRide> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getRideById(rideId);
      return response as unknown as IRide;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Refresh active ride
  const refreshActiveRide = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getActiveRide();
      const ride = response as unknown as IRide | null;
      setActiveRide(ride);
    } catch (err) {
      // Active ride might not exist, which is fine
      setActiveRide(null);
    } finally {
      setLoading(false);
    }
  };

  // Accept ride (rider)
  const acceptRide = async (rideId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await rideAPI.acceptRide(rideId);
      await refreshActiveRide();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to accept ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Start ride (rider)
  const startRide = async (rideId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await rideAPI.startRide(rideId);
      await refreshActiveRide();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Complete ride (rider)
  const completeRide = async (rideId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await rideAPI.completeRide(rideId);
      await refreshActiveRide();
      await getCompletedRides();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to complete ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update ride status
  const updateRideStatus = async (
    rideId: string,
    status: RideStatus
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await rideAPI.updateRideStatus(rideId, status);
      await refreshActiveRide();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update ride status";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get my rides
  const getMyRides = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getMyRides();
      const ridesList = response as unknown as IRide[];
      setRides(ridesList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get rides";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get ride history
  const getRideHistory = async (filters?: RideHistoryFilter): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getRideHistory(filters);
      const history = response as unknown as IRide[];
      setRideHistory(history);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get ride history";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get upcoming rides
  const getUpcomingRides = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getUpcomingRides();
      const upcoming = response as unknown as IRide[];
      setUpcomingRides(upcoming);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get upcoming rides";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get completed rides
  const getCompletedRides = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getCompletedRides();
      const completed = response as unknown as IRide[];
      setCompletedRides(completed);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get completed rides";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate price
  const calculatePrice = async (
    pickupLocation: { lat: number; lng: number },
    dropoffLocation: { lat: number; lng: number }
  ): Promise<PriceCalculation> => {
    try {
      setCalculatingPrice(true);
      setError(null);
      const response = await rideAPI.calculatePrice(
        pickupLocation,
        dropoffLocation
      );
      const calculation = response as unknown as PriceCalculation;
      setPriceCalculation(calculation);
      return calculation;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to calculate price";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCalculatingPrice(false);
    }
  };

  // Get nearby riders
  const getNearbyRiders = async (location: {
    lat: number;
    lng: number;
  }): Promise<void> => {
    try {
      setSearchingRiders(true);
      setError(null);
      const response = await rideAPI.getNearbyRiders(location);
      const riders = response as unknown as NearbyRider[];
      setNearbyRiders(riders);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get nearby riders";
      setError(errorMessage);
    } finally {
      setSearchingRiders(false);
    }
  };

  // Rate a ride
  const rateRide = async (
    rideId: string,
    data: RateRideData
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await rideAPI.rateRide(rideId, data);
      await refreshActiveRide();
      await getCompletedRides();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to rate ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Track ride
  const trackRide = async (rideId: string): Promise<IRide> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.trackRide(rideId);
      const ride = response as unknown as IRide;

      // Update active ride if it's the same
      if (activeRide?._id === rideId) {
        setActiveRide(ride);
      }

      return ride;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to track ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get ride stats
  const getRideStats = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideAPI.getRideStats();
      const stats = response as unknown as RideStatsResponse;
      setRideStats(stats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get ride stats";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: RideContextType = {
    // State
    activeRide,
    currentRide: activeRide, // Alias
    rides,
    rideHistory,
    upcomingRides,
    completedRides,
    nearbyRiders,
    priceCalculation,
    rideStats,

    // Loading states
    loading,
    calculatingPrice,
    searchingRiders,

    // Error
    error,

    // Actions
    createRide,
    updateRide,
    cancelRide,
    getRideById,
    refreshActiveRide,
    acceptRide,
    startRide,
    completeRide,
    updateRideStatus,
    getMyRides,
    getRideHistory,
    getUpcomingRides,
    getCompletedRides,
    calculatePrice,
    getNearbyRiders,
    rateRide,
    trackRide,
    getRideStats,
    clearError,
    setActiveRide,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

export const useRide = (): RideContextType => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error("useRide must be used within a RideProvider");
  }
  return context;
};
