// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Config } from "../constants/Config";

/**
 * Storage utility for managing AsyncStorage operations
 */

// Save data to storage
export const saveData = async (key: string, value: any): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

// Get data from storage
export const getData = async <T = any>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

// Remove data from storage
export const removeData = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
};

// Clear all storage
export const clearAll = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing all data:", error);
    return false;
  }
};

// Get multiple items
export const getMultiple = async (
  keys: string[]
): Promise<{ [key: string]: any }> => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result: { [key: string]: any } = {};

    values.forEach(([key, value]) => {
      if (value) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      }
    });

    return result;
  } catch (error) {
    console.error("Error getting multiple items:", error);
    return {};
  }
};

// Save multiple items
export const saveMultiple = async (items: {
  [key: string]: any;
}): Promise<boolean> => {
  try {
    const pairs: [string, string][] = Object.entries(items).map(
      ([key, value]) => [key, JSON.stringify(value)]
    );

    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error("Error saving multiple items:", error);
    return false;
  }
};

// Storage keys helpers
export const StorageKeys = {
  TOKEN: Config.STORAGE_KEYS.TOKEN,
  USER: Config.STORAGE_KEYS.USER,
  USER_TYPE: Config.STORAGE_KEYS.USER_TYPE,
  LANGUAGE: Config.STORAGE_KEYS.LANGUAGE,
  THEME: Config.STORAGE_KEYS.THEME,
  ONBOARDING_COMPLETE: Config.STORAGE_KEYS.ONBOARDING_COMPLETE,
};

// Auth-specific storage functions
export const saveAuthData = async (
  token: string,
  user: any
): Promise<boolean> => {
  return await saveMultiple({
    [StorageKeys.TOKEN]: token,
    [StorageKeys.USER]: user,
    [StorageKeys.USER_TYPE]: user.userType,
  });
};

export const getAuthData = async (): Promise<{
  token: string | null;
  user: any | null;
}> => {
  const data = await getMultiple([StorageKeys.TOKEN, StorageKeys.USER]);
  return {
    token: data[StorageKeys.TOKEN] || null,
    user: data[StorageKeys.USER] || null,
  };
};

export const clearAuthData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove([
      StorageKeys.TOKEN,
      StorageKeys.USER,
      StorageKeys.USER_TYPE,
    ]);
    return true;
  } catch (error) {
    console.error("Error clearing auth data:", error);
    return false;
  }
};

// Check if key exists
export const hasKey = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking key ${key}:`, error);
    return false;
  }
};

// Get all keys
export const getAllKeys = async (): Promise<string[]> => {
  try {
    return Array.from(await AsyncStorage.getAllKeys());
  } catch (error) {
    console.error("Error getting all keys:", error);
    return [];
  }
};
