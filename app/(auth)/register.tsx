// app/(auth)/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { useAuth } from "../../hooks/useAuth";
import { UserType } from "../../types/user.type";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<UserType>(UserType.USER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // Clear previous errors
    setError("");

    // Basic validation
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, userType);

      // Route to appropriate home page based on user type
      // This happens immediately after successful registration
      switch (userType) {
        case UserType.USER:
          router.replace("/(tabs)/");
          break;
        case UserType.RIDER:
          router.replace("/(rider)/dashboard");
          break;
        case UserType.COMPANY:
          router.replace("/(company)/dashboard");
          break;
        case UserType.ADMIN:
          router.replace("/(admin)/dashboard");
          break;
        default:
          router.replace("/(tabs)/");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Sanad today</Text>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            icon="person"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed"
          />

          {/* User Type Selection */}
          <View style={styles.userTypeSection}>
            <Text style={styles.userTypeLabel}>I am a:</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === UserType.USER && styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType(UserType.USER)}
              >
                <Text
                  style={[
                    styles.userTypeButtonText,
                    userType === UserType.USER &&
                      styles.userTypeButtonTextActive,
                  ]}
                >
                  Passenger
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === UserType.RIDER && styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType(UserType.RIDER)}
              >
                <Text
                  style={[
                    styles.userTypeButtonText,
                    userType === UserType.RIDER &&
                      styles.userTypeButtonTextActive,
                  ]}
                >
                  Driver
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
          />

          <Button
            title="Back to Login"
            onPress={() => router.back()}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
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
  content: {
    padding: Sizes.paddingL,
  },
  title: {
    fontSize: Sizes.font4XL,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Sizes.marginXXL,
    marginBottom: Sizes.marginM,
  },
  subtitle: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
    marginBottom: Sizes.marginXXL,
  },
  form: {
    gap: Sizes.marginL,
  },
  userTypeSection: {
    marginVertical: Sizes.marginM,
  },
  userTypeLabel: {
    fontSize: Sizes.fontM,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Sizes.marginM,
  },
  userTypeButtons: {
    flexDirection: "row",
    gap: Sizes.marginM,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
    alignItems: "center",
  },
  userTypeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "20",
  },
  userTypeButtonText: {
    fontSize: Sizes.fontL,
    fontWeight: "600",
    color: Colors.text,
  },
  userTypeButtonTextActive: {
    color: Colors.primary,
  },
  error: {
    color: Colors.error,
    fontSize: Sizes.fontM,
    textAlign: "center",
  },
});
