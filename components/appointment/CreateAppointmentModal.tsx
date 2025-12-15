// components/appointment/CreateAppointmentModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Linking,
  Alert,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { CreateAppointmentData } from "../../types/appointment.type";
import { Config } from "../../constants/Config";

interface CreateAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAppointmentData) => Promise<void>;
  loading?: boolean;
  initialDate?: Date;
  initialData?: CreateAppointmentData;
  isEdit?: boolean;
}

export const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  initialDate,
  initialData,
  isEdit = false,
}) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [info, setInfo] = useState("");
  const [date, setDate] = useState(initialDate || new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update date when modal opens or initialDate changes
  useEffect(() => {
    if (visible) {
      if (initialData) {
        // Edit mode - populate with existing data
        setTitle(initialData.title || "");

        // Parse location from description
        if (initialData.description) {
          const locationMatch =
            initialData.description.match(/Location:\s*(.+)/);
          if (locationMatch) {
            setLocation(locationMatch[1].split("\n\n")[0]);
            const infoPart = initialData.description
              .replace(/Location:\s*.+(\n\n|$)/, "")
              .trim();
            setInfo(infoPart);
          } else {
            setInfo(initialData.description);
          }
        }

        // Set date and time
        if (initialData.date) {
          setDate(new Date(initialData.date));
        }
        if (initialData.time) {
          const [hours, minutes] = initialData.time.split(":");
          const timeDate = new Date();
          timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          setTime(timeDate);
        }
      } else {
        // Create mode
        if (initialDate) {
          setDate(initialDate);
        } else {
          setDate(new Date());
        }
        setTime(new Date());
        setTitle("");
        setLocation("");
        setInfo("");
      }
      setErrors({});
    }
  }, [visible, initialDate, initialData]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    // Only validate date for new appointments, not when editing
    if (!isEdit && date < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.date = "Date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = time.toTimeString().slice(0, 5); // HH:mm format

      // Combine location and info into description
      const descriptionParts: string[] = [];
      if (location.trim()) {
        descriptionParts.push(`Location: ${location.trim()}`);
      }
      if (info.trim()) {
        descriptionParts.push(info.trim());
      }

      const data: CreateAppointmentData = {
        title: title.trim(),
        date: formattedDate,
        time: formattedTime,
        description:
          descriptionParts.length > 0
            ? descriptionParts.join("\n\n")
            : undefined,
      };

      try {
        await onSubmit(data);
        // Reset form on success
        setTitle("");
        setLocation("");
        setInfo("");
        setDate(initialDate || new Date());
        setTime(new Date());
        setErrors({});
      } catch (error) {
        // Error handling is done by parent
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setTitle("");
    setLocation("");
    setInfo("");
    setDate(initialDate || new Date());
    setTime(new Date());
    setErrors({});
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      setErrors({ ...errors, date: "" });
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleLocationPress = async () => {
    try {
      // Open Google Maps for location selection
      const googleMapsUrl = Platform.select({
        ios: `comgooglemaps://?q=`,
        android: `geo:0,0?q=`,
      });

      // Try to open Google Maps app first
      const canOpenGoogleMaps = await Linking.canOpenURL(
        Platform.OS === "ios" ? "comgooglemaps://" : "geo:0,0?q="
      );

      if (canOpenGoogleMaps && googleMapsUrl) {
        await Linking.openURL(googleMapsUrl);
      } else {
        // Fallback to web Google Maps
        const webUrl = `https://www.google.com/maps/search/?api=1&query=`;
        const canOpenWeb = await Linking.canOpenURL(webUrl);
        if (canOpenWeb) {
          await Linking.openURL(webUrl);
        } else {
          Alert.alert(
            "Location Selection",
            "Please enter the location manually or install Google Maps app.",
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error("Error opening Google Maps:", error);
      Alert.alert(
        "Error",
        "Unable to open Google Maps. Please enter the location manually.",
        [{ text: "OK" }]
      );
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEdit ? "Edit Appointment" : "Create Appointment"}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Input
              label="Title"
              placeholder="e.g., Doctor Appointment, Meeting"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors({ ...errors, title: "" });
              }}
              error={errors.title}
              icon="document-text"
              required
              inputStyle={styles.titleInput}
            />

            {/* Location */}
            <View style={styles.inputGroup}>
              <View style={styles.locationLabelRow}>
                <Text style={styles.label}>
                  Location <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={handleLocationPress}
                >
                  <Ionicons name="map" size={16} color={Colors.primary} />
                  <Text style={styles.mapButtonText}>Open Maps</Text>
                </TouchableOpacity>
              </View>
              <Input
                placeholder="Enter location or tap Open Maps"
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  setErrors({ ...errors, location: "" });
                }}
                error={errors.location}
                icon="location"
                required
                inputStyle={styles.locationInput}
              />
            </View>

            {/* Date Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeButton,
                  errors.date ? styles.errorBorder : undefined,
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={Colors.primary} />
                <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
              {errors.date && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle"
                    size={14}
                    color={Colors.error}
                  />
                  <Text style={styles.errorText}>{errors.date}</Text>
                </View>
              )}
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* Time Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Time <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons
                  name="time"
                  size={20}
                  color={Colors.primary}
                  style={{ marginRight: Sizes.marginM }}
                />
                <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={Colors.textSecondary}
                  style={{ marginLeft: Sizes.marginM }}
                />
              </TouchableOpacity>
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onTimeChange}
              />
            )}

            {/* Info (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Additional Information (Optional)
              </Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Add notes or special instructions..."
                  placeholderTextColor={Colors.textLight}
                  value={info}
                  onChangeText={setInfo}
                  multiline
                  numberOfLines={4}
                  textAlignVertical={info ? "top" : "center"}
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttons}>
              <Button
                title={isEdit ? "Update Appointment" : "Create Appointment"}
                onPress={handleSubmit}
                loading={loading}
                fullWidth
              />
              <Button
                title="Cancel"
                onPress={handleClose}
                variant="outline"
                fullWidth
                style={styles.cancelButton}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    overflow: "hidden",
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
    maxHeight: 600,
  },
  scrollContent: {
    padding: Sizes.paddingL,
  },
  inputGroup: {
    marginBottom: Sizes.marginL,
  },
  label: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Sizes.marginS,
  },
  required: {
    color: Colors.error,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusM,
    height: Sizes.inputM,
    paddingHorizontal: Sizes.paddingL,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  dateTimeText: {
    flex: 1,
    fontSize: Sizes.fontL,
    color: Colors.text,
    marginLeft: Sizes.marginM,
  },
  locationLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.marginS,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginXS,
    paddingHorizontal: Sizes.paddingM,
    paddingVertical: Sizes.paddingXS,
    borderRadius: Sizes.radiusS,
    backgroundColor: Colors.primary + "10",
  },
  mapButtonText: {
    fontSize: Sizes.fontS,
    color: Colors.primary,
    fontWeight: "600",
  },
  locationInput: {
    fontSize: Sizes.fontM,
  },
  titleInput: {
    fontSize: Sizes.fontM,
  },
  textAreaContainer: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusM,
    minHeight: 100,
  },
  textArea: {
    width: "100%",
    minHeight: 100,
    padding: Sizes.paddingL,
    fontSize: Sizes.fontM,
    color: Colors.text,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.marginS,
  },
  errorText: {
    fontSize: Sizes.fontS,
    color: Colors.error,
    marginLeft: Sizes.marginXS,
  },
  buttons: {
    marginTop: Sizes.marginL,
    gap: Sizes.marginM,
  },
  cancelButton: {
    marginTop: 0,
  },
});
