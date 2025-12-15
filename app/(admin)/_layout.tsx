// app/(admin)/_layout.tsx
import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Admin Dashboard",
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: "Manage Users",
        }}
      />
      <Stack.Screen
        name="riders"
        options={{
          title: "Manage Riders",
        }}
      />
      <Stack.Screen
        name="companies"
        options={{
          title: "Manage Companies",
        }}
      />
      <Stack.Screen
        name="rides"
        options={{
          title: "All Rides",
        }}
      />
    </Stack>
  );
}
