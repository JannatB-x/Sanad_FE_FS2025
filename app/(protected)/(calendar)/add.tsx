import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createBooking } from "../../../api/calendar";
import colors from "../../../data/colors";

const AddBookingScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();

  // Initialize dates
  const initialDate = params.date
    ? parseISO(params.date as string)
    : new Date();
  const initialTime = new Date();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Format dates for display and API
  const dateString = format(selectedDate, "yyyy-MM-dd");
  const timeString = format(selectedTime, "HH:mm");

  const createMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Alert.alert("Success", "Booking created successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      console.error("Create booking error:", error);

      let errorMessage = "Failed to create booking";

      // Check for specific error types
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error?.response?.data === "string") {
        errorMessage = error.response.data;
      }

      Alert.alert("Error", errorMessage);
    },
  });

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }

    // Combine date and time into a Date object for the backend
    // Backend expects Date field to be a Date type
    const [hours, minutes] = timeString.split(":").map(Number);
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(hours || 0, minutes || 0, 0, 0);

    createMutation.mutate({
      Title: title.trim(),
      Location: location.trim(),
      Date: bookingDate.toISOString(), // Send as ISO string, backend will parse it to Date
      Time: timeString, // Keep time as string for display
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Booking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g., Doctor Appointment, Meeting, Event"
                placeholderTextColor={colors.gray}
                value={title}
                onChangeText={setTitle}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Location Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g., 123 Main St, City, State"
                placeholderTextColor={colors.gray}
                value={location}
                onChangeText={setLocation}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <Text style={styles.pickerText}>
                {format(selectedDate, "MMMM d, yyyy")}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <>
                {Platform.OS === "ios" && (
                  <View style={styles.iosPickerContainer}>
                    <View style={styles.iosPickerHeader}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={styles.iosPickerButton}
                      >
                        <Text style={styles.iosPickerButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                      style={styles.iosPicker}
                    />
                  </View>
                )}
                {Platform.OS === "android" && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </>
            )}
          </View>

          {/* Time Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <Text style={styles.pickerText}>
                {format(selectedTime, "h:mm a")}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
            {showTimePicker && (
              <>
                {Platform.OS === "ios" && (
                  <View style={styles.iosPickerContainer}>
                    <View style={styles.iosPickerHeader}>
                      <TouchableOpacity
                        onPress={() => setShowTimePicker(false)}
                        style={styles.iosPickerButton}
                      >
                        <Text style={styles.iosPickerButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      display="spinner"
                      onChange={handleTimeChange}
                      is24Hour={false}
                      style={styles.iosPicker}
                    />
                  </View>
                )}
                {Platform.OS === "android" && (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                    is24Hour={false}
                  />
                )}
              </>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              createMutation.isPending && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={createMutation.isPending}
          >
            <Text style={styles.saveButtonText}>
              {createMutation.isPending ? "Saving..." : "Save Booking"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
    padding: 0,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  inputIcon: {
    marginRight: 4,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
  },
  iosPickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    overflow: "hidden",
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iosPickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iosPickerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  iosPicker: {
    height: 200,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export default AddBookingScreen;
