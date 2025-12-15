// context/Location.context.tsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  type FC,
  type ReactNode,
} from "react";
import { ILocation } from "../types/location.type";
import { locationAPI } from "../api/location.api";

interface LocationContextType {
  location: ILocation | null;
  setLocation: (location: ILocation) => void;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  getLocationByAddress: (address: string) => Promise<void>;
  getLocationByCoordinates: (
    latitude: number,
    longitude: number
  ) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const location = await locationAPI.getCurrentLocation();
      setLocation(location);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get current location"
      );
    } finally {
      setLoading(false);
    }
  };

  const getLocationByAddress = async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      const location = await locationAPI.getLocationByAddress(address);
      setLocation(location);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get location by address"
      );
    } finally {
      setLoading(false);
    }
  };

  const getLocationByCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      const location = await locationAPI.getLocationByCoordinates(
        latitude,
        longitude
      );
      setLocation(location);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get location by coordinates"
      );
    } finally {
      setLoading(false);
    }
  };

  const value: LocationContextType = {
    location,
    setLocation,
    loading,
    error,
    getCurrentLocation,
    getLocationByAddress,
    getLocationByCoordinates,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
