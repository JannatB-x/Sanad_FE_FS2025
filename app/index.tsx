import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useSegments, type Href } from "expo-router";
import { useContext } from "react";
import AuthContext from "../context/authContext";

export default function Index() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";

    if (!isAuthenticated && !inAuthGroup) {
      // Not authenticated and not in auth group, redirect to login
      router.replace("/(auth)/login" as Href);
    } else if (isAuthenticated && inAuthGroup) {
      // Authenticated but in auth group, redirect to home
      router.replace("/(protected)/(home)" as Href);
    } else if (isAuthenticated && !inProtectedGroup && segments.length === 0) {
      // Authenticated and at root, redirect to home
      router.replace("/(protected)/(home)" as Href);
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8E8E93" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
