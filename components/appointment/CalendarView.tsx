// components/appointment/CalendarView.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { IAppointment } from "../../types/appointment.type";
import { Colors, getStatusColor } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface CalendarViewProps {
  appointments: IAppointment[];
  onDayPress?: (date: string) => void;
  selectedDate?: string;
  onMonthChange?: (month: DateData) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onDayPress,
  selectedDate,
  onMonthChange,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Create marked dates object for calendar
  const getMarkedDates = () => {
    const marked: any = {};

    appointments.forEach((appointment) => {
      const date = appointment.date.split("T")[0]; // Get YYYY-MM-DD format
      const statusColor = getStatusColor(appointment.status);

      if (!marked[date]) {
        marked[date] = {
          dots: [],
          marked: true,
        };
      }

      marked[date].dots.push({
        color: statusColor,
      });
    });

    // Add selection to marked dates
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: Colors.primary,
      };
    }

    return marked;
  };

  // Get appointments for selected date
  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(
      (appointment) => appointment.date.split("T")[0] === date
    );
  };

  const handleDayPress = (day: DateData) => {
    onDayPress?.(day.dateString);
  };

  const handleMonthChange = (month: DateData) => {
    setCurrentMonth(`${month.year}-${String(month.month).padStart(2, "0")}`);
    onMonthChange?.(month);
  };

  const selectedDateAppointments = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markingType="multi-dot"
        theme={{
          backgroundColor: Colors.background,
          calendarBackground: Colors.card,
          textSectionTitleColor: Colors.textSecondary,
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: Colors.textWhite,
          todayTextColor: Colors.primary,
          dayTextColor: Colors.text,
          textDisabledColor: Colors.textLight,
          dotColor: Colors.primary,
          selectedDotColor: Colors.textWhite,
          arrowColor: Colors.primary,
          monthTextColor: Colors.text,
          indicatorColor: Colors.primary,
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textDayHeaderFontFamily: "System",
          textDayFontWeight: "400",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Status:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.pending }]}
            />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.confirmed }]}
            />
            <Text style={styles.legendText}>Confirmed</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.completed }]}
            />
            <Text style={styles.legendText}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.cancelled }]}
            />
            <Text style={styles.legendText}>Cancelled</Text>
          </View>
        </View>
      </View>

      {/* Selected Date Appointments */}
      {selectedDate && (
        <View style={styles.selectedDateSection}>
          <View style={styles.selectedDateHeader}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.selectedDateTitle}>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>

          {selectedDateAppointments.length > 0 ? (
            <View style={styles.appointmentsList}>
              {selectedDateAppointments.map((appointment) => (
                <View key={appointment._id} style={styles.appointmentItem}>
                  <View
                    style={[
                      styles.appointmentDot,
                      { backgroundColor: getStatusColor(appointment.status) },
                    ]}
                  />
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentTitle}>
                      {appointment.title}
                    </Text>
                    <Text style={styles.appointmentTime}>
                      {appointment.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noAppointments}>
              <Ionicons
                name="calendar-outline"
                size={40}
                color={Colors.textLight}
              />
              <Text style={styles.noAppointmentsText}>
                No appointments for this day
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  legend: {
    backgroundColor: Colors.card,
    padding: Sizes.paddingL,
    marginTop: Sizes.marginL,
    marginHorizontal: Sizes.marginL,
    borderRadius: Sizes.radiusM,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Sizes.marginM,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.marginL,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginS,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  selectedDateSection: {
    backgroundColor: Colors.card,
    marginTop: Sizes.marginL,
    marginHorizontal: Sizes.marginL,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
    marginBottom: Sizes.marginL,
    paddingBottom: Sizes.paddingM,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedDateTitle: {
    fontSize: Sizes.fontL,
    fontWeight: "700",
    color: Colors.text,
  },
  appointmentsList: {
    gap: Sizes.marginM,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.paddingM,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusS,
  },
  appointmentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Sizes.marginM,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  noAppointments: {
    alignItems: "center",
    paddingVertical: Sizes.paddingXXL,
  },
  noAppointmentsText: {
    fontSize: Sizes.fontM,
    color: Colors.textLight,
    marginTop: Sizes.marginM,
  },
});
