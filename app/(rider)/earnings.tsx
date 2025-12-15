// app/(rider)/earnings.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { formatCurrency } from "../../constants/Config";
import { Ionicons } from "@expo/vector-icons";

export default function EarningsScreen() {
  // Mock data
  const earnings = {
    today: 25.5,
    week: 180.0,
    month: 720.0,
    total: 5400.0,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Total Earnings</Text>
        <Text style={styles.mainAmount}>{formatCurrency(earnings.total)}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.earningCard}>
          <Ionicons name="today" size={24} color={Colors.primary} />
          <Text style={styles.cardAmount}>
            {formatCurrency(earnings.today)}
          </Text>
          <Text style={styles.cardLabel}>Today</Text>
        </View>

        <View style={styles.earningCard}>
          <Ionicons name="calendar" size={24} color={Colors.success} />
          <Text style={styles.cardAmount}>{formatCurrency(earnings.week)}</Text>
          <Text style={styles.cardLabel}>This Week</Text>
        </View>

        <View style={styles.earningCard}>
          <Ionicons name="stats-chart" size={24} color={Colors.info} />
          <Text style={styles.cardAmount}>
            {formatCurrency(earnings.month)}
          </Text>
          <Text style={styles.cardLabel}>This Month</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Sizes.paddingL,
    paddingTop: Sizes.paddingXXL,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.text,
  },
  mainCard: {
    backgroundColor: Colors.primary,
    margin: Sizes.marginL,
    padding: Sizes.paddingXXL,
    borderRadius: Sizes.radiusL,
    alignItems: "center",
  },
  mainLabel: {
    fontSize: Sizes.fontL,
    color: Colors.textWhite,
    opacity: 0.9,
  },
  mainAmount: {
    fontSize: Sizes.font5XL,
    fontWeight: "700",
    color: Colors.textWhite,
    marginTop: Sizes.marginM,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Sizes.paddingL,
    gap: Sizes.marginL,
  },
  earningCard: {
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
  cardAmount: {
    fontSize: Sizes.fontXXL,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Sizes.marginM,
  },
  cardLabel: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
