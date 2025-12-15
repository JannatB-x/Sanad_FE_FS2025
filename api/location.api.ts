// api/location.api.ts
import apiClient from "./index";
import {
  getCurrentLocation as getDeviceLocation,
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
  getLocationName,
} from "../utils/location";
import {
  ILocation,
  PlaceAutocomplete,
  RouteInfo,
  DistanceMatrix,
} from "../types/location.type";
import { ENDPOINTS } from "../constants/API";

export const locationAPI = {
  // Get current location from device GPS
  getCurrentLocation: async (): Promise<ILocation> => {
    const location = await getDeviceLocation();
    if (!location) {
      throw new Error("Unable to get current location");
    }

    // Get address for the location
    const address = await getAddressFromCoordinates(location.lat, location.lng);
    return {
      ...location,
      address: address || undefined,
    };
  },

  // Get location by address (geocoding)
  getLocationByAddress: async (address: string): Promise<ILocation> => {
    const location = await getCoordinatesFromAddress(address);
    if (!location) {
      throw new Error("Unable to find location for the given address");
    }
    return location;
  },

  // Get location by coordinates (reverse geocoding)
  getLocationByCoordinates: async (
    latitude: number,
    longitude: number
  ): Promise<ILocation> => {
    const address = await getAddressFromCoordinates(latitude, longitude);
    const city = await getLocationName(latitude, longitude);

    return {
      lat: latitude,
      lng: longitude,
      address: address || undefined,
      city: city || undefined,
    };
  },

  // Search for places (autocomplete)
  searchPlaces: async (query: string): Promise<PlaceAutocomplete[]> => {
    try {
      const response = await apiClient.get("/locations/search", {
        params: { q: query },
      });
      return response as unknown as PlaceAutocomplete[];
    } catch (error) {
      console.error("Error searching places:", error);
      return [];
    }
  },

  // Get route between two locations
  getRoute: async (
    origin: ILocation,
    destination: ILocation
  ): Promise<RouteInfo | null> => {
    try {
      const response = await apiClient.post("/locations/route", {
        origin,
        destination,
      });
      return response as unknown as RouteInfo;
    } catch (error) {
      console.error("Error getting route:", error);
      return null;
    }
  },

  // Calculate distance matrix
  getDistanceMatrix: async (
    origins: ILocation[],
    destinations: ILocation[]
  ): Promise<DistanceMatrix[]> => {
    try {
      const response = await apiClient.post("/locations/distance-matrix", {
        origins,
        destinations,
      });
      return response as unknown as DistanceMatrix[];
    } catch (error) {
      console.error("Error calculating distance matrix:", error);
      return [];
    }
  },

  // Update user location (save to backend)
  updateUserLocation: async (
    userId: string,
    location: ILocation
  ): Promise<void> => {
    await apiClient.put(ENDPOINTS.USERS.UPDATE_LOCATION(userId), location);
  },

  // Get user saved location
  getUserLocation: async (userId: string): Promise<ILocation | null> => {
    try {
      const response = await apiClient.get(
        ENDPOINTS.USERS.GET_LOCATION(userId)
      );
      return response as unknown as ILocation;
    } catch (error) {
      console.error("Error getting user location:", error);
      return null;
    }
  },

  // Update rider location
  updateRiderLocation: async (
    riderId: string,
    location: ILocation
  ): Promise<void> => {
    await apiClient.put(ENDPOINTS.RIDERS.UPDATE_LOCATION(riderId), location);
  },
};
