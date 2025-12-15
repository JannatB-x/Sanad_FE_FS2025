// components/ride/RideDetails.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IRide } from "../../types/ride.type";
import { Colors, getStatusColor } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { formatCurrency } from "../../constants/Config";

interface RideDetailsProps {
  ride: IRide;
  onContactRider?: () => void;
  onCancelRide?: () => void;
  onRateRide?: () => void;
}

export const RideDetails: React.FC<RideDetailsProps> = ({
  ride,
  onContactRider,
  onCancelRide,
  onRateRide,
}) => {
  const statusColor = getStatusColor(ride.status);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderInfoRow = (icon: any, label: string, value: string) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Header */}
      <View style={[styles.statusHeader, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>
          {ride.status.replace("-", " ").toUpperCase()}
        </Text>
      </View>

      {/* Ride Info Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ride Information</Text>

        {/* Date and Time */}
        {renderInfoRow(
          "calendar-outline",
          "Ride Date",
          formatDateTime(ride.createdAt)
        )}

        {/* Pickup Location */}
        {renderInfoRow(
          "location",
          "Pickup Location",
          ride.pickupLocation.address || "Not specified"
        )}

        {/* Dropoff Location */}
        {renderInfoRow(
          "flag",
          "Dropoff Location",
          ride.dropoffLocation.address || "Not specified"
        )}

        {/* Distance */}
        {ride.distance &&
          renderInfoRow(
            "navigate",
            "Distance",
            `${ride.distance.toFixed(1)} km`
          )}

        {/* Duration */}
        {ride.duration &&
          renderInfoRow(
            "time",
            "Duration",
            `${Math.round(ride.duration)} minutes`
          )}

        {/* Price */}
        {ride.price && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Fare</Text>
            <Text style={styles.priceValue}>{formatCurrency(ride.price)}</Text>
          </View>
        )}
      </View>

      {/* Special Requirements */}
      {(ride.needsWheelchair ||
        ride.needsPatientBed ||
        ride.specialRequirements) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Special Requirements</Text>

          {ride.needsWheelchair && (
            <View style={styles.requirementRow}>
              <Ionicons
                name="accessibility"
                size={20}
                color={Colors.wheelchair}
              />
              <Text style={styles.requirementText}>
                Wheelchair Accessible{" "}
                {ride.wheelchairType ? `(${ride.wheelchairType})` : ""}
              </Text>
            </View>
          )}

          {ride.needsPatientBed && (
            <View style={styles.requirementRow}>
              <Ionicons name="bed" size={20} color={Colors.patientBed} />
              <Text style={styles.requirementText}>Patient Bed Required</Text>
            </View>
          )}

          {ride.specialRequirements && (
            <View style={styles.requirementRow}>
              <Ionicons
                name="information-circle"
                size={20}
                color={Colors.info}
              />
              <Text style={styles.requirementText}>
                {ride.specialRequirements}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Rider Info (if available) */}
      {ride.rider && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rider Information</Text>

          <View style={styles.riderContainer}>
            {ride.rider.profileImage ? (
              <Image
                source={{ uri: ride.rider.profileImage }}
                style={styles.riderImage}
              />
            ) : (
              <View style={[styles.riderImage, styles.riderImagePlaceholder]}>
                <Ionicons name="person" size={40} color={Colors.textSecondary} />
              </View>
            )}

            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>{ride.rider.name}</Text>

              <View style={styles.riderRating}>
                <Ionicons name="star" size={16} color={Colors.warning} />
                <Text style={styles.ratingText}>
                  {ride.rider.rating?.toFixed(1) || "N/A"}
                </Text>
              </View>

              <Text style={styles.vehicleInfo}>
                {ride.rider.vehicleInfo.model} • {ride.rider.vehicleInfo.color}
              </Text>
              <Text style={styles.plateNumber}>
                {ride.rider.vehicleInfo.plateNumber}
              </Text>
            </View>
          </View>

          {/* Contact Rider Button */}
          {onContactRider &&
            ride.status !== "completed" &&
            ride.status !== "cancelled" && (
              <TouchableOpacity
                style={styles.contactButton}
                onPress={onContactRider}
              >
                <Ionicons name="call" size={20} color={Colors.textWhite} />
                <Text style={styles.contactButtonText}>Contact Rider</Text>
              </TouchableOpacity>
            )}
        </View>
      )}

      {/* Rating (if completed) */}
      {ride.status === "completed" && ride.rating && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Rating</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= ride.rating! ? "star" : "star-outline"}
                  size={32}
                  color={Colors.warning}
                />
              ))}
            </View>

            {ride.review && (
              <Text style={styles.reviewText}>{ride.review}</Text>
            )}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {ride.status === "completed" && !ride.rating && onRateRide && (
          <TouchableOpacity style={styles.primaryButton} onPress={onRateRide}>
            <Ionicons name="star" size={20} color={Colors.textWhite} />
            <Text style={styles.primaryButtonText}>Rate Ride</Text>
          </TouchableOpacity>
        )}

        {ride.status !== "completed" &&
          ride.status !== "cancelled" &&
          onCancelRide && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancelRide}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.textWhite}
              />
              <Text style={styles.cancelButtonText}>Cancel Ride</Text>
            </TouchableOpacity>
          )}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statusHeader: {
    padding: Sizes.paddingL,
    alignItems: "center",
  },
  statusText: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    marginHorizontal: Sizes.marginL,
    marginTop: Sizes.marginL,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginL,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: Sizes.marginL,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Sizes.marginM,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: Sizes.fontL,
    color: Colors.text,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Sizes.paddingL,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Sizes.marginL,
  },
  priceLabel: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
  },
  priceValue: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.primary,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.marginM,
    gap: Sizes.marginM,
  },
  requirementText: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.text,
  },
  riderContainer: {
    flexDirection: "row",
    marginBottom: Sizes.marginL,
  },
  riderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Sizes.marginL,
  },
  riderImagePlaceholder: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  riderInfo: {
    flex: 1,
    justifyContent: "center",
  },
  riderName: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  riderRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  vehicleInfo: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  plateNumber: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "600",
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: Colors.success,
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.marginS,
  },
  contactButtonText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  ratingContainer: {
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    gap: Sizes.marginS,
    marginBottom: Sizes.marginL,
  },
  reviewText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    textAlign: "center",
    fontStyle: "italic",
  },
  actionButtons: {
    marginHorizontal: Sizes.marginL,
    marginTop: Sizes.marginL,
    gap: Sizes.marginM,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.marginS,
  },
  primaryButtonText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  cancelButton: {
    flexDirection: "row",
    backgroundColor: Colors.error,
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.marginS,
  },
  cancelButtonText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  bottomPadding: {
    height: Sizes.paddingXXL,
  },
});
