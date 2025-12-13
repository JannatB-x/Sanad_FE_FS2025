import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { getBookings, deleteBooking } from "../../../api/calendar";
import type { CalendarEvent } from "../../../types/calendarInfo";
import colors from "../../../data/colors";

const CalendarScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Alert.alert("Success", "Booking deleted successfully");
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.message || "Failed to delete booking");
    },
  });

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return bookings.filter((event: CalendarEvent) => {
      try {
        const eventDate = parseISO(event.Date);
        return isSameDay(eventDate, selectedDate);
      } catch {
        return false;
      }
    });
  }, [bookings, selectedDate]);

  // Get events count for a specific day
  const getEventCount = (date: Date) => {
    return bookings.filter((event: CalendarEvent) => {
      try {
        const eventDate = parseISO(event.Date);
        return isSameDay(eventDate, date);
      } catch {
        return false;
      }
    }).length;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((current) =>
      direction === "next" ? addMonths(current, 1) : subMonths(current, 1)
    );
  };

  const handleDelete = (event: CalendarEvent) => {
    if (!event._id) return;

    Alert.alert(
      "Delete Booking",
      `Are you sure you want to delete "${event.Title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(event._id!),
        },
      ]
    );
  };

  const handleEdit = (event: CalendarEvent) => {
    router.push({
      pathname: "/(protected)/(calendar)/edit",
      params: {
        id: event._id,
        title: event.Title,
        location: event.Location,
        date: event.Date,
        time: event.Time,
      },
    });
  };

  const formatTime = (timeString: string) => {
    try {
      if (timeString.includes("T")) {
        return format(parseISO(timeString), "h:mm a");
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(protected)/(calendar)/add")}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() => navigateMonth("prev")}
            style={styles.monthNavButton}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {format(currentMonth, "MMMM yyyy")}
          </Text>
          <TouchableOpacity
            onPress={() => navigateMonth("next")}
            style={styles.monthNavButton}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <View style={styles.calendarContainer}>
            {/* Week day headers */}
            <View style={styles.weekHeader}>
              {weekDays.map((day) => (
                <View key={day} style={styles.weekDayHeader}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar days */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const isCurrentMonthDay = isSameMonth(day, currentMonth);
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDay = isToday(day);
                const eventCount = getEventCount(day);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      !isCurrentMonthDay && styles.dayCellOtherMonth,
                      isSelected && styles.dayCellSelected,
                      isTodayDay && !isSelected && styles.dayCellToday,
                    ]}
                    onPress={() => setSelectedDate(day)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !isCurrentMonthDay && styles.dayTextOtherMonth,
                        isSelected && styles.dayTextSelected,
                        isTodayDay && !isSelected && styles.dayTextToday,
                      ]}
                    >
                      {format(day, "d")}
                    </Text>
                    {eventCount > 0 && (
                      <View
                        style={[
                          styles.eventIndicator,
                          isSelected && styles.eventIndicatorSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.eventCount,
                            isSelected && styles.eventCountSelected,
                          ]}
                        >
                          {eventCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Selected Date Events List */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsHeader}>
            <Text style={styles.eventsTitle}>
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </Text>
            <Text style={styles.eventsCount}>
              {selectedDateEvents.length} event
              {selectedDateEvents.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {selectedDateEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.gray} />
              <Text style={styles.emptyStateText}>No events for this day</Text>
              <TouchableOpacity
                style={styles.addEventButton}
                onPress={() => router.push("/(protected)/(calendar)/add")}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
                <Text style={styles.addEventText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.eventsList}>
              {selectedDateEvents.map((event: CalendarEvent) => (
                <View key={event._id} style={styles.eventCard}>
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle}>{event.Title}</Text>
                      <View style={styles.eventActions}>
                        <TouchableOpacity
                          onPress={() => handleEdit(event)}
                          style={styles.actionButton}
                        >
                          <Ionicons
                            name="create-outline"
                            size={20}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(event)}
                          style={styles.actionButton}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color={colors.danger}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetailRow}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={colors.gray}
                        />
                        <Text style={styles.eventDetailText}>
                          {formatTime(event.Time)}
                        </Text>
                      </View>
                      <View style={styles.eventDetailRow}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color={colors.gray}
                        />
                        <Text style={styles.eventDetailText}>
                          {event.Location}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
  },
  monthNavButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark,
  },
  loader: {
    padding: 40,
  },
  calendarContainer: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 12,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  weekDayHeader: {
    width: "14.28%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.gray,
    textTransform: "uppercase",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 0,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: 0,
    padding: 4,
    position: "relative",
  },
  dayCellOtherMonth: {
    opacity: 0.3,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellToday: {
    backgroundColor: colors.light,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.dark,
    textAlign: "center",
    alignSelf: "center",
  },
  dayTextOtherMonth: {
    color: colors.gray,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: "600",
  },
  eventIndicator: {
    position: "absolute",
    bottom: 4,
    left: "50%",
    transform: [{ translateX: -10 }],
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  eventIndicatorSelected: {
    backgroundColor: colors.white,
  },
  eventCount: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.white,
  },
  eventCountSelected: {
    color: colors.primary,
  },
  eventsSection: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 12,
  },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    flex: 1,
  },
  eventsCount: {
    fontSize: 14,
    color: colors.gray,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 16,
    marginBottom: 24,
  },
  addEventButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 8,
  },
  addEventText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    flex: 1,
    marginRight: 12,
  },
  eventActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: colors.gray,
    flex: 1,
  },
});

export default CalendarScreen;
