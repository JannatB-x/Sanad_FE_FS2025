// components/user/ProfileHeader.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IUser } from "../../types/user.type";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface ProfileHeaderProps {
  user: IUser;
  onEditPress?: () => void;
  onImagePress?: () => void;
  showEditButton?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditPress,
  onImagePress,
  showEditButton = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.background} />

      {/* Edit Button */}
      {showEditButton && onEditPress && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Ionicons name="create-outline" size={20} color={Colors.textWhite} />
        </TouchableOpacity>
      )}

      {/* Profile Image */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={onImagePress}
        disabled={!onImagePress}
      >
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require("../../../assets/default-avatar.png")
          }
          style={styles.image}
        />
        {onImagePress && (
          <View style={styles.imageBadge}>
            <Ionicons name="camera" size={16} color={Colors.textWhite} />
          </View>
        )}
      </TouchableOpacity>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        {/* User Type Badge */}
        <View style={styles.typeBadge}>
          <Ionicons
            name={
              user.userType === "user"
                ? "person"
                : user.userType === "rider"
                ? "car"
                : "business"
            }
            size={14}
            color={Colors.primary}
          />
          <Text style={styles.typeText}>
            {user.userType === "user"
              ? "Passenger"
              : user.userType === "rider"
              ? "Rider"
              : "Company"}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        {user.rideHistory && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.rideHistory.length}</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>
        )}

        {user.appointments && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.appointments.length}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
        )}

        {user.userType === "rider" && user.earnings && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.earnings.length}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        )}
      </View>

      {/* Medical Info Indicators */}
      {(user.diseases?.length > 0 || user.disabilityLevel) && (
        <View style={styles.medicalIndicators}>
          {user.disabilityLevel && user.disabilityLevel !== "none" && (
            <View style={styles.indicator}>
              <Ionicons
                name="accessibility"
                size={16}
                color={Colors.wheelchair}
              />
              <Text style={styles.indicatorText}>
                Disability: {user.disabilityLevel}
              </Text>
            </View>
          )}

          {user.diseases && user.diseases.length > 0 && (
            <View style={styles.indicator}>
              <Ionicons name="medical" size={16} color={Colors.medical} />
              <Text style={styles.indicatorText}>
                {user.diseases.length} medical condition
                {user.diseases.length > 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: Sizes.radiusXL,
    borderBottomRightRadius: Sizes.radiusXL,
    paddingBottom: Sizes.paddingXXL,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  background: {
    height: 120,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: Sizes.radiusXL,
    borderBottomRightRadius: Sizes.radiusXL,
  },
  editButton: {
    position: "absolute",
    top: 50,
    right: Sizes.paddingL,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: -60,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.textWhite,
  },
  imageBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.textWhite,
  },
  infoContainer: {
    alignItems: "center",
    marginTop: Sizes.marginL,
  },
  name: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    marginBottom: Sizes.marginM,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight + "20",
    paddingHorizontal: Sizes.paddingL,
    paddingVertical: Sizes.paddingS,
    borderRadius: Sizes.radiusRound,
    gap: Sizes.marginS,
  },
  typeText: {
    fontSize: Sizes.fontM,
    color: Colors.primary,
    fontWeight: "600",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Sizes.marginXXL,
    paddingHorizontal: Sizes.paddingXXL,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  medicalIndicators: {
    marginTop: Sizes.marginXL,
    marginHorizontal: Sizes.marginXXL,
    padding: Sizes.paddingL,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusM,
    gap: Sizes.marginM,
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
  },
  indicatorText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "500",
  },
});
