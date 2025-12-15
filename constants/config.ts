// constants/Config.ts

export const Config = {
  // App Info
  APP_NAME: "Sanad",
  APP_VERSION: "1.0.0",

  // Google Maps
  GOOGLE_MAPS_API_KEY:
    process.env.GOOGLE_MAPS_API_KEY ||
    "AIzaSyDh5EQ_WkXDqErL0VgmlOInGj1tZDE5HLY",
  // Tap Payment Gateway (Kuwait)
  // Configure via environment variables:
  // TAP_PUBLIC_KEY, TAP_SECRET_KEY, TAP_MERCHANT_ID
  // TAP_CURRENCY: "KWD",

  // Pricing
  BASE_FARE: 2.0, // KWD
  PRICE_PER_KILOMETER: 1.5, // KWD
  PRICE_PER_MINUTE: 0.5, // KWD
  MINIMUM_FARE: 3.0, // KWD
  CURRENCY: "KWD",
  CURRENCY_SYMBOL: "د.ك", // Kuwaiti Dinar symbol

  // Peak hours multiplier
  // PEAK_HOUR_MULTIPLIER: 1.5,
  // PEAK_HOURS: [
  //   { start: 7, end: 9 },   // Morning rush: 7 AM - 9 AM
  //   { start: 17, end: 20 }, // Evening rush: 5 PM - 8 PM
  // ],

  // Location
  DEFAULT_LATITUDE: 29.3759,
  DEFAULT_LONGITUDE: 47.9774,
  DEFAULT_COUNTRY_CODE: "KW",
  DEFAULT_TIMEZONE: "Asia/Kuwait",
  DRIVER_SEARCH_RADIUS: 10, // kilometers
  MAX_PICKUP_DISTANCE: 50, // kilometers

  // Map
  MAP_DELTA: {
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },

  // Ride
  MAX_RIDE_WAIT_TIME: 10, // minutes
  RIDE_REFRESH_INTERVAL: 5000, // 5 seconds

  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ],

  // Date/Time Format
  DATE_FORMAT: "YYYY-MM-DD",
  TIME_FORMAT: "HH:mm",
  DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
  DISPLAY_DATE_FORMAT: "DD MMM YYYY",
  DISPLAY_TIME_FORMAT: "hh:mm A",
  DISPLAY_DATETIME_FORMAT: "DD MMM YYYY, hh:mm A",

  // Pagination
  DEFAULT_PAGE_SIZE: 20,

  // Phone
  KUWAIT_COUNTRY_CODE: "+965",
  PHONE_LENGTH: 8,

  // Rating
  MAX_RATING: 5,
  MIN_RATING: 1,

  // AsyncStorage Keys
  STORAGE_KEYS: {
    TOKEN: "token",
    USER: "user",
    USER_TYPE: "userType",
    LANGUAGE: "language",
    THEME: "theme",
    ONBOARDING_COMPLETE: "onboarding_complete",
  },

  // Languages
  SUPPORTED_LANGUAGES: [
    { code: "en", name: "English", nativeName: "English" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
  ],
  DEFAULT_LANGUAGE: "en",

  // Contact
  SUPPORT_EMAIL: "support@sanad.com",
  SUPPORT_PHONE: "+96512345678",

  // Social Media
  SOCIAL_MEDIA: {
    FACEBOOK: "https://facebook.com/sanad",
    TWITTER: "https://twitter.com/sanad",
    INSTAGRAM: "https://instagram.com/sanad",
  },

  // Terms and Privacy
  TERMS_URL: "https://sanad.com/terms",
  PRIVACY_URL: "https://sanad.com/privacy",

  // Feature Flags
  FEATURES: {
    ENABLE_CHAT: false,
    ENABLE_SCHEDULED_RIDES: true,
    ENABLE_SPLIT_PAYMENT: false,
    ENABLE_RIDE_SHARING: false,
    ENABLE_TIPS: true,
  },
};

// Helper function to check if current time is peak hour
export const isPeakHour = (): boolean => {
  const currentHour = new Date().getHours();
  return false;
};

//   // Helper function to get price multiplier
//   export const getPriceMultiplier = (): number => {
//     return isPeakHour() ? Config.PEAK_HOUR_MULTIPLIER : 1;
//   };

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return `${Config.CURRENCY_SYMBOL} ${amount.toFixed(3)}`;
};
