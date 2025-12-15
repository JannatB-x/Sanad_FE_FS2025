// constants/Sizes.ts

export const Sizes = {
  // Padding
  paddingXS: 4,
  paddingS: 8,
  paddingM: 12,
  paddingL: 16,
  paddingXL: 20,
  paddingXXL: 24,
  padding3XL: 32,
  padding4XL: 40,

  // Margin
  marginXS: 4,
  marginS: 8,
  marginM: 12,
  marginL: 16,
  marginXL: 20,
  marginXXL: 24,
  margin3XL: 32,
  margin4XL: 40,

  // Border Radius
  radiusXS: 4,
  radiusS: 8,
  radiusM: 12,
  radiusL: 16,
  radiusXL: 20,
  radiusRound: 999,

  // Font Sizes
  fontXS: 10,
  fontS: 12,
  fontM: 14,
  fontL: 16,
  fontXL: 18,
  fontXXL: 20,
  font3XL: 24,
  font4XL: 28,
  font5XL: 32,
  font6XL: 40,

  // Icon Sizes
  iconXS: 16,
  iconS: 20,
  iconM: 24,
  iconL: 28,
  iconXL: 32,
  iconXXL: 40,
  icon3XL: 48,

  // Button Heights
  buttonS: 36,
  buttonM: 44,
  buttonL: 52,
  buttonXL: 60,

  // Input Heights
  inputS: 36,
  inputM: 44,
  inputL: 52,

  // Avatar Sizes
  avatarXS: 24,
  avatarS: 32,
  avatarM: 40,
  avatarL: 48,
  avatarXL: 64,
  avatarXXL: 80,
  avatar3XL: 120,

  // Card
  cardPadding: 16,
  cardRadius: 12,

  // Container
  containerPadding: 16,
  containerMaxWidth: 600,

  // Header
  headerHeight: 60,

  // Tab Bar
  tabBarHeight: 60,

  // Map
  mapMarkerSize: 40,

  // Shadow
  shadowRadius: 4,
  shadowOpacity: 0.1,
  shadowOffset: {
    width: 0,
    height: 2,
  },
};

// Responsive sizes helper
export const getResponsiveSize = (size: number, scale: number = 1): number => {
  return size * scale;
};
