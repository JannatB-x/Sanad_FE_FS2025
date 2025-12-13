import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  parseISO,
  addWeeks,
  subWeeks,
} from "date-fns";
import { getBookings } from "../../../api/calendar";
import { getRides } from "../../../api/rides";
import type { CalendarEvent } from "../../../types/calendarInfo";
import type { Ride } from "../../../types/rideTypes";
import colors from "../../../data/colors";

const HomeScreen = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  // Fetch calendar bookings
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  // Fetch rides
  const { data: rides = [], isLoading: isLoadingRides } = useQuery({
    queryKey: ["rides"],
    queryFn: getRides,
  });

  // Get week days
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedWeek, { weekStartsOn: 0 }); // Sunday
    const end = endOfWeek(selectedWeek, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [selectedWeek]);

  // Filter upcoming appointments
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((event: CalendarEvent) => {
        try {
          const eventDate = parseISO(event.Date);
          // Combine date and time if available
          let eventDateTime = eventDate;
          if (event.Time) {
            const timeStr = event.Time.includes("T")
              ? event.Time
              : `${event.Date}T${event.Time}`;
            eventDateTime = parseISO(timeStr);
          }
          return eventDateTime >= now;
        } catch {
          return false;
        }
      })
      .sort((a: CalendarEvent, b: CalendarEvent) => {
        try {
          const dateA = parseISO(
            a.Date + (a.Time?.includes("T") ? "" : `T${a.Time || "00:00"}`)
          );
          const dateB = parseISO(
            b.Date + (b.Time?.includes("T") ? "" : `T${b.Time || "00:00"}`)
          );
          return dateA.getTime() - dateB.getTime();
        } catch {
          return 0;
        }
      })
      .slice(0, 5); // Show only next 5 appointments
  }, [bookings]);

  // Filter upcoming rides (requested, accepted, or in_progress)
  const upcomingRides = useMemo(() => {
    const now = new Date();
    return rides
      .filter(
        (ride: Ride) =>
          (ride.status === "requested" ||
            ride.status === "accepted" ||
            ride.status === "in_progress") &&
          new Date(ride.requestedAt) >= now
      )
      .sort(
        (a: Ride, b: Ride) =>
          new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
      )
      .slice(0, 5); // Show only next 5 rides
  }, [rides]);

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return bookings.filter((event: CalendarEvent) => {
      try {
        const eventDate = parseISO(event.Date);
        return isSameDay(eventDate, date);
      } catch {
        return false;
      }
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setSelectedWeek((current) =>
      direction === "next" ? addWeeks(current, 1) : subWeeks(current, 1)
    );
  };

  const formatTime = (timeString: string) => {
    try {
      // Handle time format (could be "HH:mm" or full ISO string)
      if (timeString.includes("T")) {
        return format(parseISO(timeString), "h:mm a");
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const formatRideDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) {
        return `Today, ${format(date, "h:mm a")}`;
      }
      return format(date, "MMM d, h:mm a");
    } catch {
      return dateString;
    }
  };

  const formatAppointmentDate = (event: CalendarEvent) => {
    try {
      const date = parseISO(event.Date);
      let dateTime = date;
      if (event.Time) {
        const timeStr = event.Time.includes("T")
          ? event.Time
          : `${event.Date}T${event.Time}`;
        dateTime = parseISO(timeStr);
      }
      if (isToday(dateTime)) {
        return `Today, ${format(dateTime, "h:mm a")}`;
      }
      return format(dateTime, "MMM d, h:mm a");
    } catch {
      return event.Date;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return colors.success;
      case "in_progress":
        return colors.info;
      case "requested":
        return colors.warning;
      default:
        return colors.gray;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Sanad</Text>
        <Text style={styles.headerSubtitle}>Your transportation companion</Text>
      </View>

      {/* Weekly Calendar Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Calendar</Text>
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              onPress={() => navigateWeek("prev")}
              style={styles.navButton}
            >
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigateWeek("next")}
              style={styles.navButton}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.weekRange}>
          {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
        </Text>

        {isLoadingBookings ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <View style={styles.calendarGrid}>
            {weekDays.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);
              return (
                <View key={index} style={styles.dayColumn}>
                  <View
                    style={[
                      styles.dayHeader,
                      isCurrentDay && styles.dayHeaderToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayName,
                        isCurrentDay && styles.dayNameToday,
                      ]}
                    >
                      {format(day, "EEE")}
                    </Text>
                    <Text
                      style={[
                        styles.dayNumber,
                        isCurrentDay && styles.dayNumberToday,
                      ]}
                    >
                      {format(day, "d")}
                    </Text>
                  </View>
                  <View style={styles.eventsContainer}>
                    {dayEvents.map(
                      (event: CalendarEvent, eventIndex: number) => (
                        <View
                          key={event._id || eventIndex}
                          style={styles.eventDot}
                        >
                          <View style={styles.eventContent}>
                            <Text style={styles.eventTitle} numberOfLines={1}>
                              {event.Title}
                            </Text>
                            <Text style={styles.eventTime}>
                              {formatTime(event.Time)}
                            </Text>
                            <Text
                              style={styles.eventLocation}
                              numberOfLines={1}
                            >
                              {event.Location}
                            </Text>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Upcoming Appointments Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <Ionicons name="calendar" size={24} color={colors.primary} />
        </View>

        {isLoadingBookings ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loader}
          />
        ) : upcomingAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.gray} />
            <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            <Text style={styles.emptyStateSubtext}>
              Your scheduled appointments will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.appointmentsList}>
            {upcomingAppointments.map((appointment: CalendarEvent) => (
              <View key={appointment._id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentInfo}>
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={colors.secondary}
                      style={styles.appointmentIcon}
                    />
                    <View style={styles.appointmentDetails}>
                      <Text style={styles.appointmentTitle} numberOfLines={1}>
                        {appointment.Title}
                      </Text>
                      <Text style={styles.appointmentTime}>
                        {formatAppointmentDate(appointment)}
                      </Text>
                      {appointment.Location && (
                        <View style={styles.appointmentLocationRow}>
                          <Ionicons
                            name="location"
                            size={14}
                            color={colors.gray}
                          />
                          <Text
                            style={styles.appointmentLocation}
                            numberOfLines={1}
                          >
                            {appointment.Location}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Upcoming Rides Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Rides</Text>
          <Ionicons name="car" size={24} color={colors.primary} />
        </View>

        {isLoadingRides ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loader}
          />
        ) : upcomingRides.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={48} color={colors.gray} />
            <Text style={styles.emptyStateText}>No upcoming rides</Text>
            <Text style={styles.emptyStateSubtext}>
              Your scheduled rides will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.ridesList}>
            {upcomingRides.map((ride: Ride) => (
              <View key={ride._id} style={styles.rideCard}>
                <View style={styles.rideHeader}>
                  <View style={styles.rideInfo}>
                    <Ionicons
                      name="location"
                      size={20}
                      color={colors.primary}
                      style={styles.rideIcon}
                    />
                    <View style={styles.rideDetails}>
                      <Text style={styles.rideTime}>
                        {formatRideDate(ride.requestedAt)}
                      </Text>
                      <Text style={styles.rideStatus} numberOfLines={1}>
                        {ride.pickup.address}
                      </Text>
                      <Text style={styles.rideDestination} numberOfLines={1}>
                        → {ride.dropoff.address}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(ride.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(ride.status) },
                      ]}
                    >
                      {ride.status.replace("_", " ").toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.rideFooter}>
                  <View style={styles.rideMeta}>
                    <Ionicons name="cash" size={16} color={colors.gray} />
                    <Text style={styles.rideMetaText}>
                      ${ride.fare?.toFixed(2) || "0.00"}
                    </Text>
                  </View>
                  <View style={styles.rideMeta}>
                    <Ionicons name="time" size={16} color={colors.gray} />
                    <Text style={styles.rideMetaText}>
                      {ride.duration || 0} min
                    </Text>
                  </View>
                  <View style={styles.rideMeta}>
                    <Ionicons name="card" size={16} color={colors.gray} />
                    <Text style={styles.rideMetaText}>
                      {ride.paymentMethod || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.gray,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark,
  },
  weekNavigation: {
    flexDirection: "row",
    gap: 8,
  },
  navButton: {
    padding: 4,
  },
  weekRange: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
    fontWeight: "500",
  },
  calendarGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayColumn: {
    flex: 1,
    alignItems: "center",
    minHeight: 120,
  },
  dayHeader: {
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    width: "100%",
  },
  dayHeaderToday: {
    backgroundColor: colors.primary,
  },
  dayName: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: "500",
    marginBottom: 4,
  },
  dayNameToday: {
    color: colors.white,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
  },
  dayNumberToday: {
    color: colors.white,
  },
  eventsContainer: {
    width: "100%",
    alignItems: "center",
  },
  eventDot: {
    width: "90%",
    marginBottom: 6,
  },
  eventContent: {
    backgroundColor: colors.light,
    padding: 6,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  eventTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 10,
    color: colors.primary,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 9,
    color: colors.gray,
  },
  ridesList: {
    gap: 12,
  },
  rideCard: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rideInfo: {
    flexDirection: "row",
    flex: 1,
  },
  rideIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  rideDetails: {
    flex: 1,
  },
  rideTime: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  rideStatus: {
    fontSize: 13,
    color: colors.dark,
    marginBottom: 2,
  },
  rideDestination: {
    fontSize: 12,
    color: colors.gray,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  rideFooter: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rideMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rideMetaText: {
    fontSize: 12,
    color: colors.gray,
  },
  loader: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentCard: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appointmentInfo: {
    flexDirection: "row",
    flex: 1,
  },
  appointmentIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 6,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.secondary,
    marginBottom: 6,
  },
  appointmentLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  appointmentLocation: {
    fontSize: 13,
    color: colors.gray,
    flex: 1,
  },
});

export default HomeScreen;
