// app/(tabs)/calendar.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { useAppointments } from "../../hooks/useAppointment";
import { CalendarView } from "../../components/appointment/CalendarView";
import { AppointmentCard } from "../../components/appointment/AppointmentCard";
import { Loading } from "../../components/common/Loading";
import { CreateAppointmentModal } from "../../components/appointment/CreateAppointmentModal";
import { AppointmentDetailModal } from "../../components/appointment/AppointmentDetailModal";
import {
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../../types/appointment.type";

export default function CalendarScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ openModal?: string }>();
  const {
    appointments,
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    loading,
  } = useAppointments();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  // Auto-open modal if coming from home page
  useEffect(() => {
    if (params.openModal === "true") {
      setShowModal(true);
    }
  }, [params.openModal]);

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

  const handleCreateAppointment = async (data: CreateAppointmentData) => {
    try {
      setCreating(true);
      const newAppointment = await createAppointment(data);
      setShowModal(false);

      // Select the date of the newly created appointment
      if (newAppointment?.date) {
        // Handle both YYYY-MM-DD and YYYY-MM-DDTHH:mm:ss formats
        let appointmentDate = newAppointment.date;
        if (appointmentDate.includes("T")) {
          appointmentDate = appointmentDate.split("T")[0];
        }
        setSelectedDate(appointmentDate);
      }

      // Note: Appointment is already added to state by createAppointment hook
      // No need to reload - it will appear immediately in calendar and upcoming appointments

      Alert.alert(
        "Success",
        "Appointment created successfully and added to your calendar!",
        [{ text: "OK" }]
      );
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create appointment. Please try again.";
      Alert.alert("Error", errorMessage);
      throw err; // Re-throw to let modal handle it
    } finally {
      setCreating(false);
    }
  };

  if (loading && !refreshing) {
    return <Loading visible message="Loading appointments..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              console.log("Add button pressed, opening modal");
              setShowModal(true);
            }}
          >
            <Ionicons name="add" size={24} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Calendar - Fixed in Top Half */}
        <View style={styles.calendarContainer}>
          <CalendarView
            appointments={appointments}
            onDayPress={handleDayPress}
            selectedDate={selectedDate}
          />
        </View>

        {/* Upcoming Appointments - Scrollable in Bottom Half */}
        <View style={styles.appointmentsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {appointments.length > 5 && (
              <TouchableOpacity
                onPress={() => {
                  // TODO: Navigate to full appointments list
                }}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {appointments.length > 0 ? (
              appointments
                .sort((a, b) => {
                  // Sort by date and time
                  const dateA = new Date(`${a.date}T${a.time}`);
                  const dateB = new Date(`${b.date}T${b.time}`);
                  return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 5)
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onPress={() => {
                      setSelectedAppointment(appointment);
                      setShowDetailModal(true);
                    }}
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
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        visible={showModal}
        onClose={() => {
          console.log("Closing modal");
          setShowModal(false);
        }}
        onSubmit={handleCreateAppointment}
        loading={creating}
        initialDate={selectedDate ? new Date(selectedDate) : undefined}
      />

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        visible={showDetailModal}
        appointment={selectedAppointment}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAppointment(null);
        }}
        onEdit={async (id: string, data: UpdateAppointmentData) => {
          try {
            setCreating(true);
            await updateAppointment(id, data);
            // Refresh appointments to show updated data
            await loadAppointments();
          } finally {
            setCreating(false);
          }
        }}
        onDelete={async (id: string) => {
          try {
            setCreating(true);
            await deleteAppointment(id);
            // Refresh appointments to show updated data
            await loadAppointments();
          } finally {
            setCreating(false);
          }
        }}
        loading={creating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  calendarContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appointmentsContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Sizes.paddingL,
    paddingTop: Sizes.paddingL,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.marginL,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Sizes.paddingL,
  },
  sectionTitle: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
  },
  seeAllText: {
    fontSize: Sizes.fontM,
    color: Colors.primary,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Sizes.paddingXXL,
  },
  emptyText: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
    marginTop: Sizes.marginL,
  },
});
