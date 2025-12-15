// components/appointment/CalendarView.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { IAppointment } from "../../types/appointment.type";
import { Colors } from "../../constants/Colors";

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
  // Create marked dates object for calendar
  const getMarkedDates = () => {
    const marked: any = {};

    appointments.forEach((appointment) => {
      // Handle both YYYY-MM-DD and YYYY-MM-DDTHH:mm:ss formats
      let date = appointment.date;
      if (date.includes("T")) {
        date = date.split("T")[0];
      }
      // Ensure date is in YYYY-MM-DD format
      if (date.length === 10 && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        if (!marked[date]) {
          marked[date] = {
            dots: [],
            marked: true,
          };
        }

        marked[date].dots.push({
          color: Colors.primary,
        });
      }
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

  const handleDayPress = (day: DateData) => {
    onDayPress?.(day.dateString);
  };

  const handleMonthChange = (month: DateData) => {
    onMonthChange?.(month);
  };

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markingType="multi-dot"
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
