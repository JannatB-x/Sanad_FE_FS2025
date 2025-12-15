// components/map/RouteOverlay.tsx
import React from "react";
import { Polyline } from "react-native-maps";
import { ILocation } from "../../types/location.type";
import { Colors } from "../../constants/Colors";

interface RouteOverlayProps {
  coordinates: ILocation[];
  color?: string;
  width?: number;
  dashed?: boolean;
}

export const RouteOverlay: React.FC<RouteOverlayProps> = ({
  coordinates,
  color = Colors.mapRoute,
  width = 4,
  dashed = false,
}) => {
  if (coordinates.length < 2) {
    return null;
  }

  const formattedCoordinates = coordinates.map((coord) => ({
    latitude: coord.lat,
    longitude: coord.lng,
  }));

  return (
    <Polyline
      coordinates={formattedCoordinates}
      strokeColor={color}
      strokeWidth={width}
      lineDashPattern={dashed ? [5, 5] : undefined}
      lineCap="round"
      lineJoin="round"
    />
  );
};

// Active Route (solid blue line)
export const ActiveRoute: React.FC<{ coordinates: ILocation[] }> = ({
  coordinates,
}) => {
  return (
    <RouteOverlay coordinates={coordinates} color={Colors.primary} width={5} />
  );
};

// Planned Route (dashed gray line)
export const PlannedRoute: React.FC<{ coordinates: ILocation[] }> = ({
  coordinates,
}) => {
  return (
    <RouteOverlay
      coordinates={coordinates}
      color={Colors.textSecondary}
      width={3}
      dashed={true}
    />
  );
};

// Multiple Routes (for showing alternatives)
export const MultipleRoutes: React.FC<{
  routes: Array<{
    id: string;
    coordinates: ILocation[];
    isSelected?: boolean;
  }>;
}> = ({ routes }) => {
  return (
    <>
      {routes.map((route) => (
        <RouteOverlay
          key={route.id}
          coordinates={route.coordinates}
          color={route.isSelected ? Colors.primary : Colors.textLight}
          width={route.isSelected ? 5 : 3}
        />
      ))}
    </>
  );
};
