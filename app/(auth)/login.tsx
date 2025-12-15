// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      // Navigation handled by index.tsx
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Sanad</Text>
          <Text style={styles.subtitle}>Medical Transportation in Kuwait</Text>
        </View>

        <View style={styles.form}>
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

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            fullWidth
          />

          <Button
            title="Create Account"
            onPress={() => router.push("/(auth)/register")}
            variant="outline"
            fullWidth
          />
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
    justifyContent: "center",
    padding: Sizes.paddingL,
  },
  header: {
    alignItems: "center",
    marginBottom: Sizes.marginXXL,
  },
  title: {
    fontSize: Sizes.font4XL,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.marginM,
  },
  subtitle: {
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
  },
  form: {
    gap: Sizes.marginL,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -Sizes.marginM,
  },
  forgotPasswordText: {
    fontSize: Sizes.fontM,
    color: Colors.primary,
    fontWeight: "600",
  },
  error: {
    color: Colors.error,
    fontSize: Sizes.fontM,
    textAlign: "center",
  },
});
