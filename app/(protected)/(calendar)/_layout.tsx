import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { layoutStyles } from "../../../components/styleSheet";

const CalendarLayout = () => {
  return (
    <SafeAreaView
      style={layoutStyles.safeArea}
      edges={["left", "right", "top"]}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
};

export default CalendarLayout;
