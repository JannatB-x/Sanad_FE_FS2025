// constants/Colors.ts

export const Colors = {
  // Primary colors
  primary: "#0066FF",
  primaryDark: "#0052CC",
  primaryLight: "#3385FF",

  secondary: "#00D9FF",
  secondaryDark: "#00B8D9",
  secondaryLight: "#33E0FF",

  accent: "#FF6B6B",
  accentDark: "#FF5252",
  accentLight: "#FF8A8A",

  // Kuwait theme colors
  kuwaitGreen: "#007A3D",
  kuwaitRed: "#CE1126",
  kuwaitBlack: "#000000",
  kuwaitWhite: "#FFFFFF",
  kuwaitGold: "#FFD700",

  // Background colors
  background: "#F5F5F5",
  backgroundLight: "#FFFFFF",
  backgroundDark: "#E0E0E0",
  card: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.5)",

  // Text colors
  text: "#333333",
  textSecondary: "#666666",
  textLight: "#999999",
  textDisabled: "#CCCCCC",
  textWhite: "#FFFFFF",

  // Border colors
  border: "#E0E0E0",
  borderLight: "#F0F0F0",
  borderDark: "#CCCCCC",

  // Status colors
  success: "#4CAF50",
  successLight: "#81C784",
  successDark: "#388E3C",

  warning: "#FF9800",
  warningLight: "#FFB74D",
  warningDark: "#F57C00",

  error: "#F44336",
  errorLight: "#E57373",
  errorDark: "#D32F2F",

  info: "#2196F3",
  infoLight: "#64B5F6",
  infoDark: "#1976D2",

  // Ride status colors
  requested: "#FF9800",
  accepted: "#2196F3",
  inProgress: "#9C27B0",
  completed: "#4CAF50",
  cancelled: "#F44336",

  // Appointment status colors
  pending: "#FF9800",
  confirmed: "#4CAF50",

  // Disability/Medical colors
  medical: "#E91E63",
  wheelchair: "#3F51B5",
  patientBed: "#9C27B0",

  // Map colors
  mapRoute: "#0066FF",
  mapMarkerPickup: "#4CAF50",
  mapMarkerDropoff: "#F44336",
  mapRiderLocation: "#2196F3",

  // Shadow
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.3)",
};

// Color utilities
export const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    requested: Colors.requested,
    accepted: Colors.accepted,
    "in-progress": Colors.inProgress,
    completed: Colors.completed,
    cancelled: Colors.cancelled,
    pending: Colors.pending,
    confirmed: Colors.confirmed,
  };

  return statusColors[status.toLowerCase()] || Colors.textSecondary;
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return Colors.success;
  if (rating >= 3.5) return Colors.info;
  if (rating >= 2.5) return Colors.warning;
  return Colors.error;
};
