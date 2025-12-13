import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
} from "react-native";
import { useRouter, type Href } from "expo-router";

const ProtectedScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Wait for all interactions to complete before navigating
    // This ensures the Root Layout is fully mounted
    const task = InteractionManager.runAfterInteractions(() => {
      router.replace("/(protected)/(home)" as Href);
    });

    return () => task.cancel();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8E8E93" style={styles.spinner} />
      <Text style={styles.text}>Redirecting to home...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "#8E8E93",
  },
});

export default ProtectedScreen;
