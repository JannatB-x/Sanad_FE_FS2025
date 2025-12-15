// utils/location.ts
import * as Location from "expo-location";
import { ILocation } from "../types/location.type";
import { Config } from "../constants/Config";

/**
 * Location utility functions for handling GPS and location services
 */

// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
};

// Check if location permission is granted
export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error checking location permission:", error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<ILocation | null> => {
  try {
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting current location:", error);
    return null;
  }
};

// Get address from coordinates (Reverse Geocoding)
export const getAddressFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (addresses && addresses.length > 0) {
      const address = addresses[0];
      return `${address.street || ""} ${address.name || ""}, ${
        address.city || ""
      }, ${address.region || ""}`.trim();
    }

    return null;
  } catch (error) {
    console.error("Error getting address from coordinates:", error);
    return null;
  }
};

// Get coordinates from address (Geocoding)
export const getCoordinatesFromAddress = async (
  address: string
): Promise<ILocation | null> => {
  try {
    const locations = await Location.geocodeAsync(address);

    if (locations && locations.length > 0) {
      return {
        lat: locations[0].latitude,
        lng: locations[0].longitude,
        address,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting coordinates from address:", error);
    return null;
  }
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

// Convert degrees to radians
const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Format distance for display
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
};

// Check if location is within bounds
export const isLocationWithinBounds = (
  location: ILocation,
  center: ILocation,
  radiusInKm: number
): boolean => {
  const distance = calculateDistance(
    location.lat,
    location.lng,
    center.lat,
    center.lng
  );
  return distance <= radiusInKm;
};

// Get default location (Kuwait)
export const getDefaultLocation = (): ILocation => {
  return {
    lat: Config.DEFAULT_LATITUDE,
    lng: Config.DEFAULT_LONGITUDE,
    address: "Kuwait City, Kuwait",
  };
};

// Watch location changes
export const watchLocation = async (
  callback: (location: ILocation) => void
): Promise<Location.LocationSubscription | null> => {
  try {
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return null;
    }

    return await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        callback({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }
    );
  } catch (error) {
    console.error("Error watching location:", error);
    return null;
  }
};

// Stop watching location
export const stopWatchingLocation = (
  subscription: Location.LocationSubscription
) => {
  subscription.remove();
};

// Calculate estimated time of arrival (ETA)
export const calculateETA = (
  distanceInKm: number,
  averageSpeedKmh: number = 40
): number => {
  // Returns ETA in minutes
  const timeInHours = distanceInKm / averageSpeedKmh;
  return Math.round(timeInHours * 60);
};

// Format ETA for display
export const formatETA = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

// Get location name (city/area)
export const getLocationName = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (addresses && addresses.length > 0) {
      const address = addresses[0];
      return (
        address.city || address.region || address.country || "Unknown location"
      );
    }

    return "Unknown location";
  } catch (error) {
    console.error("Error getting location name:", error);
    return "Unknown location";
  }
};
