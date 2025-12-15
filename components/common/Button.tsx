// components/common/Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...(fullWidth && styles.fullWidth),
    };

    // Size styles
    switch (size) {
      case "small":
        baseStyle.height = Sizes.buttonS;
        baseStyle.paddingHorizontal = Sizes.paddingL;
        break;
      case "large":
        baseStyle.height = Sizes.buttonL;
        baseStyle.paddingHorizontal = Sizes.paddingXXL;
        break;
      default:
        baseStyle.height = Sizes.buttonM;
        baseStyle.paddingHorizontal = Sizes.paddingXL;
    }

    // Variant styles
    switch (variant) {
      case "primary":
        baseStyle.backgroundColor = Colors.primary;
        break;
      case "secondary":
        baseStyle.backgroundColor = Colors.secondary;
        break;
      case "outline":
        baseStyle.backgroundColor = "transparent";
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = Colors.primary;
        break;
      case "danger":
        baseStyle.backgroundColor = Colors.error;
        break;
      case "success":
        baseStyle.backgroundColor = Colors.success;
        break;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
    };

    // Size text styles
    switch (size) {
      case "small":
        baseTextStyle.fontSize = Sizes.fontM;
        break;
      case "large":
        baseTextStyle.fontSize = Sizes.fontXL;
        break;
      default:
        baseTextStyle.fontSize = Sizes.fontL;
    }

    // Variant text styles
    if (variant === "outline") {
      baseTextStyle.color = Colors.primary;
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : Colors.textWhite}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.radiusM,
    gap: Sizes.marginS,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    color: Colors.textWhite,
    fontWeight: "600",
  },
});
