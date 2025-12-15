// components/user/PaymentMethodsModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface PaymentMethod {
  id: string;
  type: "card" | "cash" | "wallet";
  name: string;
  last4?: string;
  isDefault: boolean;
}

interface PaymentMethodsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMethod?: () => void;
}

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({
  visible,
  onClose,
  onAddMethod,
}) => {
  // Mock payment methods - replace with actual data from API
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa •••• 1234",
      last4: "1234",
      isDefault: true,
    },
    {
      id: "2",
      type: "cash",
      name: "Cash",
      isDefault: false,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "card":
        return "card-outline";
      case "cash":
        return "cash-outline";
      case "wallet":
        return "wallet-outline";
      default:
        return "card-outline";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payment Methods</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={styles.methodCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.methodLeft}>
                    <View
                      style={[
                        styles.methodIcon,
                        {
                          backgroundColor:
                            method.type === "card"
                              ? Colors.primary + "20"
                              : Colors.success + "20",
                        },
                      ]}
                    >
                      <Ionicons
                        name={getIcon(method.type) as any}
                        size={24}
                        color={
                          method.type === "card" ? Colors.primary : Colors.success
                        }
                      />
                    </View>
                    <View style={styles.methodInfo}>
                      <Text style={styles.methodName}>{method.name}</Text>
                      {method.isDefault && (
                        <Text style={styles.defaultBadge}>Default</Text>
                      )}
                    </View>
                  </View>
                  {method.isDefault && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={Colors.success}
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="card-outline"
                  size={64}
                  color={Colors.textLight}
                />
                <Text style={styles.emptyText}>No payment methods</Text>
                <Text style={styles.emptySubtext}>
                  Add a payment method to get started
                </Text>
              </View>
            )}

            {/* Add Payment Method Button */}
            {onAddMethod && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={onAddMethod}
              >
                <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                <Text style={styles.addButtonText}>Add Payment Method</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Sizes.radiusXL,
    borderTopRightRadius: Sizes.radiusXL,
    maxHeight: "90%",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Sizes.paddingL,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    maxHeight: 500,
  },
  scrollContent: {
    padding: Sizes.paddingL,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundLight,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    marginBottom: Sizes.marginM,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Sizes.marginM,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  defaultBadge: {
    fontSize: Sizes.fontS,
    color: Colors.success,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Sizes.paddingXXL,
  },
  emptyText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
    marginTop: Sizes.marginL,
    marginBottom: Sizes.marginS,
  },
  emptySubtext: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary + "10",
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    marginTop: Sizes.marginM,
    gap: Sizes.marginS,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.primary,
  },
});

