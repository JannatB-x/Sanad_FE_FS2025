// app/(admin)/riders.tsx
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

export default function AdminRiders() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Riders</Text>
      <Text style={styles.subtitle}>Rider management coming soon...</Text>
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
