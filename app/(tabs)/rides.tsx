// app/(tabs)/rides.tsx
import React, { useEffect, useState } from "react";
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
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { useRide } from "../../hooks/useRide";
import { RideCard } from "../../components/ride/RideCard";
import { Loading } from "../../components/common/Loading";

export default function RidesScreen() {
  const router = useRouter();
  const { rides, getMyRides, loading } = useRide();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">(
    "all"
  );

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    await getMyRides();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRides();
    setRefreshing(false);
  };

  const filteredRides = rides.filter((ride) => {
    if (filter === "all") return true;
    return ride.status === filter;
  });

  if (loading && !refreshing) {
    return <Loading visible message="Loading rides..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Rides</Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "completed" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "completed" && styles.filterTextActive,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "cancelled" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("cancelled")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "cancelled" && styles.filterTextActive,
            ]}
          >
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rides List */}
      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              onPress={() => router.push(`/ride/${ride._id}`)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>
              {filter === "all" ? "No rides yet" : `No ${filter} rides`}
            </Text>
            {filter === "all" && (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => router.push("/book-ride")}
              >
                <Text style={styles.bookButtonText}>Book Your First Ride</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
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
  filters: {
    flexDirection: "row",
    padding: Sizes.paddingL,
    gap: Sizes.marginM,
    backgroundColor: Colors.card,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
  },
  filterTextActive: {
    color: Colors.textWhite,
  },
  list: {
    flex: 1,
    padding: Sizes.paddingL,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Sizes.paddingXXL,
    marginTop: Sizes.marginXXL,
  },
  emptyText: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
    marginTop: Sizes.marginL,
    marginBottom: Sizes.marginXL,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.paddingXXL,
    paddingVertical: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
  },
  bookButtonText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.textWhite,
  },
});
