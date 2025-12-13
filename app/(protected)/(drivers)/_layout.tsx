import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { layoutStyles } from "../../../components/styleSheet";

const DriversLayout = () => {
  return (
    <SafeAreaView
      style={layoutStyles.safeArea}
      edges={["left", "right", "top"]}
    >
      <Slot />
    </SafeAreaView>
  );
};

export default DriversLayout;
