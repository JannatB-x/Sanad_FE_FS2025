// components/common/Loading.tsx
import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  ViewStyle,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface LoadingProps {
  visible?: boolean;
  message?: string;
  overlay?: boolean;
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  visible = true,
  message,
  overlay = false,
  size = "large",
  color = Colors.primary,
  style,
}) => {
  if (!visible) return null;

  const content = (
    <View style={[styles.container, !overlay && styles.inline, style]}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        {content}
      </Modal>
    );
  }

  return content;
};

// Full screen loading
export const FullScreenLoading: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return <Loading visible overlay message={message} />;
};

// Inline loading (for sections)
export const InlineLoading: React.FC<{
  message?: string;
  size?: "small" | "large";
}> = ({ message, size = "small" }) => {
  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size={size} color={Colors.primary} />
      {message && <Text style={styles.inlineMessage}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.overlay,
  },
  inline: {
    backgroundColor: "transparent",
    padding: Sizes.paddingXL,
  },
  content: {
    backgroundColor: Colors.card,
    padding: Sizes.paddingXXL,
    borderRadius: Sizes.radiusL,
    alignItems: "center",
    minWidth: 120,
  },
  message: {
    marginTop: Sizes.marginL,
    fontSize: Sizes.fontL,
    color: Colors.text,
    textAlign: "center",
  },
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Sizes.paddingL,
  },
  inlineMessage: {
    marginLeft: Sizes.marginM,
    fontSize: Sizes.fontM,
    color: Colors.textSecondary,
  },
});
