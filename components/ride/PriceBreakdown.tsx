// components/ride/PriceBreakdown.tsx
import { type FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { formatCurrency, Config } from "../../constants/Config";

interface PriceBreakdownProps {
  distance: number; // in kilometers
  duration?: number; // in minutes
  baseFare?: number;
  peakHourMultiplier?: number;
  showBreakdown?: boolean;
}

export const PriceBreakdown: FC<PriceBreakdownProps> = ({
  distance,
  duration,
  baseFare = Config.BASE_FARE,
  peakHourMultiplier = 1,
  showBreakdown = true,
}) => {
  // Calculate price components
  const distanceFare = distance * Config.PRICE_PER_KILOMETER;
  const timeFare = duration ? duration * Config.PRICE_PER_MINUTE : 0;
  const subtotal = baseFare + distanceFare + timeFare;
  const peakCharge = subtotal * (peakHourMultiplier - 1);
  const total = subtotal + peakCharge;

  // Ensure minimum fare
  const finalTotal = Math.max(total, Config.MINIMUM_FARE);

  if (!showBreakdown) {
    return (
      <View style={styles.simpleContainer}>
        <Text style={styles.simpleLabel}>Estimated Fare</Text>
        <Text style={styles.simplePrice}>{formatCurrency(finalTotal)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Breakdown</Text>

      {/* Base Fare */}
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <Ionicons
            name="pricetag"
            size={16}
            color={Colors.textSecondary}
            style={{ marginRight: Sizes.marginS }}
          />
          <Text style={styles.label}>Base Fare</Text>
        </View>
        <Text style={styles.value}>{formatCurrency(baseFare)}</Text>
      </View>

      {/* Distance Fare */}
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <Ionicons
            name="navigate"
            size={16}
            color={Colors.textSecondary}
            style={{ marginRight: Sizes.marginS }}
          />
          <Text style={styles.label}>
            Distance ({distance.toFixed(1)} km ×{" "}
            {formatCurrency(Config.PRICE_PER_KILOMETER)}/km)
          </Text>
        </View>
        <Text style={styles.value}>{formatCurrency(distanceFare)}</Text>
      </View>

      {/* Time Fare (if available) */}
      {duration && timeFare > 0 && (
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <Ionicons
              name="time"
              size={16}
              color={Colors.textSecondary}
              style={{ marginRight: Sizes.marginS }}
            />
            <Text style={styles.label}>
              Time ({Math.round(duration)} min ×{" "}
              {formatCurrency(Config.PRICE_PER_MINUTE)}/min)
            </Text>
          </View>
          <Text style={styles.value}>{formatCurrency(timeFare)}</Text>
        </View>
      )}

      {/* Peak Hour Charge (if applicable) */}
      {peakHourMultiplier > 1 && (
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <Ionicons
              name="flame"
              size={16}
              color={Colors.warning}
              style={{ marginRight: Sizes.marginS }}
            />
            <Text style={[styles.label, styles.peakLabel]}>
              Peak Hour Charge ({peakHourMultiplier}x)
            </Text>
          </View>
          <Text style={[styles.value, styles.peakValue]}>
            +{formatCurrency(peakCharge)}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Subtotal */}
      <View style={styles.row}>
        <Text style={styles.subtotalLabel}>Subtotal</Text>
        <Text style={styles.subtotalValue}>
          {formatCurrency(subtotal + peakCharge)}
        </Text>
      </View>

      {/* Minimum Fare Note (if applied) */}
      {finalTotal === Config.MINIMUM_FARE && total < Config.MINIMUM_FARE && (
        <View style={styles.minimumFareNote}>
          <Ionicons
            name="information-circle"
            size={16}
            color={Colors.info}
            style={{ marginRight: Sizes.marginS }}
          />
          <Text style={styles.minimumFareText}>
            Minimum fare applied: {formatCurrency(Config.MINIMUM_FARE)}
          </Text>
        </View>
      )}

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Fare</Text>
        <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
      </View>

      {/* Currency Note */}
      <Text style={styles.currencyNote}>
        * All prices in Kuwaiti Dinar (KWD)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginL,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.marginM,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    flex: 1,
  },
  value: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
  },
  peakLabel: {
    color: Colors.warning,
  },
  peakValue: {
    color: Colors.warning,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Sizes.marginM,
  },
  subtotalLabel: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
  },
  subtotalValue: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
  },
  minimumFareNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.infoLight + "30",
    padding: Sizes.paddingM,
    borderRadius: Sizes.radiusS,
    marginVertical: Sizes.marginM,
  },
  minimumFareText: {
    flex: 1,
    fontSize: Sizes.fontS,
    color: Colors.info,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primaryLight + "20",
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    marginTop: Sizes.marginM,
  },
  totalLabel: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.primary,
  },
  totalValue: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.primary,
  },
  currencyNote: {
    fontSize: Sizes.fontXS,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: Sizes.marginM,
    fontStyle: "italic",
  },
  // Simple version styles
  simpleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  simpleLabel: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
  },
  simplePrice: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.primary,
  },
});
