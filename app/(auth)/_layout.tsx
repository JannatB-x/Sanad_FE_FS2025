// app/(auth)/_layout.tsx
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function AuthLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users away from auth screens
    if (!isLoading && isAuthenticated && user) {
      switch (user.userType) {
        case "user":
          router.replace("/(tabs)");
          break;
        case "rider":
          router.replace("/(rider)/dashboard");
          break;
        case "company":
          router.replace("/(company)/dashboard");
          break;
        case "admin":
          router.replace("/(admin)/dashboard");
          break;
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
