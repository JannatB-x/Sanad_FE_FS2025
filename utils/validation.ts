// utils/validation.ts
import { KUWAIT_PHONE_REGEX } from "../constants/KuwaitLocations";

/**
 * Validation utility functions
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Password validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
};

// Get password strength
export const getPasswordStrength = (
  password: string
): "weak" | "medium" | "strong" => {
  if (password.length < 6) return "weak";

  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 4) return "medium";
  return "strong";
};

// Kuwait phone validation
export const isValidKuwaitPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, "");

  // Check if it starts with country code
  if (cleanPhone.startsWith("965")) {
    return KUWAIT_PHONE_REGEX.test(cleanPhone.substring(3));
  }

  return KUWAIT_PHONE_REGEX.test(cleanPhone);
};

// Format Kuwait phone number
export const formatKuwaitPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 8) {
    return `+965 ${cleanPhone.substring(0, 4)} ${cleanPhone.substring(4)}`;
  }

  if (cleanPhone.startsWith("965") && cleanPhone.length === 11) {
    const phoneNumber = cleanPhone.substring(3);
    return `+965 ${phoneNumber.substring(0, 4)} ${phoneNumber.substring(4)}`;
  }

  return phone;
};

// Name validation (only letters and spaces, min 2 chars)
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name.trim());
};

// Validate required field
export const isRequired = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return value.toString().trim().length > 0;
};

// Validate min length
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

// Validate max length
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

// Validate number
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && value.trim() !== "";
};

// Validate positive number
export const isPositiveNumber = (value: string | number): boolean => {
  const num = typeof value === "string" ? Number(value) : value;
  return !isNaN(num) && num > 0;
};

// Validate URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate date (not in past)
export const isValidFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dateObj >= today;
};

// Validate date range
export const isValidDateRange = (
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  return start <= end;
};

// Validate plate number (Kuwait format)
export const isValidKuwaitPlateNumber = (plateNumber: string): boolean => {
  // Kuwait plate format: 5-6 digits or letters
  const plateRegex = /^[A-Z0-9]{5,6}$/i;
  return plateRegex.test(plateNumber.trim());
};

// Validate year (for vehicles)
export const isValidVehicleYear = (year: number | string): boolean => {
  const yearNum = typeof year === "string" ? parseInt(year) : year;
  const currentYear = new Date().getFullYear();

  return yearNum >= 1990 && yearNum <= currentYear + 1;
};

// Validate license number
export const isValidLicenseNumber = (license: string): boolean => {
  // Kuwait license format: alphanumeric, 6-12 characters
  const licenseRegex = /^[A-Z0-9]{6,12}$/i;
  return licenseRegex.test(license.trim());
};

// Validate coordinates
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Validate rating (1-5)
export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5;
};

// Validate price/amount
export const isValidPrice = (price: string | number): boolean => {
  const priceNum = typeof price === "string" ? parseFloat(price) : price;
  return !isNaN(priceNum) && priceNum >= 0;
};

// Form validation helper
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export const validateField = (
  value: any,
  rules: ValidationRule[]
): string | null => {
  for (const rule of rules) {
    // Required check
    if (rule.required && !isRequired(value)) {
      return rule.message;
    }

    // Skip other checks if value is empty and not required
    if (!value) continue;

    // Min length check
    if (rule.minLength && !hasMinLength(value, rule.minLength)) {
      return rule.message;
    }

    // Max length check
    if (rule.maxLength && !hasMaxLength(value, rule.maxLength)) {
      return rule.message;
    }

    // Pattern check
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }

  return null;
};

// Validate form data
export const validateForm = (
  data: { [key: string]: any },
  rules: { [key: string]: ValidationRule[] }
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  for (const field in rules) {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};

// Check if form has errors
export const hasErrors = (errors: { [key: string]: string }): boolean => {
  return Object.keys(errors).length > 0;
};
