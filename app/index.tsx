// app/index.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../constants/Colors";
import { Sizes } from "../constants/Sizes";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Route based on user type
        if (user.userType === "user") {
          router.replace("/(tabs)");
        } else if (user.userType === "rider") {
          router.replace("/(rider)/dashboard");
        } else if (user.userType === "company") {
          router.replace("/(company)/dashboard");
        } else if (user.userType === "admin") {
          router.replace("/(admin)/dashboard");
        }
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Loading Sanad...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: Sizes.marginL,
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
  },
});
