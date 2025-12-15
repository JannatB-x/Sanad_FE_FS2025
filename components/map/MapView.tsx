// components/map/MapView.tsx
import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapViewComponent, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ILocation, MapRegion } from "../../types/location.type";
import { Colors } from "../../constants/Colors";
import { KUWAIT_LOCATION } from "../../constants/KuwaitLocations";

interface MapViewProps {
  initialRegion?: MapRegion;
  markers?: Array<{
    id: string;
    location: ILocation;
    title?: string;
    description?: string;
    color?: string;
  }>;
  onRegionChange?: (region: MapRegion) => void;
  onMarkerPress?: (markerId: string) => void;
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
  zoomEnabled?: boolean;
  scrollEnabled?: boolean;
  style?: any;
}

export const MapView: React.FC<MapViewProps> = ({
  initialRegion,
  markers = [],
  onRegionChange,
  onMarkerPress,
  showsUserLocation = true,
  followsUserLocation = false,
  zoomEnabled = true,
  scrollEnabled = true,
  style,
}) => {
  const mapRef = useRef<MapViewComponent>(null);

  const defaultRegion: MapRegion = initialRegion || {
    latitude: KUWAIT_LOCATION.latitude,
    longitude: KUWAIT_LOCATION.longitude,
    latitudeDelta: KUWAIT_LOCATION.latitudeDelta,
    longitudeDelta: KUWAIT_LOCATION.longitudeDelta,
  };

  // Animate to region
  const animateToRegion = (region: MapRegion) => {
    mapRef.current?.animateToRegion(region, 1000);
  };

  // Fit to markers
  const fitToMarkers = () => {
    if (markers.length > 0) {
      mapRef.current?.fitToSuppliedMarkers(
        markers.map((m) => m.id),
        {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          },
          animated: true,
        }
      );
    }
  };

  useEffect(() => {
    if (markers.length > 1) {
      // Fit to show all markers
      setTimeout(() => fitToMarkers(), 500);
    }
  }, [markers]);

  return (
    <View style={[styles.container, style]}>
      <MapViewComponent
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={defaultRegion}
        showsUserLocation={showsUserLocation}
        followsUserLocation={followsUserLocation}
        showsMyLocationButton={true}
        showsCompass={true}
        zoomEnabled={zoomEnabled}
        scrollEnabled={scrollEnabled}
        onRegionChangeComplete={onRegionChange}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            identifier={marker.id}
            coordinate={{
              latitude: marker.location.lat,
              longitude: marker.location.lng,
            }}
            title={marker.title}
            description={marker.description}
            pinColor={marker.color || Colors.primary}
            onPress={() => onMarkerPress?.(marker.id)}
          />
        ))}
      </MapViewComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
