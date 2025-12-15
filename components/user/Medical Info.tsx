// components/user/MedicalInfo.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import {
  COMMON_DISEASES,
  DISABILITY_LEVELS,
} from "../../constants/User.Constant";

interface MedicalInfoProps {
  diseases?: string[];
  disabilityLevel?: string;
  statusDocuments?: string[];
  emergencyContact?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const MedicalInfo: React.FC<MedicalInfoProps> = ({
  diseases = [],
  disabilityLevel = "none",
  statusDocuments = [],
  emergencyContact,
  emergencyContactPhone,
  emergencyContactRelation,
  onEdit,
  showEditButton = true,
}) => {
  const renderInfoRow = (icon: any, label: string, value?: string) => {
    if (!value) return null;

    return (
      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="medical" size={24} color={Colors.primary} />
          <Text style={styles.title}>Medical Information</Text>
        </View>
        {showEditButton && onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Disability Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disability Level</Text>
        <View style={styles.card}>
          <View style={styles.disabilityContainer}>
            <Ionicons
              name="accessibility"
              size={32}
              color={
                disabilityLevel === "none"
                  ? Colors.success
                  : disabilityLevel === "mild"
                  ? Colors.warning
                  : Colors.error
              }
            />
            <View style={styles.disabilityInfo}>
              <Text style={styles.disabilityLevel}>
                {disabilityLevel.charAt(0).toUpperCase() +
                  disabilityLevel.slice(1)}
              </Text>
              {disabilityLevel !== "none" && (
                <Text style={styles.disabilityNote}>
                  Special accommodations may be required
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Medical Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Conditions</Text>
        <View style={styles.card}>
          {diseases.length > 0 ? (
            <View style={styles.diseasesList}>
              {diseases.map((disease, index) => (
                <View key={index} style={styles.diseaseItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Colors.medical}
                  />
                  <Text style={styles.diseaseText}>{disease}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="heart" size={40} color={Colors.success} />
              <Text style={styles.emptyText}>
                No medical conditions reported
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Status Documents */}
      {statusDocuments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Documents</Text>
          <View style={styles.card}>
            <View style={styles.documentsList}>
              {statusDocuments.map((doc, index) => (
                <TouchableOpacity key={index} style={styles.documentItem}>
                  <Ionicons
                    name="document-text"
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.documentText} numberOfLines={1}>
                    Document {index + 1}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Emergency Contact */}
      {(emergencyContact || emergencyContactPhone) && (
        <View style={styles.section}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="alert-circle" size={20} color={Colors.error} />
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
          </View>
          <View style={[styles.card, styles.emergencyCard]}>
            {renderInfoRow("person", "Name", emergencyContact)}
            {renderInfoRow("call", "Phone", emergencyContactPhone)}
            {renderInfoRow("heart", "Relation", emergencyContactRelation)}
          </View>
        </View>
      )}

      {/* Important Notice */}
      <View style={styles.notice}>
        <Ionicons name="information-circle" size={20} color={Colors.info} />
        <Text style={styles.noticeText}>
          Your medical information is kept confidential and only shared with
          assigned riders when necessary for your safety.
        </Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

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
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
  },
  title: {
    fontSize: Sizes.fontXXL,
    fontWeight: "700",
    color: Colors.text,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginXS,
    paddingHorizontal: Sizes.paddingM,
    paddingVertical: Sizes.paddingS,
    backgroundColor: Colors.primaryLight + "20",
    borderRadius: Sizes.radiusS,
  },
  editText: {
    fontSize: Sizes.fontM,
    color: Colors.primary,
    fontWeight: "600",
  },
  section: {
    marginTop: Sizes.marginL,
    paddingHorizontal: Sizes.paddingL,
  },
  sectionTitle: {
    fontSize: Sizes.fontL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginM,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginL,
  },
  disabilityInfo: {
    flex: 1,
  },
  disabilityLevel: {
    fontSize: Sizes.fontXL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  disabilityNote: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  diseasesList: {
    gap: Sizes.marginM,
  },
  diseaseItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
  },
  diseaseText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Sizes.paddingXXL,
  },
  emptyText: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    marginTop: Sizes.marginM,
  },
  documentsList: {
    gap: Sizes.marginM,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.paddingM,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusS,
    gap: Sizes.marginM,
  },
  documentText: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "500",
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginS,
    marginBottom: Sizes.marginM,
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: Sizes.marginL,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Sizes.marginM,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: Sizes.fontL,
    color: Colors.text,
    fontWeight: "500",
  },
  notice: {
    flexDirection: "row",
    backgroundColor: Colors.infoLight + "20",
    padding: Sizes.paddingL,
    marginHorizontal: Sizes.marginL,
    marginTop: Sizes.marginXL,
    borderRadius: Sizes.radiusM,
    gap: Sizes.marginM,
  },
  noticeText: {
    flex: 1,
    fontSize: Sizes.fontS,
    color: Colors.info,
    lineHeight: 18,
  },
  bottomPadding: {
    height: Sizes.paddingXXL,
  },
});
