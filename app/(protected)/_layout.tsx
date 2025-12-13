import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import BottomNavBar from "../../components/ui/bottomNavBar";

const ProtectedLayout = () => {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProtectedLayout;
