// utils/date.ts
import { Config } from "../constants/Config";

/**
 * Date and time utility functions
 */

// Format date to display format
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format date to long format
export const formatDateLong = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Format time to display format
export const formatTime = (time: Date | string): string => {
  if (typeof time === "string") {
    // If time is in "HH:mm" format
    if (time.includes(":") && !time.includes("T")) {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    // If time is ISO string
    time = new Date(time);
  }

  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format datetime to display format
export const formatDateTime = (datetime: Date | string): string => {
  const dateObj = typeof datetime === "string" ? new Date(datetime) : datetime;

  return dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get relative time (e.g., "2 hours ago", "just now")
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

// Check if date is today
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

// Check if date is tomorrow
export const isTomorrow = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    dateObj.getDate() === tomorrow.getDate() &&
    dateObj.getMonth() === tomorrow.getMonth() &&
    dateObj.getFullYear() === tomorrow.getFullYear()
  );
};

// Check if date is in the past
export const isPast = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date();
};

// Check if date is in the future
export const isFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj > new Date();
};

// Get day of week
export const getDayOfWeek = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", { weekday: "long" });
};

// Get month name
export const getMonthName = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", { month: "long" });
};

// Format to ISO date (YYYY-MM-DD)
export const toISODate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
};

// Format to ISO time (HH:mm)
export const toISOTime = (time: Date | string): string => {
  if (typeof time === "string") {
    time = new Date(time);
  }
  return time.toTimeString().slice(0, 5);
};

// Parse ISO date string
export const parseISODate = (dateString: string): Date => {
  return new Date(dateString);
};

// Add days to date
export const addDays = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

// Add hours to date
export const addHours = (date: Date | string, hours: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  dateObj.setHours(dateObj.getHours() + hours);
  return dateObj;
};

// Add minutes to date
export const addMinutes = (date: Date | string, minutes: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  dateObj.setMinutes(dateObj.getMinutes() + minutes);
  return dateObj;
};

// Get difference in days
export const getDifferenceInDays = (
  date1: Date | string,
  date2: Date | string
): number => {
  const dateObj1 = typeof date1 === "string" ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? new Date(date2) : date2;

  const diffInMs = dateObj2.getTime() - dateObj1.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

// Get difference in hours
export const getDifferenceInHours = (
  date1: Date | string,
  date2: Date | string
): number => {
  const dateObj1 = typeof date1 === "string" ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? new Date(date2) : date2;

  const diffInMs = dateObj2.getTime() - dateObj1.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60));
};

// Get difference in minutes
export const getDifferenceInMinutes = (
  date1: Date | string,
  date2: Date | string
): number => {
  const dateObj1 = typeof date1 === "string" ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? new Date(date2) : date2;

  const diffInMs = dateObj2.getTime() - dateObj1.getTime();
  return Math.floor(diffInMs / (1000 * 60));
};

// Format duration (e.g., "2h 30m")
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

// Get start of day
export const getStartOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

// Get end of day
export const getEndOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

// Get start of month
export const getStartOfMonth = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
};

// Get end of month
export const getEndOfMonth = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  return new Date(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
};
