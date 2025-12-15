// components/user/EditProfileModal.tsx
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { IUser, UpdateProfileData } from "../../types/user.type";

interface EditProfileModalProps {
  visible: boolean;
  user: IUser | null;
  onClose: () => void;
  onSave: (data: UpdateProfileData) => Promise<void>;
  loading?: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  user,
  onClose,
  onSave,
  loading = false,
}) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (visible && user) {
      setName(user.name || "");
      setErrors({});
    }
  }, [visible, user]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      const data: UpdateProfileData = {
        name: name.trim(),
      };
      try {
        await onSave(data);
        onClose();
      } catch (error) {
        // Error handling is done by parent
      }
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
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <Input
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors({ ...errors, name: "" });
                }}
                error={errors.name}
                icon="person"
                required
              />
            </View>

            {/* Email (Read-only) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.readOnlyInput}>
                <Ionicons name="mail" size={20} color={Colors.textSecondary} />
                <Text style={styles.readOnlyText}>{user.email}</Text>
              </View>
              <Text style={styles.helperText}>
                Email cannot be changed
              </Text>
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
    maxHeight: 400,
  },
  scrollContent: {
    padding: Sizes.paddingL,
  },
  inputGroup: {
    marginBottom: Sizes.marginL,
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
  readOnlyInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusM,
    height: Sizes.inputM,
    paddingHorizontal: Sizes.paddingL,
    gap: Sizes.marginM,
  },
  readOnlyText: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
  },
  helperText: {
    fontSize: Sizes.fontS,
    color: Colors.textSecondary,
    marginTop: Sizes.marginXS,
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

