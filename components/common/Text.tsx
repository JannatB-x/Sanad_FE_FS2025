// components/common/Text.tsx
import React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { useSettings } from "../../context/Settings.context";

interface TextProps extends RNTextProps {
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl" | "3xl" | "4xl" | "5xl" | "6xl";
}

export const Text: React.FC<TextProps> = ({ style, size, ...props }) => {
  const { getFontSizeMultiplier } = useSettings();
  const multiplier = getFontSizeMultiplier();

  const getFontSize = () => {
    const baseSizes: { [key: string]: number } = {
      xs: 10,
      s: 12,
      m: 14,
      l: 16,
      xl: 18,
      xxl: 20,
      "3xl": 24,
      "4xl": 28,
      "5xl": 32,
      "6xl": 40,
    };
    return baseSizes[size || "m"] * multiplier;
  };

  return (
    <RNText
      style={[style, { fontSize: getFontSize() }]}
      {...props}
    />
  );
};

