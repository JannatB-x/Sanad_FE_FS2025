// components/appointment/AppointmentForm.tsx
import { useState, type FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { CreateAppointmentData } from "../../types/appointment.type";

interface AppointmentFormProps {
  initialData?: Partial<CreateAppointmentData>;
  onSubmit: (data: CreateAppointmentData) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitButtonText?: string;
}

export const AppointmentForm: FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitButtonText = "Create Appointment",
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date) : new Date()
  );
  const [time, setTime] = useState(
    initialData?.time ? new Date(`2000-01-01T${initialData.time}`) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.date = "Date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = time.toTimeString().slice(0, 5); // HH:mm format

      const data: CreateAppointmentData = {
        title: title.trim(),
        date: formattedDate,
        time: formattedTime,
        description: description.trim() || undefined,
      };

      onSubmit(data);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      setErrors({ ...errors, date: "" });
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
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
        />

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
              <Ionicons name="alert-circle" size={14} color={Colors.error} />
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

        {/* Description */}
        <Input
          label="Description"
          placeholder="Add any additional details (optional)"
          value={description}
          onChangeText={setDescription}
          icon="information-circle"
          multiline
          numberOfLines={4}
          inputStyle={styles.textArea}
        />

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle"
            size={20}
            color={Colors.info}
            style={{ marginRight: Sizes.marginM }}
          />
          <Text style={styles.infoText}>
            You can link this appointment to a ride after creation.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <View style={onCancel ? styles.buttonWrapper : undefined}>
            <Button
              title={submitButtonText}
              onPress={handleSubmit}
              loading={loading}
              fullWidth
            />
          </View>

          {onCancel && (
            <Button
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              fullWidth
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  form: {
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
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: Sizes.paddingM,
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
  infoBox: {
    flexDirection: "row",
    backgroundColor: Colors.infoLight + "20",
    padding: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    marginBottom: Sizes.marginL,
  },
  infoText: {
    flex: 1,
    fontSize: Sizes.fontS,
    color: Colors.info,
    lineHeight: 18,
  },
  buttons: {
    marginTop: Sizes.marginM,
  },
  buttonWrapper: {
    marginBottom: Sizes.marginM,
  },
});
