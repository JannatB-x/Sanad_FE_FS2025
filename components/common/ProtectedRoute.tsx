// components/common/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { UserType } from "../../types/user.type";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserType[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo,
}) => {
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated - redirect to login
        router.replace("/(auth)/login");
      } else if (user && !hasAnyRole(allowedRoles)) {
        // Authenticated but wrong role - redirect to appropriate dashboard
        if (redirectTo) {
          router.replace(redirectTo);
        } else {
          // Default redirect based on user type
          switch (user.userType) {
            case UserType.USER:
              router.replace("/(tabs)");
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
              router.replace("/(auth)/login");
          }
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, hasAnyRole, redirectTo, router]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Redirecting to login...</Text>
      </View>
    );
  }

  if (user && !hasAnyRole(allowedRoles)) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Unauthorized. Redirecting...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: Sizes.marginL,
    fontSize: Sizes.fontL,
    color: Colors.textSecondary,
  },
});

