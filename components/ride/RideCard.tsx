// components/ride/RideCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IRide } from "../../types/ride.type";
import { Colors, getStatusColor } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { formatCurrency } from "../../constants/Config";

interface RideCardProps {
  ride: IRide;
  onPress?: () => void;
  showRider?: boolean;
}

export const RideCard: React.FC<RideCardProps> = ({
  ride,
  onPress,
  showRider = true,
}) => {
  const statusColor = getStatusColor(ride.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>
          {ride.status.replace("-", " ").toUpperCase()}
        </Text>
      </View>

      {/* Date and Time */}
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.dateTimeText}>{formatDate(ride.createdAt)}</Text>
        </View>
        <View style={styles.dateTimeRow}>
          <Ionicons
            name="time-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.dateTimeText}>{formatTime(ride.createdAt)}</Text>
        </View>
      </View>

      {/* Locations */}
      <View style={styles.locationsContainer}>
        {/* Pickup */}
        <View style={styles.locationRow}>
          <View style={styles.pickupDot} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {ride.pickupLocation.address || "Pickup location"}
            </Text>
          </View>
        </View>

        {/* Vertical Line */}
        <View style={styles.verticalLine} />

        {/* Dropoff */}
        <View style={styles.locationRow}>
          <View style={styles.dropoffDot} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Dropoff</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {ride.dropoffLocation.address || "Dropoff location"}
            </Text>
          </View>
        </View>
      </View>

      {/* Rider Info (if available and showRider is true) */}
      {showRider && ride.rider && (
        <View style={styles.riderContainer}>
          {ride.rider.profileImage ? (
            <Image
              source={{ uri: ride.rider.profileImage }}
              style={styles.riderImage}
            />
          ) : (
            <View style={[styles.riderImage, styles.riderImagePlaceholder]}>
              <Ionicons name="person" size={30} color={Colors.textSecondary} />
            </View>
          )}
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{ride.rider.name}</Text>
            <View style={styles.riderRating}>
              <Ionicons name="star" size={14} color={Colors.warning} />
              <Text style={styles.ratingText}>
                {ride.rider.rating?.toFixed(1) || "N/A"}
              </Text>
            </View>
          </View>
          <Text style={styles.vehicleInfo}>
            {ride.rider.vehicleInfo.model} • {ride.rider.vehicleInfo.color}
          </Text>
        </View>
      )}

      {/* Price and Details */}
      <View style={styles.footer}>
        {ride.price && (
          <Text style={styles.price}>{formatCurrency(ride.price)}</Text>
        )}
        {ride.distance && (
          <View style={styles.detailItem}>
            <Ionicons name="navigate" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{ride.distance.toFixed(1)} km</Text>
          </View>
        )}
        {ride.duration && (
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              {Math.round(ride.duration)} min
            </Text>
          </View>
        )}
      </View>

      {/* Chevron Icon */}
      {onPress && (
        <View style={styles.chevron}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    marginBottom: Sizes.marginL,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    position: "absolute",
    top: Sizes.paddingL,
    right: Sizes.paddingL,
    paddingHorizontal: Sizes.paddingM,
    paddingVertical: Sizes.paddingXS,
    borderRadius: Sizes.radiusS,
  },
  statusText: {
    fontSize: Sizes.fontXS,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  dateTimeContainer: {
    flexDirection: "row",
    marginBottom: Sizes.marginL,
    gap: Sizes.marginL,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginXS,
  },
  dateTimeText: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  locationsContainer: {
    marginBottom: Sizes.marginL,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.mapMarkerPickup,
    marginTop: 4,
  },
  dropoffDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.mapMarkerDropoff,
    marginTop: 4,
  },
  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    marginLeft: 5,
    marginVertical: 4,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: Sizes.marginM,
  },
  locationLabel: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "500",
  },
  riderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Sizes.paddingL,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: Sizes.marginL,
  },
  riderImagePlaceholder: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  riderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Sizes.marginM,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  riderRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  vehicleInfo: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginL,
  },
  price: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.primary,
    marginRight: "auto",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  chevron: {
    position: "absolute",
    right: Sizes.paddingL,
    bottom: Sizes.paddingL,
  },
});
