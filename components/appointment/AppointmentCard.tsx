// components/appointment/AppointmentCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IAppointment } from "../../types/appointment.type";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface AppointmentCardProps {
  appointment: IAppointment;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    // If time is already formatted (e.g., "10:00 AM"), return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    // Otherwise, parse and format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Extract location from description if it exists
  const getLocation = () => {
    if (!appointment.description) return null;
    const locationMatch = appointment.description.match(/Location:\s*(.+)/);
    return locationMatch ? locationMatch[1].split("\n\n")[0] : null;
  };

  const location = getLocation();
  const descriptionWithoutLocation = appointment.description
    ? appointment.description.replace(/Location:\s*.+(\n\n|$)/, "").trim()
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Left Color Bar */}
      <View style={[styles.colorBar, { backgroundColor: Colors.primary }]} />

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {appointment.title}
          </Text>
        </View>

        {/* Date and Time */}
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.dateTimeText}>
              {formatDate(appointment.date)}
            </Text>
          </View>

          <View style={styles.dateTimeRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.dateTimeText}>
              {formatTime(appointment.time)}
            </Text>
          </View>
        </View>

        {/* Location */}
        {location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={Colors.accent} />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        )}

        {/* Description (without location) */}
        {descriptionWithoutLocation && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={2}>
              {descriptionWithoutLocation}
            </Text>
          </View>
        )}

        {/* Ride Info (if linked) */}
        {appointment.ride && (
          <View style={styles.rideInfo}>
            <Ionicons name="car" size={16} color={Colors.info} />
            <Text style={styles.rideText}>Linked to ride</Text>
          </View>
        )}

        {/* Actions */}
        {showActions && (onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
                <Text style={[styles.actionText, styles.deleteText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Chevron (if clickable) */}
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
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusL,
    marginBottom: Sizes.marginL,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  colorBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: Sizes.paddingL,
  },
  header: {
    marginBottom: Sizes.marginM,
  },
  title: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginS,
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: Sizes.marginL,
    marginBottom: Sizes.marginM,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginS,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent + "10",
    paddingHorizontal: Sizes.paddingM,
    paddingVertical: Sizes.paddingS,
    borderRadius: Sizes.radiusS,
    marginBottom: Sizes.marginM,
    gap: Sizes.marginS,
  },
  locationText: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.accent,
    fontWeight: "600",
  },
  descriptionContainer: {
    backgroundColor: Colors.backgroundLight,
    padding: Sizes.paddingM,
    borderRadius: Sizes.radiusS,
    marginBottom: Sizes.marginM,
  },
  description: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  rideInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.infoLight + "20",
    paddingHorizontal: Sizes.paddingM,
    paddingVertical: Sizes.paddingS,
    borderRadius: Sizes.radiusS,
    alignSelf: "flex-start",
    gap: Sizes.marginS,
    marginBottom: Sizes.marginM,
  },
  rideText: {
    fontSize: Sizes.fontS,
    color: Colors.info,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: Sizes.marginL,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Sizes.paddingM,
    marginTop: Sizes.marginM,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginXS,
  },
  actionText: {
    fontSize: Sizes.fontM,
    color: Colors.primary,
    fontWeight: "600",
  },
  deleteText: {
    color: Colors.error,
  },
  chevron: {
    justifyContent: "center",
    paddingRight: Sizes.paddingL,
  },
});
