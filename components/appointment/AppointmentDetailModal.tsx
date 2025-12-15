// components/appointment/AppointmentDetailModal.tsx
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IAppointment, UpdateAppointmentData } from "../../types/appointment.type";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { CreateAppointmentModal } from "./CreateAppointmentModal";

interface AppointmentDetailModalProps {
  visible: boolean;
  appointment: IAppointment | null;
  onClose: () => void;
  onEdit: (id: string, data: UpdateAppointmentData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  visible,
  appointment,
  onClose,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!appointment) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Extract location from description
  const getLocation = () => {
    if (!appointment.description) return null;
    const locationMatch = appointment.description.match(/Location:\s*(.+)/);
    return locationMatch ? locationMatch[1].split("\n\n")[0] : null;
  };

  const location = getLocation();
  const descriptionWithoutLocation = appointment.description
    ? appointment.description.replace(/Location:\s*.+(\n\n|$)/, "").trim()
    : null;

  const handleDelete = () => {
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await onDelete(appointment._id);
              onClose();
              Alert.alert("Success", "Appointment deleted successfully");
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete appointment");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleEdit = async (data: UpdateAppointmentData) => {
    try {
      await onEdit(appointment._id, data);
      setShowEditModal(false);
      Alert.alert("Success", "Appointment updated successfully");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update appointment");
      throw err;
    }
  };

  return (
    <>
      <Modal
        visible={visible && !showEditModal}
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
              <Text style={styles.headerTitle}>Appointment Details</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <View style={styles.section}>
                <Text style={styles.label}>Title</Text>
                <Text style={styles.value}>{appointment.title}</Text>
              </View>

              {/* Date */}
              <View style={styles.section}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={20} color={Colors.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>{formatDate(appointment.date)}</Text>
                  </View>
                </View>
              </View>

              {/* Time */}
              <View style={styles.section}>
                <View style={styles.infoRow}>
                  <Ionicons name="time" size={20} color={Colors.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>Time</Text>
                    <Text style={styles.value}>{formatTime(appointment.time)}</Text>
                  </View>
                </View>
              </View>

              {/* Location */}
              {location && (
                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={20} color={Colors.accent} />
                    <View style={styles.infoContent}>
                      <Text style={styles.label}>Location</Text>
                      <Text style={styles.value}>{location}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Description */}
              {descriptionWithoutLocation && (
                <View style={styles.section}>
                  <Text style={styles.label}>Additional Information</Text>
                  <View style={styles.descriptionBox}>
                    <Text style={styles.description}>{descriptionWithoutLocation}</Text>
                  </View>
                </View>
              )}

              {/* Ride Info */}
              {appointment.ride && (
                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <Ionicons name="car" size={20} color={Colors.info} />
                    <View style={styles.infoContent}>
                      <Text style={styles.label}>Linked Ride</Text>
                      <Text style={styles.value}>Ride #{appointment.ride._id.slice(-6)}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Created Date */}
              {appointment.createdAt && (
                <View style={styles.section}>
                  <Text style={styles.label}>Created</Text>
                  <Text style={styles.metaText}>
                    {new Date(appointment.createdAt).toLocaleString()}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => setShowEditModal(true)}
              >
                <Ionicons name="create-outline" size={20} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Text style={styles.actionButtonText}>Deleting...</Text>
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={20} color={Colors.error} />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                      Delete
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      {showEditModal && (
        <CreateAppointmentModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEdit}
          loading={loading}
          isEdit={true}
          initialData={{
            title: appointment.title,
            date: appointment.date,
            time: appointment.time,
            description: appointment.description,
          }}
        />
      )}
    </>
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
  value: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Sizes.marginM,
  },
  infoContent: {
    flex: 1,
  },
  descriptionBox: {
    backgroundColor: Colors.backgroundLight,
    padding: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    marginTop: Sizes.marginS,
  },
  description: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    lineHeight: 22,
  },
  metaText: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: Sizes.marginM,
    padding: Sizes.paddingL,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.marginS,
    paddingVertical: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
  },
  editButton: {
    borderColor: Colors.primary,
  },
  deleteButton: {
    borderColor: Colors.error,
  },
  actionButtonText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.primary,
  },
  deleteButtonText: {
    color: Colors.error,
  },
});

