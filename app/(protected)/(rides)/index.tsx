import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO, isToday } from "date-fns";
import {
  getRides,
  requestRide,
  updateRide,
  deleteRide,
  type Ride,
} from "../../../api/rides";
import type { Location } from "../../../types/rideTypes";
import colors from "../../../data/colors";

const RidesScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "wallet"
  >("card");

  // Fetch rides
  const { data: rides = [], isLoading } = useQuery({
    queryKey: ["rides"],
    queryFn: getRides,
  });

  // Filter upcoming rides
  const upcomingRides = useMemo(() => {
    const now = new Date();
    return rides
      .filter(
        (ride: Ride) =>
          (ride.status === "requested" ||
            ride.status === "accepted" ||
            ride.status === "in_progress") &&
          new Date(ride.requestedAt) >= now
      )
      .sort(
        (a: Ride, b: Ride) =>
          new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
      );
  }, [rides]);

  // Get active ride (in progress or accepted)
  const activeRide = useMemo(() => {
    return upcomingRides.find(
      (ride: Ride) =>
        ride.status === "in_progress" || ride.status === "accepted"
    );
  }, [upcomingRides]);

  // Request ride mutation
  const requestMutation = useMutation({
    mutationFn: requestRide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      setShowRequestModal(false);
      setPickupAddress("");
      setDropoffAddress("");
      Alert.alert("Success", "Ride requested successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to request ride"
      );
    },
  });

  // Update ride mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ride }: { id: string; ride: Partial<Ride> }) =>
      updateRide(id, ride),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      setShowEditModal(false);
      setSelectedRide(null);
      setDropoffAddress("");
      Alert.alert("Success", "Ride updated successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update ride"
      );
    },
  });

  // Cancel ride mutation
  const cancelMutation = useMutation({
    mutationFn: deleteRide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      Alert.alert("Success", "Ride cancelled successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel ride"
      );
    },
  });

  const handleRequestRide = () => {
    if (!pickupAddress.trim() || !dropoffAddress.trim()) {
      Alert.alert("Error", "Please enter both pickup and dropoff locations");
      return;
    }

    // For demo purposes, using default coordinates
    // In production, you'd use geocoding to get actual coordinates
    const pickup: Location = {
      address: pickupAddress.trim(),
      latitude: 0, // Replace with actual geocoding
      longitude: 0,
    };

    const dropoff: Location = {
      address: dropoffAddress.trim(),
      latitude: 0, // Replace with actual geocoding
      longitude: 0,
    };

    requestMutation.mutate({
      pickup,
      dropoff,
      paymentMethod,
    });
  };

  const handleEditLocation = (ride: Ride) => {
    setSelectedRide(ride);
    setDropoffAddress(ride.dropoff.address);
    setShowEditModal(true);
  };

  const handleUpdateLocation = () => {
    if (!selectedRide || !selectedRide._id) return;
    if (!dropoffAddress.trim()) {
      Alert.alert("Error", "Please enter a dropoff location");
      return;
    }

    const dropoff: Location = {
      address: dropoffAddress.trim(),
      latitude: selectedRide.dropoff.latitude,
      longitude: selectedRide.dropoff.longitude,
    };

    updateMutation.mutate({
      id: selectedRide._id,
      ride: { dropoff },
    });
  };

  const handleCancelRide = (ride: Ride) => {
    if (!ride._id) return;

    Alert.alert("Cancel Ride", "Are you sure you want to cancel this ride?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: () => cancelMutation.mutate(ride._id!),
      },
    ]);
  };

  const formatRideDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) {
        return `Today, ${format(date, "h:mm a")}`;
      }
      return format(date, "MMM d, h:mm a");
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return colors.success;
      case "in_progress":
        return colors.info;
      case "requested":
        return colors.warning;
      case "cancelled":
        return colors.danger;
      default:
        return colors.gray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return "checkmark-circle";
      case "in_progress":
        return "car";
      case "requested":
        return "time";
      default:
        return "ellipse";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rides</Text>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => setShowRequestModal(true)}
        >
          <Ionicons name="add" size={24} color={colors.white} />
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Ride with Driver Location */}
        {activeRide && activeRide.driverId && (
          <View style={styles.activeRideSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="car" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Active Ride</Text>
            </View>
            <View style={styles.driverLocationCard}>
              <View style={styles.driverInfo}>
                <Ionicons
                  name="person-circle"
                  size={40}
                  color={colors.primary}
                />
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>
                    {activeRide.driver?.name || "Driver"}
                  </Text>
                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location"
                      size={16}
                      color={colors.success}
                    />
                    <Text style={styles.locationText}>
                      Driver is on the way
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.trackingBadge}>
                <View style={styles.trackingDot} />
                <Text style={styles.trackingText}>Live</Text>
              </View>
            </View>
          </View>
        )}

        {/* Upcoming Rides */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Rides</Text>
            <Text style={styles.ridesCount}>{upcomingRides.length}</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loader}
            />
          ) : upcomingRides.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={64} color={colors.gray} />
              <Text style={styles.emptyStateText}>No upcoming rides</Text>
              <Text style={styles.emptyStateSubtext}>
                Request a ride to get started
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setShowRequestModal(true)}
              >
                <Text style={styles.emptyStateButtonText}>Request a Ride</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.ridesList}>
              {upcomingRides.map((ride: Ride) => (
                <View key={ride._id} style={styles.rideCard}>
                  <View style={styles.rideHeader}>
                    <View style={styles.rideStatus}>
                      <Ionicons
                        name={getStatusIcon(ride.status) as any}
                        size={20}
                        color={getStatusColor(ride.status)}
                      />
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusColor(ride.status) + "20",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(ride.status) },
                          ]}
                        >
                          {ride.status.replace("_", " ").toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.rideTime}>
                      {formatRideDate(ride.requestedAt)}
                    </Text>
                  </View>

                  <View style={styles.rideRoute}>
                    <View style={styles.routePoint}>
                      <View style={styles.pickupDot} />
                      <View style={styles.routeLine} />
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Pickup</Text>
                        <Text style={styles.routeAddress} numberOfLines={2}>
                          {ride.pickup.address}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.routePoint}>
                      <View style={styles.dropoffDot} />
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Dropoff</Text>
                        <Text style={styles.routeAddress} numberOfLines={2}>
                          {ride.dropoff.address}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.rideFooter}>
                    <View style={styles.rideMeta}>
                      <Ionicons name="cash" size={16} color={colors.gray} />
                      <Text style={styles.rideMetaText}>
                        ${ride.fare?.toFixed(2) || "0.00"}
                      </Text>
                    </View>
                    <View style={styles.rideMeta}>
                      <Ionicons name="time" size={16} color={colors.gray} />
                      <Text style={styles.rideMetaText}>
                        {ride.duration || 0} min
                      </Text>
                    </View>
                    <View style={styles.rideMeta}>
                      <Ionicons name="card" size={16} color={colors.gray} />
                      <Text style={styles.rideMetaText}>
                        {ride.paymentMethod || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rideActions}>
                    {ride.status !== "in_progress" && (
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditLocation(ride)}
                      >
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color={colors.primary}
                        />
                        <Text style={styles.editButtonText}>Edit Location</Text>
                      </TouchableOpacity>
                    )}
                    {ride.status !== "completed" && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelRide(ride)}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={18}
                          color={colors.danger}
                        />
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Request Ride Modal */}
      <Modal
        visible={showRequestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request a Ride</Text>
              <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pickup Location *</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={colors.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter pickup address"
                    placeholderTextColor={colors.gray}
                    value={pickupAddress}
                    onChangeText={setPickupAddress}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dropoff Location *</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter dropoff address"
                    placeholderTextColor={colors.gray}
                    value={dropoffAddress}
                    onChangeText={setDropoffAddress}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Method *</Text>
                <View style={styles.paymentOptions}>
                  {(["cash", "card", "wallet"] as const).map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentOption,
                        paymentMethod === method &&
                          styles.paymentOptionSelected,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Ionicons
                        name={
                          method === "cash"
                            ? "cash"
                            : method === "card"
                            ? "card"
                            : "wallet"
                        }
                        size={20}
                        color={
                          paymentMethod === method ? colors.white : colors.gray
                        }
                      />
                      <Text
                        style={[
                          styles.paymentOptionText,
                          paymentMethod === method &&
                            styles.paymentOptionTextSelected,
                        ]}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  requestMutation.isPending && styles.submitButtonDisabled,
                ]}
                onPress={handleRequestRide}
                disabled={requestMutation.isPending}
              >
                <Text style={styles.submitButtonText}>
                  {requestMutation.isPending ? "Requesting..." : "Request Ride"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Dropoff Location</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Dropoff Location *</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new dropoff address"
                    placeholderTextColor={colors.gray}
                    value={dropoffAddress}
                    onChangeText={setDropoffAddress}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  updateMutation.isPending && styles.submitButtonDisabled,
                ]}
                onPress={handleUpdateLocation}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.submitButtonText}>
                  {updateMutation.isPending ? "Updating..." : "Update Location"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark,
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  requestButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  activeRideSection: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  section: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark,
  },
  ridesCount: {
    fontSize: 16,
    color: colors.gray,
    fontWeight: "500",
  },
  driverLocationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.light,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: "500",
  },
  trackingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.success + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  trackingText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.success,
  },
  loader: {
    padding: 40,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 24,
    textAlign: "center",
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  ridesList: {
    gap: 12,
  },
  rideCard: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rideStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  rideTime: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray,
  },
  rideRoute: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: "row",
    marginBottom: 12,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    marginRight: 12,
    marginTop: 4,
  },
  dropoffDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
    marginRight: 12,
    marginTop: 4,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    position: "absolute",
    left: 17,
    top: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.gray,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  routeAddress: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  rideFooter: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 12,
  },
  rideMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rideMetaText: {
    fontSize: 12,
    color: colors.gray,
  },
  rideActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    flex: 1,
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark,
  },
  modalScroll: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  inputIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
    padding: 0,
  },
  paymentOptions: {
    flexDirection: "row",
    gap: 12,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.light,
  },
  paymentOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray,
  },
  paymentOptionTextSelected: {
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export default RidesScreen;
