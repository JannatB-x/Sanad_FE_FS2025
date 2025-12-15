// utils/fontSize.ts
import { useSettings } from "../context/Settings.context";
import { Sizes } from "../constants/Sizes";

/**
 * Hook to get font size with accessibility multiplier applied
 */
export const useFontSize = () => {
  const { getFontSizeMultiplier } = useSettings();
  const multiplier = getFontSizeMultiplier();

  return {
    fontXS: Sizes.fontXS * multiplier,
    fontS: Sizes.fontS * multiplier,
    fontM: Sizes.fontM * multiplier,
    fontL: Sizes.fontL * multiplier,
    fontXL: Sizes.fontXL * multiplier,
    fontXXL: Sizes.fontXXL * multiplier,
    font3XL: Sizes.font3XL * multiplier,
    font4XL: Sizes.font4XL * multiplier,
    font5XL: Sizes.font5XL * multiplier,
    font6XL: Sizes.font6XL * multiplier,
    multiplier,
    // Helper function to get any font size with multiplier
    getSize: (baseSize: number) => baseSize * multiplier,
  };
};

/**
 * Get font size with multiplier applied
 */
export const getFontSize = (baseSize: number, multiplier: number): number => {
  return baseSize * multiplier;
};

