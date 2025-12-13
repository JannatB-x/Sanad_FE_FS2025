import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DriversScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drivers</Text>
      <Text style={styles.subtitle}>
        Available drivers and their information
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#8E8E93",
  },
});

export default DriversScreen;
