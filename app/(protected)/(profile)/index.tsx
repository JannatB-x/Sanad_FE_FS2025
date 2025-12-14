import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import {
  getMyProfile,
  updateProfile,
  logout,
  type UserProfile,
} from "../../../api/profile";
import AuthContext from "../../../context/authContext";
import { useContext } from "react";
import colors from "../../../data/colors";

const ProfileScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    retry: 1,
  });

  // Form state
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      // Use /users/me endpoint (no userId needed)
      return updateProfile("", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowEditModal(false);
      setEditingSection(null);
      setFormData({});
      Alert.alert("Success", "Profile updated successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile"
      );
    },
  });

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setFormData({});
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (!editingSection) return;
    updateMutation.mutate(formData);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear all query cache first
            queryClient.clear();

            // logout() already calls removeToken() internally
            await logout();

            // Set authentication state to false
            setIsAuthenticated(false);

            // Navigate to login screen immediately
            router.replace("/(auth)/login" as Href);
          } catch (error) {
            console.error("Logout error:", error);
            // Even if logout fails, clear state and navigate
            try {
              queryClient.clear();
              setIsAuthenticated(false);
              router.replace("/(auth)/login" as Href);
            } catch (fallbackError) {
              console.error("Fallback logout error:", fallbackError);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        },
      },
    ]);
  };

  const updateField = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show profile with placeholders even if there's an error or no data
  const displayProfile = profile || {
    Id: "",
    Name: "",
    Role: "",
    Email: "",
    Identification: "",
    Password: "",
    MedicalHistory: "",
    Disabilities: "",
    FunctionalNeeds: "",
    Location: "",
    Bookings: [],
    EmergencyContact: "",
    EmergencyContactPhone: "",
    EmergencyContactRelationship: "",
    SavedServices: [],
    SavedTransporters: [],
    SavedLocations: [],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <Text style={styles.errorBannerText}>
              {error instanceof Error
                ? error.message
                : "Unable to load profile data"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                queryClient.invalidateQueries({ queryKey: ["profile"] })
              }
            >
              <Ionicons name="refresh" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
          <Text style={styles.profileName}>
            {displayProfile.Name || "Enter your name"}
          </Text>
          <Text style={styles.profileRole}>
            {displayProfile.Role || "User"}
          </Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              onPress={() => handleEdit("personal")}
              style={styles.editButton}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoCard}>
            <InfoRow
              label="Name"
              value={displayProfile.Name || "Enter your name"}
              icon="person-outline"
            />
            <InfoRow
              label="Email"
              value={displayProfile.Email || "Enter your email"}
              icon="mail-outline"
            />
            <InfoRow
              label="Role"
              value={displayProfile.Role || "User"}
              icon="briefcase-outline"
            />
            <InfoRow
              label="Identification"
              value={displayProfile.Identification || "Enter identification"}
              icon="card-outline"
            />
            <InfoRow
              label="Location"
              value={displayProfile.Location || "Enter your location"}
              icon="location-outline"
            />
          </View>
        </View>

        {/* Medical Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            <TouchableOpacity
              onPress={() => handleEdit("medical")}
              style={styles.editButton}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoCard}>
            <InfoRow
              label="Medical History"
              value={
                displayProfile.MedicalHistory || "Enter your medical history"
              }
              icon="medical-outline"
              multiline
            />
            <InfoRow
              label="Disabilities"
              value={displayProfile.Disabilities || "Enter any disabilities"}
              icon="accessibility-outline"
              multiline
            />
            <InfoRow
              label="Functional Needs"
              value={
                displayProfile.FunctionalNeeds || "Enter your functional needs"
              }
              icon="heart-outline"
              multiline
            />
          </View>
        </View>

        {/* Emergency Contact Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <TouchableOpacity
              onPress={() => handleEdit("emergency")}
              style={styles.editButton}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoCard}>
            <InfoRow
              label="Contact Name"
              value={
                displayProfile.EmergencyContact ||
                "Enter emergency contact name"
              }
              icon="person-circle-outline"
            />
            <InfoRow
              label="Phone"
              value={
                displayProfile.EmergencyContactPhone || "Enter phone number"
              }
              icon="call-outline"
            />
            <InfoRow
              label="Relationship"
              value={
                displayProfile.EmergencyContactRelationship ||
                "Enter relationship"
              }
              icon="people-outline"
            />
          </View>
        </View>

        {/* Saved Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Items</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="calendar"
              label="Bookings"
              count={displayProfile.Bookings?.length || 0}
            />
            <StatCard
              icon="build"
              label="Services"
              count={displayProfile.SavedServices?.length || 0}
            />
            <StatCard
              icon="car"
              label="Transporters"
              count={displayProfile.SavedTransporters?.length || 0}
            />
            <StatCard
              icon="location"
              label="Locations"
              count={displayProfile.SavedLocations?.length || 0}
            />
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButtonFull}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.white} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {editingSection === "personal" && "Personal Information"}
                {editingSection === "medical" && "Medical Information"}
                {editingSection === "emergency" && "Emergency Contact"}
              </Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {editingSection === "personal" && (
                <>
                  <InputField
                    label="Name"
                    value={formData.Name ?? displayProfile.Name ?? ""}
                    onChangeText={(value) => updateField("Name", value)}
                    icon="person-outline"
                  />
                  <InputField
                    label="Email"
                    value={formData.Email ?? displayProfile.Email ?? ""}
                    onChangeText={(value) => updateField("Email", value)}
                    icon="mail-outline"
                    keyboardType="email-address"
                  />
                  <InputField
                    label="Identification"
                    value={
                      formData.Identification ??
                      displayProfile.Identification ??
                      ""
                    }
                    onChangeText={(value) =>
                      updateField("Identification", value)
                    }
                    icon="card-outline"
                  />
                  <InputField
                    label="Location"
                    value={formData.Location ?? displayProfile.Location ?? ""}
                    onChangeText={(value) => updateField("Location", value)}
                    icon="location-outline"
                  />
                </>
              )}

              {editingSection === "medical" && (
                <>
                  <InputField
                    label="Medical History"
                    value={
                      formData.MedicalHistory ??
                      displayProfile.MedicalHistory ??
                      ""
                    }
                    onChangeText={(value) =>
                      updateField("MedicalHistory", value)
                    }
                    icon="medical-outline"
                    multiline
                  />
                  <InputField
                    label="Disabilities"
                    value={
                      formData.Disabilities ?? displayProfile.Disabilities ?? ""
                    }
                    onChangeText={(value) => updateField("Disabilities", value)}
                    icon="accessibility-outline"
                    multiline
                  />
                  <InputField
                    label="Functional Needs"
                    value={
                      formData.FunctionalNeeds ??
                      displayProfile.FunctionalNeeds ??
                      ""
                    }
                    onChangeText={(value) =>
                      updateField("FunctionalNeeds", value)
                    }
                    icon="heart-outline"
                    multiline
                  />
                </>
              )}

              {editingSection === "emergency" && (
                <>
                  <InputField
                    label="Contact Name"
                    value={
                      formData.EmergencyContact ??
                      displayProfile.EmergencyContact ??
                      ""
                    }
                    onChangeText={(value) =>
                      updateField("EmergencyContact", value)
                    }
                    icon="person-circle-outline"
                  />
                  <InputField
                    label="Phone"
                    value={
                      formData.EmergencyContactPhone ??
                      displayProfile.EmergencyContactPhone ??
                      ""
                    }
                    onChangeText={(value) =>
                      updateField("EmergencyContactPhone", value)
                    }
                    icon="call-outline"
                    keyboardType="phone-pad"
                  />
                  <InputField
                    label="Relationship"
                    value={
                      formData.EmergencyContactRelationship ??
                      displayProfile.EmergencyContactRelationship ??
                      ""
                    }
                    onChangeText={(value) =>
                      updateField("EmergencyContactRelationship", value)
                    }
                    icon="people-outline"
                  />
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  updateMutation.isPending && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.saveButtonText}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Info Row Component
const InfoRow = ({
  label,
  value,
  icon,
  multiline = false,
}: {
  label: string;
  value: string;
  icon: string;
  multiline?: boolean;
}) => (
  <View style={styles.infoRow}>
    <Ionicons
      name={icon as any}
      size={20}
      color={colors.primary}
      style={styles.infoIcon}
    />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, multiline && styles.infoValueMultiline]}>
        {value}
      </Text>
    </View>
  </View>
);

// Stat Card Component
const StatCard = ({
  icon,
  label,
  count,
}: {
  icon: string;
  label: string;
  count: number;
}) => (
  <View style={styles.statCard}>
    <Ionicons name={icon as any} size={24} color={colors.primary} />
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Input Field Component
const InputField = ({
  label,
  value,
  onChangeText,
  icon,
  keyboardType,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  keyboardType?: any;
  multiline?: boolean;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWithIcon}>
      <Ionicons
        name={icon as any}
        size={20}
        color={colors.primary}
        style={styles.inputIcon}
      />
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.gray}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark,
  },
  logoutButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: colors.gray,
    textTransform: "capitalize",
  },
  section: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark,
  },
  editButton: {
    padding: 4,
  },
  infoCard: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.gray,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    color: colors.dark,
    lineHeight: 22,
  },
  infoValueMultiline: {
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    margin: 16,
    marginBottom: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    color: colors.danger,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark,
  },
  modalScroll: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  inputIcon: {
    marginRight: 4,
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
    padding: 0,
    minHeight: 20,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  logoutSection: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  logoutButtonFull: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export default ProfileScreen;
