// components/user/MedicalInfoModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { IUser, DisabilityLevel, MedicalInfo } from "../../types/user.type";

interface MedicalInfoModalProps {
  visible: boolean;
  user: IUser | null;
  onClose: () => void;
  onSave: (data: MedicalInfo) => Promise<void>;
  loading?: boolean;
}

// Most common 10 diseases
const COMMON_DISEASES = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Epilepsy",
  "Chronic Pain",
  "Vision Impairment",
  "Hearing Impairment",
  "Mobility Issues",
];

export const MedicalInfoModal: React.FC<MedicalInfoModalProps> = ({
  visible,
  user,
  onClose,
  onSave,
  loading = false,
}) => {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [otherDisease, setOtherDisease] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [disabilityLevel, setDisabilityLevel] = useState<DisabilityLevel>(
    DisabilityLevel.NONE
  );
  const [weaknesses, setWeaknesses] = useState("");
  const [deviceAid, setDeviceAid] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (visible && user) {
      // Initialize with user's current data
      setSelectedDiseases(user.diseases || []);
      setDisabilityLevel(user.disabilityLevel || DisabilityLevel.NONE);
      setWeaknesses("");
      setDeviceAid("");
      setOtherDisease("");
      setShowOtherInput(false);
      setErrors({});
    }
  }, [visible, user]);

  const toggleDisease = (disease: string) => {
    if (disease === "Other") {
      setShowOtherInput(!showOtherInput);
      if (!showOtherInput) {
        setSelectedDiseases([...selectedDiseases, "Other"]);
      } else {
        setSelectedDiseases(
          selectedDiseases.filter((d) => d !== "Other" && d !== otherDisease)
        );
        setOtherDisease("");
      }
    } else {
      if (selectedDiseases.includes(disease)) {
        setSelectedDiseases(selectedDiseases.filter((d) => d !== disease));
      } else {
        setSelectedDiseases([...selectedDiseases, disease]);
      }
    }
  };

  const handleSave = async () => {
    const newErrors: { [key: string]: string } = {};

    // Validate other disease if "Other" is selected
    if (selectedDiseases.includes("Other") && !otherDisease.trim()) {
      newErrors.otherDisease = "Please specify the other disease";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Prepare diseases array
    const diseases = selectedDiseases
      .filter((d) => d !== "Other")
      .concat(showOtherInput && otherDisease.trim() ? [otherDisease.trim()] : []);

    const data: MedicalInfo = {
      diseases,
      disabilityLevel,
      statusDocuments: user?.statusDocuments || [],
    };

    // Add weaknesses and device aid as additional fields if needed
    // Note: These might need to be stored separately or in a notes field
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      // Error handling is done by parent
    }
  };

  if (!user) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Medical Information</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Diseases Section */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Medical Conditions <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.helperText}>
                Select all that apply
              </Text>
              <View style={styles.diseasesGrid}>
                {COMMON_DISEASES.map((disease) => (
                  <TouchableOpacity
                    key={disease}
                    style={[
                      styles.diseaseChip,
                      selectedDiseases.includes(disease) &&
                        styles.diseaseChipSelected,
                    ]}
                    onPress={() => toggleDisease(disease)}
                  >
                    <Text
                      style={[
                        styles.diseaseChipText,
                        selectedDiseases.includes(disease) &&
                          styles.diseaseChipTextSelected,
                      ]}
                    >
                      {disease}
                    </Text>
                    {selectedDiseases.includes(disease) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={Colors.textWhite}
                      />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.diseaseChip,
                    selectedDiseases.includes("Other") &&
                      styles.diseaseChipSelected,
                  ]}
                  onPress={() => toggleDisease("Other")}
                >
                  <Text
                    style={[
                      styles.diseaseChipText,
                      selectedDiseases.includes("Other") &&
                        styles.diseaseChipTextSelected,
                    ]}
                  >
                    Other
                  </Text>
                  {selectedDiseases.includes("Other") && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={Colors.textWhite}
                    />
                  )}
                </TouchableOpacity>
              </View>

              {/* Other Disease Input */}
              {showOtherInput && (
                <View style={styles.otherInputContainer}>
                  <Input
                    placeholder="Specify other medical condition"
                    value={otherDisease}
                    onChangeText={(text) => {
                      setOtherDisease(text);
                      setErrors({ ...errors, otherDisease: "" });
                    }}
                    error={errors.otherDisease}
                    icon="medical"
                  />
                </View>
              )}
            </View>

            {/* Disability Level Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Disability Level</Text>
              <View style={styles.radioGroup}>
                {Object.values(DisabilityLevel).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={styles.radioOption}
                    onPress={() => setDisabilityLevel(level)}
                  >
                    <View style={styles.radioCircle}>
                      {disabilityLevel === level && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Weaknesses Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Weaknesses</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe any physical or cognitive weaknesses..."
                  placeholderTextColor={Colors.textLight}
                  value={weaknesses}
                  onChangeText={setWeaknesses}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Device Aid Required Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Device Aid Required</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="List any assistive devices or aids needed (e.g., wheelchair, walker, hearing aid)..."
                  placeholderTextColor={Colors.textLight}
                  value={deviceAid}
                  onChangeText={setDeviceAid}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              fullWidth
            />
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              fullWidth
              style={styles.cancelButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  section: {
    marginBottom: Sizes.marginXL,
  },
  label: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Sizes.marginS,
  },
  required: {
    color: Colors.error,
  },
  helperText: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    marginBottom: Sizes.marginM,
  },
  diseasesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.marginS,
  },
  diseaseChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Sizes.paddingM,
    paddingVertical: Sizes.paddingS,
    borderRadius: Sizes.radiusRound,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
    gap: Sizes.marginXS,
  },
  diseaseChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  diseaseChipText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "500",
  },
  diseaseChipTextSelected: {
    color: Colors.textWhite,
  },
  otherInputContainer: {
    marginTop: Sizes.marginM,
  },
  radioGroup: {
    gap: Sizes.marginM,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "500",
  },
  textAreaContainer: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusM,
    minHeight: 100,
    paddingHorizontal: Sizes.paddingL,
    paddingVertical: Sizes.paddingM,
  },
  textArea: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.text,
    paddingVertical: 0,
  },
  buttons: {
    padding: Sizes.paddingL,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Sizes.marginM,
  },
  cancelButton: {
    marginTop: 0,
  },
});

