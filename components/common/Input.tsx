// components/common/Input.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";
import { useFontSize } from "../../utils/fontSize";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  icon?: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  required = false,
  secureTextEntry,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const fontSize = useFontSize();

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const dynamicStyles = {
    label: { fontSize: fontSize.fontM },
    input: { fontSize: fontSize.fontL },
    errorText: { fontSize: fontSize.fontS },
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, dynamicStyles.label]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError ? styles.inputContainerError : {},
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={
              error
                ? Colors.error
                : isFocused
                ? Colors.primary
                : Colors.textSecondary
            }
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.input, dynamicStyles.input, inputStyle]}
          placeholderTextColor={Colors.textLight}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={toggleSecureEntry}
            style={styles.rightIconButton}
          >
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconButton}
          >
            <Ionicons name={rightIcon} size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={Colors.error} />
          <Text style={[styles.errorText, dynamicStyles.errorText]}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.marginL,
  },
  label: {
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Sizes.marginS,
  },
  required: {
    color: Colors.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusM,
    height: Sizes.inputM,
    paddingHorizontal: Sizes.paddingL,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    color: Colors.text,
    paddingVertical: 0,
    height: "100%",
  },
  leftIcon: {
    marginRight: Sizes.marginM,
  },
  rightIconButton: {
    marginLeft: Sizes.marginM,
    padding: Sizes.paddingXS,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.marginS,
  },
  errorText: {
    color: Colors.error,
    marginLeft: Sizes.marginXS,
  },
});
