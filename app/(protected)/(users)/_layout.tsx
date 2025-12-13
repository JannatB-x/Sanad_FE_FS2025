import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { layoutStyles } from "../../../components/styleSheet";

const UsersLayout = () => {
  return (
    <SafeAreaView
      style={layoutStyles.safeArea}
      edges={["left", "right", "bottom"]}
    >
      <Slot />
    </SafeAreaView>
  );
};

export default UsersLayout;
