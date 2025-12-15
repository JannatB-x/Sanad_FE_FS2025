// types/location.types.ts
import { IRider } from "./rider.type";
import { IVehicle } from "./vehicle.type";

export interface ILocation {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface PlaceAutocomplete {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string;
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  location: ILocation;
}

export interface KuwaitCity {
  id: string;
  name: string;
  arabicName?: string;
  location: ILocation;
}

export interface PopularLocation {
  id: string;
  name: string;
  nameAr?: string;
  address: string;
  lat: number;
  lng: number;
  type: "airport" | "mall" | "landmark" | "hospital" | "other";
  icon?: string;
}

export interface LocationPermission {
  granted: boolean;
  canAskAgain: boolean;
}

export interface UserLocationState {
  location: ILocation | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

export interface DistanceMatrix {
  origin: ILocation;
  destination: ILocation;
  distance: number; // in kilometers
  duration: number; // in minutes
}
