// components/ride/RiderInfo.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface RiderInfoProps {
  rider: {
    _id: string;
    name: string;
    profileImage?: string;
    rating?: number;
    vehicleInfo: {
      type: string;
      model: string;
      plateNumber: string;
      color: string;
    };
    totalRides?: number;
  };
  onCall?: () => void;
  onMessage?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export const RiderInfo: React.FC<RiderInfoProps> = ({
  rider,
  onCall,
  onMessage,
  showActions = true,
  compact = false,
}) => {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Image
          source={
            rider.profileImage
              ? { uri: rider.profileImage }
              : require("../../../assets/default-avatar.png")
          }
          style={styles.compactImage}
        />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName}>{rider.name}</Text>
          <View style={styles.compactRating}>
            <Ionicons name="star" size={12} color={Colors.warning} />
            <Text style={styles.compactRatingText}>
              {rider.rating?.toFixed(1) || "N/A"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Rider Avatar and Info */}
      <View style={styles.header}>
        <Image
          source={
            rider.profileImage
              ? { uri: rider.profileImage }
              : require("../../../assets/default-avatar.png")
          }
          style={styles.avatar}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{rider.name}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={Colors.warning} />
            <Text style={styles.ratingText}>
              {rider.rating?.toFixed(1) || "N/A"}
            </Text>
            {rider.totalRides && (
              <Text style={styles.totalRidesText}>
                ({rider.totalRides} rides)
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={styles.vehicleSection}>
        <View style={styles.vehicleHeader}>
          <Ionicons name="car-sport" size={20} color={Colors.primary} />
          <Text style={styles.vehicleSectionTitle}>Vehicle Information</Text>
        </View>

        <View style={styles.vehicleDetails}>
          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>Model:</Text>
            <Text style={styles.vehicleValue}>{rider.vehicleInfo.model}</Text>
          </View>

          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>Color:</Text>
            <Text style={styles.vehicleValue}>{rider.vehicleInfo.color}</Text>
          </View>

          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>Plate Number:</Text>
            <Text style={styles.vehiclePlate}>
              {rider.vehicleInfo.plateNumber}
            </Text>
          </View>

          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>Type:</Text>
            <Text style={styles.vehicleValue}>{rider.vehicleInfo.type}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      {showActions && (
        <View style={styles.actions}>
          {onCall && (
            <TouchableOpacity style={styles.callButton} onPress={onCall}>
              <Ionicons name="call" size={20} color={Colors.textWhite} />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          )}

          {onMessage && (
            <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
              <Ionicons name="chatbubble" size={20} color={Colors.primary} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    marginBottom: Sizes.marginL,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Sizes.marginL,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: Sizes.fontXXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginS,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: Sizes.fontL,
    color: Colors.text,
    fontWeight: "600",
  },
  totalRidesText: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  vehicleSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Sizes.paddingL,
    marginBottom: Sizes.marginL,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginS,
    marginBottom: Sizes.marginM,
  },
  vehicleSectionTitle: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
  },
  vehicleDetails: {
    gap: Sizes.marginM,
  },
  vehicleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleLabel: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
  },
  vehicleValue: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "500",
  },
  vehiclePlate: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "700",
    backgroundColor: Colors.warning + "20",
    paddingHorizontal: Sizes.paddingM,
    paddingVertical: Sizes.paddingXS,
    borderRadius: Sizes.radiusS,
  },
  actions: {
    flexDirection: "row",
    gap: Sizes.marginM,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.success,
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.marginS,
  },
  callButtonText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.primaryLight + "20",
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.marginS,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  messageButtonText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.primary,
  },
  // Compact version styles
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.paddingM,
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusS,
  },
  compactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Sizes.marginM,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  compactRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  compactRatingText: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
});
