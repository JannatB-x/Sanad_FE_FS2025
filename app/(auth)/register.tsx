import { register } from "../../api/auth";
import { RegisterStyleSheet } from "../../components/styleSheet";
import colors from "../../data/colors";
import { useMutation } from "@tanstack/react-query";
import { useRouter, type Href } from "expo-router";
import React, { useState, useContext } from "react";
import { setToken } from "../../api/client";
import AuthContext from "../../context/authContext";
import type { AuthResponse } from "../../types/index";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: (userInfo: {
      username: string;
      email: string;
      password: string;
    }) => register(userInfo),
    onSuccess: async (data: AuthResponse) => {
      console.log("Registration successful:", data);

      // Store token if available
      if (data?.token) {
        await setToken(data.token);
        console.log("Token stored after registration");
        // Set authentication state
        setIsAuthenticated(true);
        // Navigate to home page
        router.replace("/(protected)/(home)" as Href);
      } else {
        console.error("No token received from registration response");
        setErrorMessage(
          "Registration failed: No token received. Please try again or contact support."
        );
      }
    },
    onError: (error: any) => {
      console.error("Registration error:", error);

      // Check if it's a network error
      if (error?.isNetworkError || !error?.response) {
        // Use the error message from the API client which has detailed info
        const networkMessage =
          error?.message ||
          "Unable to connect to the server. Please check:\n1. Your internet connection\n2. The backend server is running\n3. The server URL is correct";
        setErrorMessage(networkMessage);
        return;
      }

      const errorData = error?.response?.data;
      const errorMessage =
        (typeof errorData === "string" && errorData) ||
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(errorMessage);
    },
  });

  const handleRegistration = () => {
    setErrorMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (username.length < 3) {
      setErrorMessage("Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    registerMutation({
      username,
      email,
      password,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={registerStyles.header}>
            <View style={registerStyles.logoContainer}>
              <Ionicons name="car" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to get started with Sanad
            </Text>
          </View>

          {errorMessage ? (
            <View style={registerStyles.errorBox}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={colors.danger}
                style={registerStyles.errorIcon}
              />
              <Text style={registerStyles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={registerStyles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.gray}
              style={registerStyles.inputIcon}
            />
            <TextInput
              style={registerStyles.inputWithIcon}
              placeholder="Username"
              placeholderTextColor={colors.gray}
              value={username}
              onChangeText={(text) => {
                setUsername(text.trim());
                if (errorMessage) setErrorMessage("");
              }}
              autoCapitalize="none"
              editable={!isPending}
            />
          </View>

          <View style={registerStyles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.gray}
              style={registerStyles.inputIcon}
            />
            <TextInput
              style={registerStyles.inputWithIcon}
              placeholder="Email"
              placeholderTextColor={colors.gray}
              value={email}
              onChangeText={(text) => {
                setEmail(text.trim());
                if (errorMessage) setErrorMessage("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isPending}
            />
          </View>

          <View style={registerStyles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.gray}
              style={registerStyles.inputIcon}
            />
            <TextInput
              style={registerStyles.inputWithIcon}
              placeholder="Password"
              placeholderTextColor={colors.gray}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              editable={!isPending}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={registerStyles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>

          <View style={registerStyles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.gray}
              style={registerStyles.inputIcon}
            />
            <TextInput
              style={registerStyles.inputWithIcon}
              placeholder="Confirm Password"
              placeholderTextColor={colors.gray}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password"
              editable={!isPending}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={registerStyles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleRegistration}
            style={[
              styles.registerButton,
              isPending && styles.registerButtonDisabled,
            ]}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push("/(auth)/login" as Href)}
            disabled={isPending}
          >
            <Text style={styles.loginLinkText}>
              Already have an account?{" "}
              <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const registerStyles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    color: colors.danger,
    fontSize: 14,
  },
});

const styles = RegisterStyleSheet;
export default RegisterScreen;
