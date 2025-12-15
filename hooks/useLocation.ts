// hooks/useLocation.ts
// Note: This hook provides device-level location functionality
// For context-based location management, use LocationContext from context/Location.context.tsx
import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import { ILocation } from "../types/location.type";
import {
  getCurrentLocation,
  requestLocationPermission,
  checkLocationPermission,
  watchLocation,
  getAddressFromCoordinates,
} from "../utils/location";

interface UseDeviceLocationReturn {
  location: ILocation | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
  getAddress: (lat: number, lng: number) => Promise<string | null>;
}

export const useDeviceLocation = (): UseDeviceLocationReturn => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Check permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const granted = await checkLocationPermission();
      setPermissionGranted(granted);
    };
    checkPermission();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const granted = await requestLocationPermission();
    setPermissionGranted(granted);
    return granted;
  };

  const refreshLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLocation = await getCurrentLocation();

      if (currentLocation) {
        setLocation(currentLocation);
      } else {
        setError("Could not get location");
      }
    } catch (err: any) {
      setError(err.message || "Error getting location");
    } finally {
      setLoading(false);
    }
  }, []);

  const getAddress = useCallback(
    async (lat: number, lng: number): Promise<string | null> => {
      return await getAddressFromCoordinates(lat, lng);
    },
    []
  );

  return {
    location,
    loading,
    error,
    permissionGranted,
    requestPermission,
    refreshLocation,
    getAddress,
  };
};

// Hook for watching location changes
export const useLocationWatcher = (
  enabled: boolean = true
): {
  location: ILocation | null;
  error: string | null;
} => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        subscription = await watchLocation((loc) => {
          setLocation(loc);
        });
      } catch (err: any) {
        setError(err.message || "Error watching location");
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enabled]);

  return { location, error };
};
