// utils/navigation.ts
import { router } from "expo-router";
import { authAPI } from "../api/auth.api";

export const navigateAfterLogin = async () => {
  const userType = await authAPI.getUserType();

  switch (userType) {
    case "user":
      router.replace("/(tabs)"); // Passenger home
      break;
    case "rider":
      router.replace("/(rider)/dashboard"); // Driver dashboard
      break;
    case "company":
      router.replace("/(company)/dashboard"); // Company dashboard
      break;
    case "admin":
      router.replace("/(admin)/dashboard"); // Admin dashboard
      break;
    default:
      router.replace("/login");
  }
};

export const navigateToLogin = () => {
  router.replace("/login");
};
