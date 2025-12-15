// components/common/ErrorMessage.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
  style?: ViewStyle;
  variant?: "inline" | "full" | "banner";
  icon?: keyof typeof Ionicons.glyphMap;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryText = "Try Again",
  style,
  variant = "inline",
  icon = "alert-circle",
}) => {
  if (variant === "full") {
    return (
      <View style={[styles.fullContainer, style]}>
        <Ionicons name={icon} size={64} color={Colors.error} />
        <Text style={styles.fullMessage}>{message}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>{retryText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (variant === "banner") {
    return (
      <View style={[styles.bannerContainer, style]}>
        <Ionicons name={icon} size={20} color={Colors.error} />
        <Text style={styles.bannerMessage}>{message}</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.bannerRetry}>
            <Text style={styles.bannerRetryText}>{retryText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Inline variant (default)
  return (
    <View style={[styles.inlineContainer, style]}>
      <Ionicons name={icon} size={16} color={Colors.error} />
      <Text style={styles.inlineMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry}>
          <Text style={styles.inlineRetry}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Network Error Component
export const NetworkError: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => {
  return (
    <ErrorMessage
      message="No internet connection. Please check your network."
      onRetry={onRetry}
      variant="full"
      icon="cloud-offline"
    />
  );
};

// Not Found Component
export const NotFound: React.FC<{
  message?: string;
  onGoBack?: () => void;
}> = ({ message = "Content not found", onGoBack }) => {
  return (
    <ErrorMessage
      message={message}
      onRetry={onGoBack}
      retryText="Go Back"
      variant="full"
      icon="search"
    />
  );
};

const styles = StyleSheet.create({
  // Inline variant
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.errorLight,
    padding: Sizes.paddingM,
    borderRadius: Sizes.radiusS,
    marginVertical: Sizes.marginS,
    gap: Sizes.marginS,
  },
  inlineMessage: {
    flex: 1,
    fontSize: Sizes.fontS,
    color: Colors.error,
  },
  inlineRetry: {
    fontSize: Sizes.fontS,
    color: Colors.error,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Full screen variant
  fullContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Sizes.paddingXXL,
  },
  fullMessage: {
    fontSize: Sizes.fontXL,
    color: Colors.text,
    textAlign: "center",
    marginTop: Sizes.marginXL,
    marginBottom: Sizes.marginXXL,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.paddingXXL,
    paddingVertical: Sizes.paddingL,
    borderRadius: Sizes.radiusM,
  },
  retryButtonText: {
    fontSize: Sizes.fontL,
    color: Colors.textWhite,
    fontWeight: "600",
  },

  // Banner variant
  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.errorLight,
    padding: Sizes.paddingL,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    gap: Sizes.marginM,
  },
  bannerMessage: {
    flex: 1,
    fontSize: Sizes.fontM,
    color: Colors.error,
  },
  bannerRetry: {
    paddingHorizontal: Sizes.paddingM,
  },
  bannerRetryText: {
    fontSize: Sizes.fontM,
    color: Colors.error,
    fontWeight: "600",
  },
});
