// app/(rider)/dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { formatCurrency } from "../../constants/Config";

export default function RiderDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    todayEarnings: 25.5,
    todayRides: 8,
    rating: 4.8,
    completionRate: 95,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Load rider data
    setRefreshing(false);
  };

  const toggleOnlineStatus = async () => {
    setIsOnline(!isOnline);
    // Call API to update online status
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
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || "Driver"}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Online Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusLeft}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isOnline ? Colors.success : Colors.textLight },
            ]}
          />
          <View>
            <Text style={styles.statusTitle}>
              {isOnline ? "You're Online" : "You're Offline"}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isOnline
                ? "Ready to accept ride requests"
                : "Turn on to start receiving rides"}
            </Text>
          </View>
        </View>
        <Switch
          value={isOnline}
          onValueChange={toggleOnlineStatus}
          trackColor={{ false: Colors.border, true: Colors.success }}
          thumbColor={Colors.textWhite}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="wallet" size={32} color={Colors.success} />
          <Text style={styles.statValue}>
            {formatCurrency(stats.todayEarnings)}
          </Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="car" size={32} color={Colors.primary} />
          <Text style={styles.statValue}>{stats.todayRides}</Text>
          <Text style={styles.statLabel}>Today's Rides</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="star" size={32} color={Colors.warning} />
          <Text style={styles.statValue}>{stats.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={32} color={Colors.info} />
          <Text style={styles.statValue}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Completion</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(rider)/active-ride")}
          >
            <Ionicons name="car-sport" size={32} color={Colors.primary} />
            <Text style={styles.actionText}>Current Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(rider)/earnings")}
          >
            <Ionicons name="analytics" size={32} color={Colors.success} />
            <Text style={styles.actionText}>View Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="time" size={32} color={Colors.info} />
            <Text style={styles.actionText}>Ride History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="settings" size={32} color={Colors.textSecondary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Ionicons name="bulb" size={24} color={Colors.warning} />
        <View style={styles.tipsContent}>
          <Text style={styles.tipsTitle}>Driver Tip</Text>
          <Text style={styles.tipsText}>
            Peak hours are 7-9 AM and 5-8 PM. Turn online during these times to
            maximize earnings!
          </Text>
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
  statusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    margin: Sizes.marginL,
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Sizes.marginM,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: Sizes.fontL,
    fontWeight: "700",
    color: Colors.text,
  },
  statusSubtitle: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
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
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    marginTop: 4,
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
  actionText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginTop: Sizes.marginM,
  },
  tipsCard: {
    flexDirection: "row",
    backgroundColor: Colors.warning + "20",
    padding: Sizes.paddingL,
    marginHorizontal: Sizes.marginL,
    borderRadius: Sizes.radiusM,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  tipsContent: {
    flex: 1,
    marginLeft: Sizes.marginM,
  },
  tipsTitle: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  bottomPadding: {
    height: Sizes.paddingXXL,
  },
});
