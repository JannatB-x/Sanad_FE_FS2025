// app/(tabs)/calendar.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { useAppointments } from "../../hooks/useAppointment";
import { CalendarView } from "../../components/appointment/CalendarView";
import { AppointmentCard } from "../../components/appointment/AppointmentCard";
import { Loading } from "../../components/common/Loading";

export default function CalendarScreen() {
  const router = useRouter();
  const { appointments, getAppointments, loading } = useAppointments();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    await getAppointments();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  if (loading && !refreshing) {
    return <Loading visible message="Loading appointments..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/create-appointment")}
        >
          <Ionicons name="add" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calendar */}
        <CalendarView
          appointments={appointments}
          onDayPress={handleDayPress}
          selectedDate={selectedDate}
        />

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {appointments.length > 0 ? (
            appointments
              .filter((apt) => apt.status !== "cancelled")
              .slice(0, 5)
              .map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  onPress={() => router.push(`/appointment/${appointment._id}`)}
                />
              ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-outline"
                size={64}
                color={Colors.textLight}
              />
              <Text style={styles.emptyText}>No appointments yet</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push("/create-appointment")}
              >
                <Text style={styles.createButtonText}>Create Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Sizes.paddingL,
    paddingTop: Sizes.paddingXXL,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: Sizes.paddingL,
  },
  sectionTitle: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginL,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Sizes.paddingXXL,
  },
  emptyText: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
    marginTop: Sizes.marginL,
    marginBottom: Sizes.marginXL,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.paddingXXL,
    paddingVertical: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
  },
  createButtonText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.textWhite,
  },
});
