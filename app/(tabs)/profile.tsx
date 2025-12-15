// app/(tabs)/profile.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { ProfileHeader } from "../../components/user/ProfileHeader";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: "person-outline",
      title: "Edit Profile",
      onPress: () => router.push("/edit-profile"),
    },
    {
      icon: "medical-outline",
      title: "Medical Information",
      onPress: () => router.push("/medical-info"),
    },
    {
      icon: "call-outline",
      title: "Emergency Contact",
      onPress: () => router.push("/emergency-contact"),
    },
    {
      icon: "card-outline",
      title: "Payment Methods",
      onPress: () => router.push("/payment-methods"),
    },
    {
      icon: "settings-outline",
      title: "Settings",
      onPress: () => router.push("/settings"),
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      onPress: () => router.push("/help"),
    },
  ];

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader
        user={user}
        onEditPress={() => router.push("/edit-profile")}
        onImagePress={() => {
          // Handle image upload
          Alert.alert("Change Photo", "Photo upload coming soon!");
        }}
      />

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  menu: {
    marginTop: Sizes.marginL,
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    marginHorizontal: Sizes.marginL,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Sizes.paddingL,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Sizes.marginM,
  },
  menuItemText: {
    fontSize: Sizes.fontL,
    color: Colors.text,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.paddingL,
    gap: Sizes.marginM,
  },
  logoutText: {
    fontSize: Sizes.fontL,
    color: Colors.error,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    color: Colors.textLight,
    fontSize: Sizes.fontS,
    marginTop: Sizes.marginXXL,
    marginBottom: Sizes.marginXXL,
  },
});
