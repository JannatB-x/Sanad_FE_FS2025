// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { type FC } from "react";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { UserType } from "../../types/user.type";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

const TabsLayout: FC = () => {
  return (
    <ProtectedRoute allowedRoles={[UserType.USER]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            backgroundColor: Colors.card,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            height: Platform.OS === "ios" ? 88 : 64,
            paddingBottom: Platform.OS === "ios" ? 28 : 8,
            paddingTop: 8,
            elevation: 8,
            shadowColor: Colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: Sizes.fontS,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="rides"
          options={{
            title: "Rides",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="car" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
};

export default TabsLayout;
