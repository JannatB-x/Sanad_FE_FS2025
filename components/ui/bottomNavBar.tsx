import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import type { Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../data/colors";

interface NavItem {
  name: string;
  route: Href;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
  label: string;
}

const navItems: NavItem[] = [
  {
    name: "home",
    route: "/(protected)/(home)" as Href,
    icon: "home",
    iconOutline: "home-outline",
    label: "Home",
  },
  {
    name: "calendar",
    route: "/(protected)/(calendar)" as Href,
    icon: "calendar",
    iconOutline: "calendar-outline",
    label: "Calendar",
  },
  {
    name: "drivers",
    route: "/(protected)/(drivers)" as Href,
    icon: "car",
    iconOutline: "car-outline",
    label: "Drivers",
  },
  {
    name: "rides",
    route: "/(protected)/(rides)" as Href,
    icon: "map",
    iconOutline: "map-outline",
    label: "Rides",
  },
  {
    name: "profile",
    route: "/(protected)/(profile)" as Href,
    icon: "person",
    iconOutline: "person-outline",
    label: "Profile",
  },
];

const BottomNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: Href) => {
    if (!pathname) return false;
    const normalizedPathname = pathname.replace(/\/$/, "");
    const normalizedRoute = String(route).replace(/\/$/, "");
    return (
      normalizedPathname === normalizedRoute ||
      normalizedPathname?.startsWith(normalizedRoute + "/")
    );
  };

  const handleNavigation = (route: Href) => {
    if (pathname !== route) {
      try {
        router.replace(route);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  const memoizedNavItems = useMemo(() => navItems, []);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.navBar}>
        {memoizedNavItems.map((item) => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Navigate to ${item.label}`}
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={active ? item.icon : item.iconOutline}
                size={24}
                color={active ? colors.primary : colors.gray}
              />
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
    fontWeight: "500",
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: "600",
  },
});

export default BottomNavBar;
