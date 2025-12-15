// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { useAuth } from "../../hooks/useAuth";
import { useFontSize } from "../../utils/fontSize";
import { useRide } from "../../hooks/useRide";
import { useAppointments } from "../../hooks/useAppointment";
import { RideCard } from "../../components/ride/RideCard";
import { RideDetailModal } from "../../components/ride/RideDetailModal";
import { AppointmentCard } from "../../components/appointment/AppointmentCard";
import { AppointmentDetailModal } from "../../components/appointment/AppointmentDetailModal";
import { ILocation } from "../../types/location.type";
import { UpdateAppointmentData } from "../../types/appointment.type";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { rides, getMyRides, updateRide, cancelRide } = useRide();
  const {
    appointments,
    getAppointments,
    updateAppointment,
    deleteAppointment,
  } = useAppointments();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const fontSize = useFontSize();
  const styles = createStyles(fontSize);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([getMyRides(), getAppointments()]);
  };

  // Get upcoming appointments (max 2, sorted by date/time, only future)
  const upcomingAppointments = appointments
    .filter((apt) => {
      const appointmentDateTime = new Date(`${apt.date}T${apt.time}`);
      return appointmentDateTime > new Date();
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 2);

  // Get upcoming rides (sorted by date/time, only future or active)
  const upcomingRides = rides
    .filter((ride) => {
      // Include rides that are requested, accepted, or in-progress
      // Or scheduled rides in the future
      if (ride.status === "requested" || ride.status === "accepted" || ride.status === "in-progress") {
        return true;
      }
      if (ride.scheduledTime) {
        return new Date(ride.scheduledTime) > new Date();
      }
      return false;
    })
    .sort((a, b) => {
      const dateA = a.scheduledTime ? new Date(a.scheduledTime) : new Date(a.createdAt);
      const dateB = b.scheduledTime ? new Date(b.scheduledTime) : new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });

  const quickActions = [
    {
      title: "Book a Ride",
      icon: "car",
      color: Colors.primary,
      route: "/(ride)/booking",
    },
    {
      title: "Add an Appointment",
      icon: "calendar",
      color: Colors.warning,
      route: "/(tabs)/calendar",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{user?.name || "User"}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => {
                  if (action.route.includes("calendar")) {
                    // Navigate to calendar with query param to open modal
                    router.push("/(tabs)/calendar?openModal=true" as any);
                  } else {
                    router.push(action.route as any);
                  }
                }}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: action.color + "20" },
                  ]}
                >
                <Ionicons
                  name={action.icon as any}
                  size={24}
                  color={action.color}
                />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Appointments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {upcomingAppointments.length > 0 && (
              <TouchableOpacity onPress={() => router.push("/(tabs)/calendar")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          {upcomingAppointments.length > 0 ? (
            <View style={styles.appointmentsList}>
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  onPress={() => {
                    setSelectedAppointment(appointment);
                    setShowAppointmentModal(true);
                  }}
                  showActions={false}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={40} color={Colors.textLight} />
              <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            </View>
          )}
        </View>

        {/* Upcoming Rides Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Rides</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/rides")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingRides.length > 0 ? (
            <View style={styles.ridesList}>
              {upcomingRides.map((ride) => (
                <RideCard
                  key={ride._id}
                  ride={ride}
                  onPress={() => {
                    setSelectedRide(ride);
                    setShowDetailModal(true);
                  }}
                  showRider={false}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={40} color={Colors.textLight} />
              <Text style={styles.emptyStateText}>No upcoming rides</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Ride Detail Modal */}
      <RideDetailModal
        visible={showDetailModal}
        ride={selectedRide}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRide(null);
        }}
        onUpdateDropoff={async (rideId: string, dropoffLocation: ILocation) => {
          await updateRide(rideId, { dropoffLocation });
          await loadData();
        }}
        onAddStop={async (rideId: string, stopLocation: ILocation) => {
          // For now, add stop as a new dropoff (in a real app, you'd have multiple stops)
          await updateRide(rideId, { dropoffLocation: stopLocation });
          await loadData();
        }}
        onCancel={async (rideId: string, reason?: string) => {
          await cancelRide(rideId, reason);
          await loadData();
        }}
        loading={false}
      />

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        visible={showAppointmentModal}
        appointment={selectedAppointment}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedAppointment(null);
        }}
        onEdit={async (id: string, data: UpdateAppointmentData) => {
          await updateAppointment(id, data);
          await loadData();
        }}
        onDelete={async (id: string) => {
          await deleteAppointment(id);
          await loadData();
        }}
        loading={false}
      />
    </SafeAreaView>
  );
}

// Note: Styles are created inside component to access fontSize hook
// This is a workaround for dynamic font sizing
const createStyles = (fontSize: ReturnType<typeof useFontSize>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    padding: Sizes.paddingL,
    paddingTop: Sizes.paddingM,
    paddingBottom: Sizes.paddingXL,
  },
  header: {
    marginBottom: Sizes.marginL,
    marginTop: Sizes.marginM,
  },
  greeting: {
    fontSize: fontSize.fontM,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  name: {
    fontSize: fontSize.fontXL,
    fontWeight: "700",
    color: Colors.text,
  },
  section: {
    marginBottom: Sizes.marginXL,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.marginM,
  },
  sectionTitle: {
    fontSize: fontSize.fontL,
    fontWeight: "700",
    color: Colors.text,
  },
  seeAll: {
    fontSize: fontSize.fontM,
    color: Colors.primary,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.marginM,
  },
  actionCard: {
    width: "48%",
    backgroundColor: Colors.backgroundLight,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Sizes.marginM,
  },
  actionTitle: {
    fontSize: fontSize.fontS,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  appointmentsList: {
    gap: Sizes.marginM,
  },
  ridesList: {
    gap: Sizes.marginM,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Sizes.paddingXL,
    backgroundColor: Colors.backgroundLight,
    borderRadius: Sizes.radiusM,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    fontSize: fontSize.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginTop: Sizes.marginS,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: fontSize.fontS,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Sizes.marginS,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.paddingXL,
    paddingVertical: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
  },
  bookButtonText: {
    color: Colors.textWhite,
    fontSize: fontSize.fontM,
    fontWeight: "600",
  },
});
