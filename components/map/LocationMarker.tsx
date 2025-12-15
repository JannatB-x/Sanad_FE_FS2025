// components/map/LocationMarker.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { ILocation } from "../../types/location.type";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface LocationMarkerProps {
  id: string;
  location: ILocation;
  type: "pickup" | "dropoff" | "rider" | "user";
  title?: string;
  description?: string;
  onPress?: () => void;
  image?: string;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  id,
  location,
  type,
  title,
  description,
  onPress,
  image,
}) => {
  const getMarkerColor = () => {
    switch (type) {
      case "pickup":
        return Colors.mapMarkerPickup;
      case "dropoff":
        return Colors.mapMarkerDropoff;
      case "rider":
        return Colors.mapRiderLocation;
      case "user":
        return Colors.primary;
      default:
        return Colors.primary;
    }
  };

  const getMarkerIcon = () => {
    switch (type) {
      case "pickup":
        return "location";
      case "dropoff":
        return "flag";
      case "rider":
        return "car";
      case "user":
        return "person";
      default:
        return "location";
    }
  };

  // Custom marker with icon
  const renderCustomMarker = () => {
    return (
      <View style={styles.markerContainer}>
        <View
          style={[styles.markerBubble, { backgroundColor: getMarkerColor() }]}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.markerImage} />
          ) : (
            <Ionicons
              name={getMarkerIcon()}
              size={24}
              color={Colors.textWhite}
            />
          )}
        </View>
        <View
          style={[styles.markerArrow, { borderTopColor: getMarkerColor() }]}
        />
      </View>
    );
  };

  return (
    <Marker
      identifier={id}
      coordinate={{
        latitude: location.lat,
        longitude: location.lng,
      }}
      title={title}
      description={description}
      onPress={onPress}
    >
      {renderCustomMarker()}
    </Marker>
  );
};

// Pickup Marker
export const PickupMarker: React.FC<{
  id: string;
  location: ILocation;
  onPress?: () => void;
}> = ({ id, location, onPress }) => {
  return (
    <LocationMarker
      id={id}
      location={location}
      type="pickup"
      title="Pickup Location"
      description={location.address}
      onPress={onPress}
    />
  );
};

// Dropoff Marker
export const DropoffMarker: React.FC<{
  id: string;
  location: ILocation;
  onPress?: () => void;
}> = ({ id, location, onPress }) => {
  return (
    <LocationMarker
      id={id}
      location={location}
      type="dropoff"
      title="Dropoff Location"
      description={location.address}
      onPress={onPress}
    />
  );
};

// Rider Marker (Driver)
export const RiderMarker: React.FC<{
  id: string;
  location: ILocation;
  riderName?: string;
  riderImage?: string;
  onPress?: () => void;
}> = ({ id, location, riderName, riderImage, onPress }) => {
  return (
    <LocationMarker
      id={id}
      location={location}
      type="rider"
      title={riderName || "Rider"}
      description="Current location"
      image={riderImage}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  markerBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.textWhite,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
