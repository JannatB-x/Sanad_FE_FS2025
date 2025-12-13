import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { createBooking } from "../../../api/calendar";
import colors from "../../../data/colors";

const AddBookingScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();

  const defaultDate = params.date
    ? format(parseISO(params.date as string), "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");
  const defaultTime = format(new Date(), "HH:mm");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);

  const createMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Alert.alert("Success", "Booking created successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create booking"
      );
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }
    if (!date.trim()) {
      Alert.alert("Error", "Please enter a date");
      return;
    }
    if (!time.trim()) {
      Alert.alert("Error", "Please enter a time");
      return;
    }

    createMutation.mutate({
      Title: title.trim(),
      Location: location.trim(),
      Date: date.trim(),
      Time: time.trim(),
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

          {/* Date Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (e.g., 2024-12-25)"
                placeholderTextColor={colors.gray}
                value={date}
                onChangeText={setDate}
                keyboardType="default"
              />
            </View>
            <Text style={styles.hint}>Format: YYYY-MM-DD</Text>
          </View>

          {/* Time Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="HH:MM (e.g., 14:30)"
                placeholderTextColor={colors.gray}
                value={time}
                onChangeText={setTime}
                keyboardType="default"
              />
            </View>
            <Text style={styles.hint}>Format: HH:MM (24-hour format)</Text>
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
  hint: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
    marginLeft: 4,
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
