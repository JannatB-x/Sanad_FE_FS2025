// app/(company)/dashboard.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { formatCurrency } from "../../constants/Config";

export default function CompanyDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const stats = {
    totalVehicles: 12,
    activeVehicles: 8,
    totalDrivers: 15,
    activeDrivers: 10,
    todayRides: 45,
    todayRevenue: 850.5,
    monthlyRevenue: 12500.0,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Load company data
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Company Dashboard</Text>
          <Text style={styles.name}>{user?.name || "Company"}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Revenue Card */}
      <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
          <Ionicons name="trending-up" size={32} color={Colors.success} />
          <Text style={styles.revenueLabel}>Monthly Revenue</Text>
        </View>
        <Text style={styles.revenueAmount}>
          {formatCurrency(stats.monthlyRevenue)}
        </Text>
        <View style={styles.revenueFooter}>
          <Text style={styles.revenueSubtext}>
            Today: {formatCurrency(stats.todayRevenue)}
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="car-sport" size={28} color={Colors.primary} />
          <Text style={styles.statValue}>{stats.activeVehicles}</Text>
          <Text style={styles.statLabel}>Active Vehicles</Text>
          <Text style={styles.statTotal}>of {stats.totalVehicles} total</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people" size={28} color={Colors.info} />
          <Text style={styles.statValue}>{stats.activeDrivers}</Text>
          <Text style={styles.statLabel}>Active Drivers</Text>
          <Text style={styles.statTotal}>of {stats.totalDrivers} total</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="speedometer" size={28} color={Colors.success} />
          <Text style={styles.statValue}>{stats.todayRides}</Text>
          <Text style={styles.statLabel}>Today's Rides</Text>
          <Text style={styles.statTotal}>In progress</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="wallet" size={28} color={Colors.warning} />
          <Text style={styles.statValue}>
            {formatCurrency(stats.todayRevenue)}
          </Text>
          <Text style={styles.statLabel}>Today's Revenue</Text>
          <Text style={styles.statTotal}>Earnings</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(company)/vehicles")}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: Colors.primary + "20" },
              ]}
            >
              <Ionicons name="car-sport" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Manage Vehicles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(company)/riders")}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: Colors.info + "20" },
              ]}
            >
              <Ionicons name="people" size={28} color={Colors.info} />
            </View>
            <Text style={styles.actionText}>Manage Drivers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: Colors.success + "20" },
              ]}
            >
              <Ionicons name="add-circle" size={28} color={Colors.success} />
            </View>
            <Text style={styles.actionText}>Add Vehicle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: Colors.warning + "20" },
              ]}
            >
              <Ionicons name="analytics" size={28} color={Colors.warning} />
            </View>
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Sizes.paddingL,
    paddingTop: Sizes.paddingXXL,
    backgroundColor: Colors.card,
  },
  greeting: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
  },
  name: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  revenueCard: {
    backgroundColor: Colors.primary,
    margin: Sizes.marginL,
    padding: Sizes.paddingXL,
    borderRadius: Sizes.radiusL,
  },
  revenueHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
    marginBottom: Sizes.marginM,
  },
  revenueLabel: {
    fontSize: Sizes.fontL,
    color: Colors.textWhite,
    fontWeight: "600",
  },
  revenueAmount: {
    fontSize: Sizes.font5XL,
    fontWeight: "700",
    color: Colors.textWhite,
    marginBottom: Sizes.marginM,
  },
  revenueFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.textWhite + "30",
    paddingTop: Sizes.paddingM,
  },
  revenueSubtext: {
    fontSize: Sizes.fontM,
    color: Colors.textWhite,
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Sizes.paddingL,
    gap: Sizes.marginL,
  },
  statCard: {
    width: "47%",
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Sizes.marginM,
  },
  statLabel: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  statTotal: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    padding: Sizes.paddingL,
  },
  sectionTitle: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginL,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.marginL,
  },
  actionCard: {
    width: "47%",
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Sizes.marginM,
  },
  actionText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  bottomPadding: {
    height: Sizes.paddingXXL,
  },
});
