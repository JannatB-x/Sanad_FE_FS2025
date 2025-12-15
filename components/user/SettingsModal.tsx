// components/user/SettingsModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { Config } from "../../constants/Config";
import { useSettings } from "../../context/Settings.context";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const LANGUAGES = Config.SUPPORTED_LANGUAGES || [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

const FONT_SIZES = [
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
  { value: "extra-large", label: "Extra Large" },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { settings, updateSettings } = useSettings();
  const [language, setLanguage] = useState(settings.language);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "extra-large">(settings.fontSize);
  const [speech, setSpeech] = useState(settings.speech);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      // Load current settings
      setLanguage(settings.language);
      setFontSize(settings.fontSize);
      setSpeech(settings.speech);
    }
  }, [visible, settings]);

  const handleSave = async () => {
    try {
      await updateSettings({
        language,
        fontSize,
        speech,
      });
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
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
            <Text style={styles.headerTitle}>Settings</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Language Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Language</Text>
              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => setShowLanguagePicker(!showLanguagePicker)}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="language" size={20} color={Colors.primary} />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>App Language</Text>
                    <Text style={styles.settingValue}>
                      {LANGUAGES.find((l) => l.code === language)?.nativeName ||
                        "English"}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={showLanguagePicker ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>

              {/* Language Picker */}
              {showLanguagePicker && (
                <View style={styles.pickerContainer}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.pickerOption,
                        language === lang.code && styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        setLanguage(lang.code);
                        setShowLanguagePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          language === lang.code &&
                            styles.pickerOptionTextSelected,
                        ]}
                      >
                        {lang.nativeName}
                      </Text>
                      {language === lang.code && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={Colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Accessibility Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accessibility</Text>

              {/* Font Size */}
              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => setShowFontSizePicker(!showFontSizePicker)}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="text" size={20} color={Colors.primary} />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Font Size</Text>
                    <Text style={styles.settingValue}>
                      {
                        FONT_SIZES.find((f) => f.value === fontSize)?.label ||
                          "Normal"
                      }
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={showFontSizePicker ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>

              {/* Font Size Picker */}
              {showFontSizePicker && (
                <View style={styles.pickerContainer}>
                  {FONT_SIZES.map((size) => (
                    <TouchableOpacity
                      key={size.value}
                      style={[
                        styles.pickerOption,
                        fontSize === size.value && styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        setFontSize(
                          size.value as "normal" | "large" | "extra-large"
                        );
                        setShowFontSizePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          fontSize === size.value &&
                            styles.pickerOptionTextSelected,
                        ]}
                      >
                        {size.label}
                      </Text>
                      {fontSize === size.value && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={Colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Speech Toggle */}
              <View style={styles.settingButton}>
                <View style={styles.settingLeft}>
                  <Ionicons name="volume-high" size={20} color={Colors.primary} />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Speech</Text>
                    <Text style={styles.settingDescription}>
                      Enable text-to-speech for buttons and text
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={speech ? Colors.primary : Colors.backgroundLight}
                  ios_backgroundColor={Colors.border}
                  onValueChange={setSpeech}
                  value={speech}
                />
              </View>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Button title="Save" onPress={handleSave} fullWidth />
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              fullWidth
              style={styles.cancelButton}
            />
          </View>
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
  section: {
    marginBottom: Sizes.marginXL,
  },
  sectionTitle: {
    fontSize: Sizes.fontL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginM,
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundLight,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingM,
    marginBottom: Sizes.marginS,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingInfo: {
    marginLeft: Sizes.marginM,
    flex: 1,
  },
  settingLabel: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  settingDescription: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
  },
  pickerContainer: {
    marginTop: Sizes.marginS,
    backgroundColor: Colors.backgroundLight,
    borderRadius: Sizes.radiusM,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Sizes.paddingM,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.primaryLight + "10",
  },
  pickerOptionText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
  },
  pickerOptionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
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

