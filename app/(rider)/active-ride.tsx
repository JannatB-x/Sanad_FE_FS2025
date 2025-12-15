// app/(rider)/active-ride.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

export default function ActiveRideScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Ride</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>No active ride</Text>
        <Text style={styles.submessage}>
          Turn online to start receiving ride requests
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Sizes.paddingL,
    paddingTop: Sizes.paddingXXL,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.text,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Sizes.paddingXXL,
  },
  message: {
    fontSize: Sizes.fontXL,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Sizes.marginM,
  },
  submessage: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
