import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { layoutStyles } from "../../components/styleSheet";

const AuthLayout = () => {
  return (
    <SafeAreaView
      style={layoutStyles.safeArea}
      edges={["left", "right", "bottom"]}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
};

export default AuthLayout;
