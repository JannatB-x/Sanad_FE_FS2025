// constants/API.ts
// API connections disabled - edit freely before connecting
// export const API_BASE_URL = "http://localhost:5000/api/v1";
// export const API_BASE_URL = "https://your-production-api.com/api/v1";
export const API_BASE_URL = ""; // Disabled - no backend connection
export const API_ENABLED = false; // Set to true when ready to connect

export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },

  COMPANIES: {
    GET_ALL: "/companies",
    CREATE: "/companies",
    UPDATE: (id: string) => `/companies/${id}`,
    DELETE: (id: string) => `/companies/${id}`,
    UPDATE_DRIVERS: (id: string) => `/companies/${id}/drivers`,
    ADD_DRIVERS: (id: string) => `/companies/${id}/drivers`,
    DELETE_DRIVER: (id: string, driverId: string) =>
      `/companies/${id}/drivers/${driverId}`,
  },

  RIDERS: {
    GET_ALL: "/riders",
    GET_BY_ID: (id: string) => `/riders/${id}`,
    CREATE: "/riders",
    UPDATE: (id: string) => `/riders/${id}`,
    DELETE: (id: string) => `/riders/${id}`,
    RIDE_HISTORY: (id: string) => `/riders/${id}/ride-history`,
    RIDE_RATINGS: (id: string) => `/riders/${id}/ride-ratings`,
    EARNINGS: (id: string) => `/riders/${id}/earnings`,
    UPDATE_LOCATION: (id: string) => `/riders/${id}/location`,
    UPDATE_STATUS: (id: string) => `/riders/${id}/status`,
    TOGGLE_AVAILABILITY: (id: string) => `/riders/${id}/availability`,
  },

  RIDES: {
    GET_ALL: "/rides",
    CREATE: "/rides",
    UPDATE: (id: string) => `/rides/${id}`,
    UPDATE_STATUS: (id: string) => `/rides/${id}/status`,
    CANCEL: (id: string) => `/rides/${id}/cancel`,
    RATE: (id: string) => `/rides/${id}/rate`,
    NEAREST_DRIVER: (id: string) => `/rides/${id}/nearest-driver`,
    COMPLETE: (id: string) => `/rides/${id}/complete`,
    CALCULATE_PRICE: (id: string) => `/rides/${id}/calculate-price`,
    PAYMENT_TYPE: (id: string) => `/rides/${id}/payment-type`,
    PAYMENT_STATUS: (id: string) => `/rides/${id}/payment-status`,
    PAYMENT_METHOD: (id: string) => `/rides/${id}/payment-method`,
    PAYMENT_AMOUNT: (id: string) => `/rides/${id}/payment-amount`,
    PAYMENT_DATE: (id: string) => `/rides/${id}/payment-date`,
    PAYMENT_TIME: (id: string) => `/rides/${id}/payment-time`,
  },

  APPOINTMENTS: {
    GET_ALL: "/appointments",
    CREATE: "/appointments",
    UPDATE: (id: string) => `/appointments/${id}`,
    DELETE: (id: string) => `/appointments/${id}`,
  },

  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: (id: string) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    RIDE_HISTORY: (id: string) => `/users/${id}/ride-history`,
    RIDE_RATINGS: (id: string) => `/users/${id}/ride-ratings`,
    APPOINTMENTS: (id: string) => `/users/${id}/appointments`,
    UPDATE_LOCATION: (id: string) => `/users/${id}/location`,
    GET_LOCATION: (id: string) => `/users/${id}/location`,
    // Legacy endpoints (kept for backward compatibility)
    PROFILE: "/users/profile",
    APPOINTMENTS_LEGACY: "/users/appointments",
    RIDE_HISTORY_LEGACY: "/users/ride-history",
  },

  UPLOADS: {
    PROFILE_IMAGE: (id: string) => `/uploads/${id}/profile-image`,
    DRIVER_LICENSE: (id: string) => `/uploads/${id}/driver-license`,
    STATUS_DOCUMENT: (id: string) => `/uploads/${id}/status-document`,
    STATUS_DOCUMENTS: (id: string) => `/uploads/${id}/status-documents`,
  },

  VEHICLES: {
    BASE: "/vehicles",
    SEARCH: "/vehicles/search",
    AVAILABLE: "/vehicles/available",
    COMPANY: "/vehicles/company",
  },

  PAYMENTS: {
    BASE: "/payments",
    CREATE: "/payments/create",
    VERIFY: "/payments/verify",
    HISTORY: "/payments/history",
    PROCESS: "/payments/process",
    REFUND: "/payments/refund",
    METHODS: "/payments/methods",
    STATS: "/payments/stats",
    WEBHOOK: "/payments/webhook",
    CALCULATE: "/payments/calculate",
  },
};

// API Timeout
export const API_TIMEOUT = 10000; // 10 seconds

// Request retry config
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};
