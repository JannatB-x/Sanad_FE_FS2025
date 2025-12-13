import { login } from "../../api/auth";
import { getToken, storeToken } from "../../api/storage";
import AuthContext from "../../context/authContext";
import { useMutation } from "@tanstack/react-query";
import { useRouter, type Href } from "expo-router";
import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../data/colors";
import baseStyles from "../../components/styleSheet";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login({ Email: email, Password: password }),
    onSuccess: async (data) => {
      if (data?.token) {
        await storeToken(data.token);
        console.log("Login successful - Token stored");

        // Verify token was stored
        const storedToken = await getToken();
        if (storedToken) {
          console.log("Token verified in storage");
        } else {
          console.error("Token storage verification failed");
        }
      } else {
        console.error("No token received from login response");
      }
      setIsAuthenticated(true);
      router.replace("/(protected)/(home)" as Href);
    },
    onError: (error: any) => {
      // Check if it's a network error
      if (error?.isNetworkError || !error?.response) {
        setErrorMessage(
          "Unable to connect to the server. Please check your internet connection and ensure the server is running."
        );
        return;
      }

      const errorData = error?.response?.data;
      const message =
        errorData?.message ||
        errorData?.error ||
        (typeof errorData === "string" ? errorData : null) ||
        "Invalid credentials. Please try again.";
      setErrorMessage(message);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage("Please enter email and password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setErrorMessage("");
    mutate();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={baseStyles.container}
    >
      <ScrollView
        contentContainerStyle={baseStyles.innerContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={baseStyles.header}>
          <View style={loginStyles.logoContainer}>
            <Ionicons name="car" size={48} color={colors.primary} />
          </View>
          <Text style={baseStyles.headerTitle}>Sanad</Text>
          <Text style={loginStyles.subtitle}>
            Your transportation companion
          </Text>
        </View>

        <View style={baseStyles.formWrapper}>
          <Text style={baseStyles.title}>Welcome Back</Text>
          <Text style={loginStyles.description}>
            Sign in to continue to your account
          </Text>

          {errorMessage ? (
            <View style={baseStyles.errorBox}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={colors.danger}
                style={loginStyles.errorIcon}
              />
              <Text style={baseStyles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={loginStyles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.gray}
              style={loginStyles.inputIcon}
            />
            <TextInput
              style={loginStyles.inputWithIcon}
              placeholder="Email"
              placeholderTextColor={colors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isPending}
              value={email}
              onChangeText={(text) => {
                setEmail(text.trim());
                if (errorMessage) setErrorMessage("");
              }}
            />
          </View>

          <View style={loginStyles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.gray}
              style={loginStyles.inputIcon}
            />
            <TextInput
              style={loginStyles.inputWithIcon}
              placeholder="Password"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              editable={!isPending}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={loginStyles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[baseStyles.button, isPending && loginStyles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={baseStyles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={baseStyles.footerRow}>
            <Text style={baseStyles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register" as Href)}
              disabled={isPending}
            >
              <Text style={baseStyles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const loginStyles = StyleSheet.create({
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 24,
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
  errorIcon: {
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default Login;
