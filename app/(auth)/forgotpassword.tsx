// app/(auth)/forgot-password.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { Ionicons } from "@expo/vector-icons";
import { isValidEmail } from "../../utils/validation";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);

      // TODO: Call API to send password reset email
      // await authAPI.forgotPassword(email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark-circle"
                size={80}
                color={Colors.success}
              />
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <Text style={styles.instructionsText}>
              Click the link in the email to reset your password. The link will
              expire in 24 hours.
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                title="Back to Login"
                onPress={() => router.replace("/(auth)/login")}
                fullWidth
              />

              <Button
                title="Resend Email"
                onPress={() => setSent(false)}
                variant="outline"
                fullWidth
              />
            </View>

            <Text style={styles.helpText}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Button
          title="Back to Login"
          onPress={() => router.back()}
          variant="outline"
          icon="arrow-back"
        />

        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="lock-closed-outline"
            size={64}
            color={Colors.primary}
          />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your email and we'll send you a reset link.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
            error={error}
          />

          <Button
            title="Send Reset Link"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={Colors.info} />
          <Text style={styles.infoText}>
            You'll receive an email with instructions to reset your password.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Sizes.paddingL,
    paddingTop: Sizes.paddingXXL,
  },
  header: {
    alignItems: "center",
    marginTop: Sizes.marginXXL,
    marginBottom: Sizes.marginXXL,
  },
  title: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Sizes.marginL,
    marginBottom: Sizes.marginM,
  },
  subtitle: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    gap: Sizes.marginL,
    marginBottom: Sizes.marginXL,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: Colors.infoLight + "20",
    padding: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
    gap: Sizes.marginM,
  },
  infoText: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.info,
    lineHeight: 20,
  },
  successContainer: {
    alignItems: "center",
    paddingTop: Sizes.paddingXXL,
  },
  successIcon: {
    marginBottom: Sizes.marginXL,
  },
  successTitle: {
    fontSize: Sizes.font3XL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginM,
  },
  successMessage: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Sizes.marginL,
  },
  emailText: {
    fontWeight: "600",
    color: Colors.primary,
  },
  instructionsText: {
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Sizes.marginXXL,
    paddingHorizontal: Sizes.paddingL,
  },
  buttonContainer: {
    width: "100%",
    gap: Sizes.marginM,
    marginBottom: Sizes.marginXL,
  },
  helpText: {
    fontSize: Sizes.fontS,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
});
