// app/(admin)/rides.tsx
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

export default function AdminRides() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Rides</Text>
      <Text style={styles.subtitle}>Ride management coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Sizes.paddingL,
  },
  title: {
    fontSize: Sizes.font2XL,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Sizes.marginM,
  },
  subtitle: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
  },
});
