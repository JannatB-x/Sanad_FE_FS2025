// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/Auth.context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(rider)" />
        <Stack.Screen name="(company)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </AuthProvider>
  );
}
