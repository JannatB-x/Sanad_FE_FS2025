// app/(ride)/booking.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { Config } from "../../constants/Config";
import { useRide } from "../../hooks/useRide";
import { CreateRideData } from "../../types/ride.type";

interface ILocation {
  address: string;
  lat: number;
  lng: number;
}

export default function BookingScreen() {
  const router = useRouter();
  const { createRide } = useRide();
  const [pickupLocation, setPickupLocation] = useState<ILocation | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<ILocation | null>(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [needsWheelchair, setNeedsWheelchair] = useState(false);
  const [needsPatientBed, setNeedsPatientBed] = useState(false);
  const [wheelchairType, setWheelchairType] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleOpenMaps = async (type: "pickup" | "dropoff") => {
    try {
      const url = Platform.select({
        ios: `maps:q=`,
        android: `geo:0,0?q=`,
      });

      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          Alert.alert(
            "Location Selection",
            `Please select your ${type === "pickup" ? "pickup" : "dropoff"} location in the maps app, then enter the address below.`,
            [{ text: "OK" }]
          );
        } else {
          Alert.alert("Error", "Cannot open maps application.");
        }
      }
    } catch (error) {
      console.error("Error opening maps:", error);
      Alert.alert(
        "Error",
        "Unable to open maps. Please enter the location manually."
      );
    }
  };

  const handleBookRide = async () => {
    // Validation
    if (!pickupAddress.trim()) {
      Alert.alert("Error", "Please enter a pickup location");
      return;
    }

    if (!dropoffAddress.trim()) {
      Alert.alert("Error", "Please enter a dropoff location");
      return;
    }

    // Create location data
    // In a real app, you'd use geocoding to get lat/lng from address
    const pickupLoc: ILocation = {
      address: pickupAddress.trim(),
      lat: Config.DEFAULT_LATITUDE,
      lng: Config.DEFAULT_LONGITUDE,
    };

    const dropoffLoc: ILocation = {
      address: dropoffAddress.trim(),
      lat: Config.DEFAULT_LATITUDE + 0.01,
      lng: Config.DEFAULT_LONGITUDE + 0.01,
    };

    try {
      setLoading(true);

      // Create ride data
      const rideData: CreateRideData = {
        pickupLocation: pickupLoc,
        dropoffLocation: dropoffLoc,
        needsWheelchair: needsWheelchair || undefined,
        needsPatientBed: needsPatientBed || undefined,
        wheelchairType: wheelchairType.trim() || undefined,
        passengers: passengers ? parseInt(passengers) : 1,
        specialRequirements: specialRequirements.trim() || undefined,
      };

      // Create ride using the hook (which will save to AsyncStorage)
      await createRide(rideData);

      // Show success and navigate to rides page
      Alert.alert(
        "Ride Booked",
        "Your ride has been booked successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)/rides");
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to book ride");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Reset form or reload any data
    // For now, just simulate a refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Book a Ride</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Pickup Location */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Pickup Location <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => handleOpenMaps("pickup")}
              >
                <Ionicons name="map" size={16} color={Colors.primary} />
                <Text style={styles.mapButtonText}>Open Maps</Text>
              </TouchableOpacity>
            </View>
            <Input
              placeholder="Enter pickup address"
              value={pickupAddress}
              onChangeText={setPickupAddress}
              icon="location"
            />
          </View>

          {/* Dropoff Location */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Dropoff Location <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => handleOpenMaps("dropoff")}
              >
                <Ionicons name="map" size={16} color={Colors.primary} />
                <Text style={styles.mapButtonText}>Open Maps</Text>
              </TouchableOpacity>
            </View>
            <Input
              placeholder="Enter dropoff address"
              value={dropoffAddress}
              onChangeText={setDropoffAddress}
              icon="flag"
            />
          </View>

          {/* Vehicle Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Requirements</Text>

            {/* Wheelchair Access */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setNeedsWheelchair(!needsWheelchair)}
            >
              <View
                style={[
                  styles.checkbox,
                  needsWheelchair && styles.checkboxChecked,
                ]}
              >
                {needsWheelchair && (
                  <Ionicons name="checkmark" size={20} color={Colors.textWhite} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Wheelchair Accessible</Text>
            </TouchableOpacity>

            {/* Patient Bed */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setNeedsPatientBed(!needsPatientBed)}
            >
              <View
                style={[
                  styles.checkbox,
                  needsPatientBed && styles.checkboxChecked,
                ]}
              >
                {needsPatientBed && (
                  <Ionicons name="checkmark" size={20} color={Colors.textWhite} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Patient Bed Required</Text>
            </TouchableOpacity>

            {/* Wheelchair Type */}
            {needsWheelchair && (
              <View style={styles.subSection}>
                <Text style={styles.subLabel}>Wheelchair Type (Optional)</Text>
                <Input
                  placeholder="e.g., Manual, Electric"
                  value={wheelchairType}
                  onChangeText={setWheelchairType}
                  icon="medical"
                />
              </View>
            )}

            {/* Number of Passengers */}
            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Number of Passengers</Text>
              <Input
                placeholder="1"
                value={passengers}
                onChangeText={setPassengers}
                keyboardType="numeric"
                icon="people"
              />
            </View>

            {/* Special Requirements */}
            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Special Requirements (Optional)</Text>
              <Input
                placeholder="Any additional requirements or notes"
                value={specialRequirements}
                onChangeText={setSpecialRequirements}
                multiline
                numberOfLines={3}
                icon="document-text"
              />
            </View>
          </View>
        </ScrollView>

        {/* Book Button */}
        <View style={styles.footer}>
          <Button
            title="Book Ride"
            onPress={handleBookRide}
            loading={loading}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Sizes.paddingL,
    paddingTop: Sizes.paddingXXL,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: Sizes.font2XL,
    fontWeight: "700",
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Sizes.paddingL,
  },
  section: {
    marginBottom: Sizes.marginXXL,
  },
  sectionTitle: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginL,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.marginS,
  },
  label: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
  },
  required: {
    color: Colors.error,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginXS,
    paddingVertical: Sizes.paddingXS,
    paddingHorizontal: Sizes.paddingS,
    borderRadius: Sizes.radiusS,
    backgroundColor: Colors.primaryLight + "10",
  },
  mapButtonText: {
    fontSize: Sizes.fontS,
    color: Colors.primary,
    fontWeight: "600",
  },
  subSection: {
    marginTop: Sizes.marginL,
  },
  subLabel: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Sizes.marginS,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.marginL,
    paddingVertical: Sizes.paddingS,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Sizes.marginM,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "500",
  },
  footer: {
    padding: Sizes.paddingL,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

