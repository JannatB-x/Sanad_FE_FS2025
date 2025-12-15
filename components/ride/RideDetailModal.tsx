// components/ride/RideDetailModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IRide, UpdateRideData, ILocation } from "../../types/ride.type";
import { Colors, getStatusColor } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { Input } from "../common/Input";
import { formatCurrency } from "../../constants/Config";
import { Config } from "../../constants/Config";

interface RideDetailModalProps {
  visible: boolean;
  ride: IRide | null;
  onClose: () => void;
  onUpdateDropoff: (rideId: string, dropoffLocation: ILocation) => Promise<void>;
  onAddStop: (rideId: string, stopLocation: ILocation) => Promise<void>;
  onCancel: (rideId: string, reason?: string) => Promise<void>;
  loading?: boolean;
}

export const RideDetailModal: React.FC<RideDetailModalProps> = ({
  visible,
  ride,
  onClose,
  onUpdateDropoff,
  onAddStop,
  onCancel,
  loading = false,
}) => {
  const [showChangeDropoff, setShowChangeDropoff] = useState(false);
  const [showAddStop, setShowAddStop] = useState(false);
  const [newDropoffAddress, setNewDropoffAddress] = useState("");
  const [newStopAddress, setNewStopAddress] = useState("");
  const [updating, setUpdating] = useState(false);

  if (!ride) return null;

  const statusColor = getStatusColor(ride.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOpenMaps = async (type: "dropoff" | "stop") => {
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
            `Please select your ${type === "dropoff" ? "new dropoff" : "additional stop"} location in the maps app, then enter the address below.`,
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

  const handleUpdateDropoff = async () => {
    if (!newDropoffAddress.trim()) {
      Alert.alert("Error", "Please enter a dropoff address");
      return;
    }

    try {
      setUpdating(true);
      const newDropoff: ILocation = {
        address: newDropoffAddress.trim(),
        lat: Config.DEFAULT_LATITUDE + 0.01,
        lng: Config.DEFAULT_LONGITUDE + 0.01,
      };

      await onUpdateDropoff(ride._id, newDropoff);
      setShowChangeDropoff(false);
      setNewDropoffAddress("");
      Alert.alert("Success", "Dropoff location updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update dropoff location");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddStop = async () => {
    if (!newStopAddress.trim()) {
      Alert.alert("Error", "Please enter a stop address");
      return;
    }

    try {
      setUpdating(true);
      const newStop: ILocation = {
        address: newStopAddress.trim(),
        lat: Config.DEFAULT_LATITUDE + 0.02,
        lng: Config.DEFAULT_LONGITUDE + 0.02,
      };

      await onAddStop(ride._id, newStop);
      setShowAddStop(false);
      setNewStopAddress("");
      Alert.alert("Success", "Additional stop added successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add stop");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ride?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setUpdating(true);
              await onCancel(ride._id);
              onClose();
              Alert.alert("Success", "Ride cancelled successfully");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to cancel ride");
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleCallDriver = () => {
    // Get driver phone number - in a real app, this would come from the rider object
    const driverPhone = (ride.rider as any)?.phone || "+96512345678"; // Default Kuwait number
    
    const phoneUrl = Platform.select({
      ios: `telprompt:${driverPhone}`,
      android: `tel:${driverPhone}`,
    });

    if (phoneUrl) {
      Linking.canOpenURL(phoneUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(phoneUrl);
          } else {
            Alert.alert("Error", "Unable to make phone call");
          }
        })
        .catch((err) => {
          console.error("Error calling driver:", err);
          Alert.alert("Error", "Unable to make phone call");
        });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Ride Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Status */}
            <View style={styles.section}>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>
                  {ride.status.replace("-", " ").toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Date and Time */}
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color={Colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.value}>{formatDate(ride.createdAt)}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time" size={20} color={Colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Time</Text>
                  <Text style={styles.value}>{formatTime(ride.createdAt)}</Text>
                </View>
              </View>
            </View>

            {/* Pickup Location */}
            <View style={styles.section}>
              <Text style={styles.label}>Pickup Location</Text>
              <View style={styles.locationBox}>
                <Ionicons name="location" size={18} color={Colors.mapMarkerPickup} />
                <Text style={styles.locationText}>
                  {ride.pickupLocation.address || "Pickup location"}
                </Text>
              </View>
            </View>

            {/* Dropoff Location */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Dropoff Location</Text>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowChangeDropoff(!showChangeDropoff)}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.primary} />
                  <Text style={styles.actionButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.locationBox}>
                <Ionicons name="flag" size={18} color={Colors.mapMarkerDropoff} />
                <Text style={styles.locationText}>
                  {ride.dropoffLocation.address || "Dropoff location"}
                </Text>
              </View>

              {/* Change Dropoff Form */}
              {showChangeDropoff && (
                <View style={styles.editForm}>
                  <View style={styles.labelRow}>
                    <Text style={styles.subLabel}>New Dropoff Location</Text>
                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={() => handleOpenMaps("dropoff")}
                    >
                      <Ionicons name="map" size={14} color={Colors.primary} />
                      <Text style={styles.mapButtonText}>Maps</Text>
                    </TouchableOpacity>
                  </View>
                  <Input
                    placeholder="Enter new dropoff address"
                    value={newDropoffAddress}
                    onChangeText={setNewDropoffAddress}
                    icon="flag"
                  />
                  <View style={styles.formActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setShowChangeDropoff(false);
                        setNewDropoffAddress("");
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleUpdateDropoff}
                      disabled={updating}
                    >
                      <Text style={styles.saveButtonText}>
                        {updating ? "Updating..." : "Update"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Add Stop */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Additional Stops</Text>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowAddStop(!showAddStop)}
                >
                  <Ionicons name="add-circle-outline" size={16} color={Colors.primary} />
                  <Text style={styles.actionButtonText}>Add Stop</Text>
                </TouchableOpacity>
              </View>

              {/* Add Stop Form */}
              {showAddStop && (
                <View style={styles.editForm}>
                  <View style={styles.labelRow}>
                    <Text style={styles.subLabel}>New Stop Location</Text>
                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={() => handleOpenMaps("stop")}
                    >
                      <Ionicons name="map" size={14} color={Colors.primary} />
                      <Text style={styles.mapButtonText}>Maps</Text>
                    </TouchableOpacity>
                  </View>
                  <Input
                    placeholder="Enter stop address"
                    value={newStopAddress}
                    onChangeText={setNewStopAddress}
                    icon="location"
                  />
                  <View style={styles.formActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setShowAddStop(false);
                        setNewStopAddress("");
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleAddStop}
                      disabled={updating}
                    >
                      <Text style={styles.saveButtonText}>
                        {updating ? "Adding..." : "Add Stop"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Ride Details */}
            {ride.price && (
              <View style={styles.section}>
                <Text style={styles.label}>Price</Text>
                <Text style={styles.priceValue}>{formatCurrency(ride.price)}</Text>
              </View>
            )}

            {ride.distance && (
              <View style={styles.section}>
                <View style={styles.infoRow}>
                  <Ionicons name="navigate" size={20} color={Colors.info} />
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>Distance</Text>
                    <Text style={styles.value}>{ride.distance.toFixed(1)} km</Text>
                  </View>
                </View>
              </View>
            )}

            {ride.duration && (
              <View style={styles.section}>
                <View style={styles.infoRow}>
                  <Ionicons name="time" size={20} color={Colors.info} />
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>Duration</Text>
                    <Text style={styles.value}>{Math.round(ride.duration)} minutes</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Special Requirements */}
            {(ride.needsWheelchair ||
              ride.needsPatientBed ||
              ride.specialRequirements) && (
              <View style={styles.section}>
                <Text style={styles.label}>Special Requirements</Text>
                <View style={styles.requirementsBox}>
                  {ride.needsWheelchair && (
                    <View style={styles.requirementTag}>
                      <Ionicons name="medical" size={16} color={Colors.accent} />
                      <Text style={styles.requirementText}>Wheelchair Accessible</Text>
                    </View>
                  )}
                  {ride.needsPatientBed && (
                    <View style={styles.requirementTag}>
                      <Ionicons name="bed" size={16} color={Colors.accent} />
                      <Text style={styles.requirementText}>Patient Bed</Text>
                    </View>
                  )}
                  {ride.wheelchairType && (
                    <Text style={styles.requirementText}>
                      Type: {ride.wheelchairType}
                    </Text>
                  )}
                  {ride.specialRequirements && (
                    <Text style={styles.requirementText}>
                      {ride.specialRequirements}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            {/* Call Driver Button (if rider is assigned) */}
            {ride.rider && (ride.status === "accepted" || ride.status === "in-progress") && (
              <TouchableOpacity
                style={[styles.actionButtonLarge, styles.callDriverButton]}
                onPress={handleCallDriver}
              >
                <Ionicons name="call" size={20} color={Colors.textWhite} />
                <Text style={[styles.actionButtonTextLarge, styles.callDriverText]}>
                  Call Driver
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButtonLarge, styles.cancelRideButton]}
              onPress={handleCancel}
              disabled={updating || ride.status === "cancelled" || ride.status === "completed"}
            >
              <Ionicons name="close-circle-outline" size={20} color={Colors.error} />
              <Text style={[styles.actionButtonTextLarge, styles.cancelButtonText]}>
                Cancel Ride
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Sizes.radiusXL,
    borderTopRightRadius: Sizes.radiusXL,
    maxHeight: "90%",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Sizes.paddingL,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    maxHeight: 500,
  },
  scrollContent: {
    padding: Sizes.paddingL,
  },
  section: {
    marginBottom: Sizes.marginL,
  },
  label: {
    fontSize: Sizes.fontS,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Sizes.marginXS,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.marginXS,
  },
  value: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Sizes.paddingM,
    paddingVertical: Sizes.paddingS,
    borderRadius: Sizes.radiusS,
  },
  statusText: {
    fontSize: Sizes.fontS,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Sizes.marginM,
    marginBottom: Sizes.marginM,
  },
  infoContent: {
    flex: 1,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.backgroundLight,
    padding: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    gap: Sizes.marginS,
  },
  locationText: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "500",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginXS,
    paddingVertical: Sizes.paddingXS,
    paddingHorizontal: Sizes.paddingS,
    borderRadius: Sizes.radiusS,
    backgroundColor: Colors.primaryLight + "10",
  },
  actionButtonText: {
    fontSize: Sizes.fontS,
    color: Colors.primary,
    fontWeight: "600",
  },
  editForm: {
    backgroundColor: Colors.backgroundLight,
    padding: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    marginTop: Sizes.marginM,
  },
  subLabel: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
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
  formActions: {
    flexDirection: "row",
    gap: Sizes.marginM,
    marginTop: Sizes.marginM,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  priceValue: {
    fontSize: Sizes.font2XL,
    fontWeight: "700",
    color: Colors.primary,
  },
  requirementsBox: {
    backgroundColor: Colors.backgroundLight,
    padding: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    marginTop: Sizes.marginS,
  },
  requirementTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginS,
    marginBottom: Sizes.marginS,
  },
  requirementText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
  },
  actions: {
    padding: Sizes.paddingL,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Sizes.marginM,
  },
  actionButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.marginS,
    paddingVertical: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    borderWidth: 1,
  },
  callDriverButton: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  callDriverText: {
    color: Colors.textWhite,
  },
  cancelRideButton: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + "10",
  },
  actionButtonTextLarge: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
  },
});

