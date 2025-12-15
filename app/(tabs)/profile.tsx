// app/(tabs)/profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { ProfileHeader } from "../../components/user/ProfileHeader";
import { EditProfileModal } from "../../components/user/EditProfileModal";
import { PaymentMethodsModal } from "../../components/user/PaymentMethodsModal";
import { MedicalInfoModal } from "../../components/user/MedicalInfoModal";
import { SettingsModal } from "../../components/user/SettingsModal";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { UpdateProfileData, MedicalInfo } from "../../types/user.type";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleSaveProfile = async (data: UpdateProfileData) => {
    try {
      setUpdating(true);
      // Update user in auth context
      if (user) {
        const updatedUser = { ...user, ...data };
        updateUser(updatedUser);
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveMedicalInfo = async (data: MedicalInfo) => {
    try {
      setUpdating(true);
      // Update user in auth context
      if (user) {
        const updatedUser = {
          ...user,
          diseases: data.diseases,
          disabilityLevel: data.disabilityLevel,
          statusDocuments: data.statusDocuments,
        };
        updateUser(updatedUser);
        Alert.alert("Success", "Medical information updated successfully");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update medical information");
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveSettings = () => {
    Alert.alert("Success", "Settings saved successfully");
  };

  const menuItems = [
    {
      icon: "settings-outline",
      title: "Settings",
      onPress: () => setShowSettingsModal(true),
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      onPress: () => router.push("/help"),
    },
  ];

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container}>
        <ProfileHeader
          user={user}
          onEditPress={() => setShowEditModal(true)}
          onImagePress={() => {
            // Handle image upload
            Alert.alert("Change Photo", "Photo upload coming soon!");
          }}
        />

        {/* Medical Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            <TouchableOpacity
              onPress={() => setShowMedicalModal(true)}
              style={styles.editIconButton}
            >
              <Ionicons name="create-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoCard}>
            {user.diseases && user.diseases.length > 0 ? (
              <View style={styles.medicalList}>
                {user.diseases.map((disease, index) => (
                  <View key={index} style={styles.medicalItem}>
                    <Ionicons name="medical" size={18} color={Colors.medical} />
                    <Text style={styles.medicalText}>{disease}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No medical conditions added</Text>
            )}
            {user.disabilityLevel && user.disabilityLevel !== "none" ? (
              <View style={styles.disabilityItem}>
                <Ionicons
                  name="accessibility"
                  size={18}
                  color={Colors.wheelchair}
                />
                <Text style={styles.disabilityText}>
                  Disability Level: {user.disabilityLevel}
                </Text>
              </View>
            ) : (
              <View style={styles.disabilityItem}>
                <Ionicons
                  name="accessibility-outline"
                  size={18}
                  color={Colors.textLight}
                />
                <Text style={styles.emptyText}>No disability information</Text>
              </View>
            )}
          </View>
        </View>

        {/* Emergency Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.infoCard}>
            {user.emergencyContact ? (
              <View>
                <View style={styles.contactRow}>
                  <Ionicons name="person" size={18} color={Colors.primary} />
                  <Text style={styles.contactLabel}>Name:</Text>
                  <Text style={styles.contactValue}>{user.emergencyContact}</Text>
                </View>
                {user.emergencyContactPhone && (
                  <View style={styles.contactRow}>
                    <Ionicons name="call" size={18} color={Colors.primary} />
                    <Text style={styles.contactLabel}>Phone:</Text>
                    <Text style={styles.contactValue}>
                      {user.emergencyContactPhone}
                    </Text>
                  </View>
                )}
                {user.emergencyContactRelation && (
                  <View style={styles.contactRow}>
                    <Ionicons name="people" size={18} color={Colors.primary} />
                    <Text style={styles.contactLabel}>Relation:</Text>
                    <Text style={styles.contactValue}>
                      {user.emergencyContactRelation}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.emptyText}>No emergency contact added</Text>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          ))}

          {/* Payment Methods */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowPaymentModal(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="card-outline" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditModal}
        user={user}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        loading={updating}
      />

      {/* Payment Methods Modal */}
      <PaymentMethodsModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onAddMethod={() => {
          Alert.alert("Add Payment Method", "Payment method addition coming soon!");
        }}
      />

      {/* Medical Information Modal */}
      <MedicalInfoModal
        visible={showMedicalModal}
        user={user}
        onClose={() => setShowMedicalModal(false)}
        onSave={handleSaveMedicalInfo}
        loading={updating}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={handleSaveSettings}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    marginTop: Sizes.marginL,
    marginHorizontal: Sizes.marginL,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.marginM,
  },
  editIconButton: {
    padding: Sizes.paddingXS,
  },
  sectionTitle: {
    fontSize: Sizes.fontL,
    fontWeight: "700",
    color: Colors.text,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    padding: Sizes.paddingL,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  medicalList: {
    gap: Sizes.marginM,
  },
  medicalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
  },
  medicalText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    flex: 1,
  },
  disabilityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
    marginTop: Sizes.marginM,
    paddingTop: Sizes.marginM,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  disabilityText: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    flex: 1,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginM,
    marginBottom: Sizes.marginM,
  },
  contactLabel: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    fontWeight: "500",
    minWidth: 60,
  },
  contactValue: {
    fontSize: Sizes.fontM,
    color: Colors.text,
    fontWeight: "600",
    flex: 1,
  },
  emptyText: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  menu: {
    marginTop: Sizes.marginL,
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusM,
    marginHorizontal: Sizes.marginL,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Sizes.paddingL,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Sizes.marginM,
  },
  menuItemText: {
    fontSize: Sizes.fontL,
    color: Colors.text,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.paddingL,
    gap: Sizes.marginM,
  },
  logoutText: {
    fontSize: Sizes.fontL,
    color: Colors.error,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    color: Colors.textLight,
    fontSize: Sizes.fontS,
    marginTop: Sizes.marginXXL,
    marginBottom: Sizes.marginXXL,
  },
});
