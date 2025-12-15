// app/(admin)/dashboard.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

export default function AdminDashboard() {
  const router = useRouter();

  const menuItems = [
    {
      title: "Manage Users",
      icon: "people",
      route: "/(admin)/users",
      color: "#007AFF",
    },
    {
      title: "Manage Riders",
      icon: "car",
      route: "/(admin)/riders",
      color: "#34C759",
    },
    {
      title: "Manage Companies",
      icon: "business",
      route: "/(admin)/companies",
      color: "#FF9500",
    },
    {
      title: "All Rides",
      icon: "map",
      route: "/(admin)/rides",
      color: "#AF52DE",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage the Sanad platform</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon as any} size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Sizes.paddingL,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: Sizes.font3XL,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: Sizes.marginS,
  },
  subtitle: {
    fontSize: Sizes.fontM,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Sizes.paddingL,
    justifyContent: "space-between",
  },
  menuItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: Sizes.radiusL,
    padding: Sizes.paddingL,
    marginBottom: Sizes.marginL,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Sizes.marginM,
  },
  menuItemText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
});
