// components/user/DisabilityInfoForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import {
  DisabilityLevel,
  DISABILITY_LEVELS,
  DISABILITY_TYPES,
  MOBILITY_AIDS,
  ACCESSIBILITY_NEEDS,
  WHEELCHAIR_TYPES,
  COMMON_MEDICAL_CONDITIONS,
} from "../../constants/Disability";
import { Button } from "../common/Button";

interface DisabilityInfoFormProps {
  initialData?: {
    disabilityLevel?: DisabilityLevel;
    disabilityTypes?: string[];
    mobilityAid?: string;
    accessibilityNeeds?: string[];
    wheelchairType?: string;
    medicalConditions?: string[];
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export const DisabilityInfoForm: React.FC<DisabilityInfoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [disabilityLevel, setDisabilityLevel] = useState<DisabilityLevel>(
    initialData?.disabilityLevel || DisabilityLevel.NONE
  );
  const [disabilityTypes, setDisabilityTypes] = useState<string[]>(
    initialData?.disabilityTypes || []
  );
  const [mobilityAid, setMobilityAid] = useState<string>(
    initialData?.mobilityAid || "None"
  );
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string[]>(
    initialData?.accessibilityNeeds || []
  );
  const [wheelchairType, setWheelchairType] = useState<string | undefined>(
    initialData?.wheelchairType
  );
  const [medicalConditions, setMedicalConditions] = useState<string[]>(
    initialData?.medicalConditions || []
  );

  const toggleSelection = (
    item: string,
    list: string[],
    setter: (list: string[]) => void
  ) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      disabilityLevel,
      disabilityTypes,
      mobilityAid,
      accessibilityNeeds,
      wheelchairType,
      medicalConditions,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Disability Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disability Level *</Text>
        <View style={styles.optionsGrid}>
          {DISABILITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.optionButton,
                disabilityLevel === level.value && styles.optionButtonSelected,
              ]}
              onPress={() => setDisabilityLevel(level.value as DisabilityLevel)}
            >
              <Text
                style={[
                  styles.optionText,
                  disabilityLevel === level.value && styles.optionTextSelected,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Disability Types */}
      {disabilityLevel !== DisabilityLevel.NONE && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disability Type(s)</Text>
          <View style={styles.chipContainer}>
            {DISABILITY_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  disabilityTypes.includes(type) && styles.chipSelected,
                ]}
                onPress={() =>
                  toggleSelection(type, disabilityTypes, setDisabilityTypes)
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    disabilityTypes.includes(type) && styles.chipTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Mobility Aid */}
      {disabilityLevel !== DisabilityLevel.NONE && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mobility Aid</Text>
          <View style={styles.chipContainer}>
            {MOBILITY_AIDS.map((aid) => (
              <TouchableOpacity
                key={aid}
                style={[
                  styles.chip,
                  mobilityAid === aid && styles.chipSelected,
                ]}
                onPress={() => setMobilityAid(aid)}
              >
                <Text
                  style={[
                    styles.chipText,
                    mobilityAid === aid && styles.chipTextSelected,
                  ]}
                >
                  {aid}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Wheelchair Type */}
      {(mobilityAid?.toLowerCase().includes("wheelchair") ||
        mobilityAid?.toLowerCase().includes("scooter")) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wheelchair Type</Text>
          <View style={styles.chipContainer}>
            {WHEELCHAIR_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.chip,
                  wheelchairType === type.value && styles.chipSelected,
                ]}
                onPress={() => setWheelchairType(type.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    wheelchairType === type.value && styles.chipTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Accessibility Needs */}
      {disabilityLevel !== DisabilityLevel.NONE && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility Needs</Text>
          {ACCESSIBILITY_NEEDS.map((need) => (
            <TouchableOpacity
              key={need.id}
              style={styles.checkboxItem}
              onPress={() =>
                toggleSelection(
                  need.id,
                  accessibilityNeeds,
                  setAccessibilityNeeds
                )
              }
            >
              <Ionicons
                name={
                  accessibilityNeeds.includes(need.id)
                    ? "checkbox"
                    : "square-outline"
                }
                size={24}
                color={
                  accessibilityNeeds.includes(need.id)
                    ? Colors.primary
                    : Colors.border
                }
              />
              <Ionicons
                name={need.icon as any}
                size={20}
                color={Colors.textSecondary}
                style={styles.needIcon}
              />
              <Text style={styles.checkboxText}>{need.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Medical Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Conditions (Optional)</Text>
        <View style={styles.chipContainer}>
          {COMMON_MEDICAL_CONDITIONS.map((condition) => (
            <TouchableOpacity
              key={condition}
              style={[
                styles.chip,
                medicalConditions.includes(condition) && styles.chipSelected,
              ]}
              onPress={() =>
                toggleSelection(
                  condition,
                  medicalConditions,
                  setMedicalConditions
                )
              }
            >
              <Text
                style={[
                  styles.chipText,
                  medicalConditions.includes(condition) &&
                    styles.chipTextSelected,
                ]}
              >
                {condition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Button
          title="Save Information"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
        />
        {onCancel && (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            fullWidth
          />
        )}
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
  section: {
    padding: Sizes.paddingL,
    backgroundColor: Colors.card,
    marginBottom: Sizes.marginM,
  },
  sectionTitle: {
    fontSize: Sizes.fontL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginL,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.marginM,
  },
  optionButton: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: Sizes.paddingL,
    paddingHorizontal: Sizes.paddingM,
    borderRadius: Sizes.radiusM,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
    alignItems: "center",
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "20",
  },
  optionText: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primary,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.marginM,
  },
  chip: {
    paddingVertical: Sizes.paddingS,
    paddingHorizontal: Sizes.paddingL,
    borderRadius: Sizes.radiusRound,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "20",
  },
  chipText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Sizes.paddingM,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  needIcon: {
    marginLeft: Sizes.marginM,
    marginRight: Sizes.marginS,
  },
  checkboxText: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.text,
  },
  buttons: {
    padding: Sizes.paddingL,
    gap: Sizes.marginM,
  },
  bottomPadding: {
    height: Sizes.paddingXXL,
  },
});
