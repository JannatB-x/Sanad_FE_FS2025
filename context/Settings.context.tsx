// context/Settings.context.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Config } from "../constants/Config";

export type FontSize = "normal" | "large" | "extra-large";

interface SettingsData {
  language: string;
  fontSize: FontSize;
  speech: boolean;
}

interface SettingsContextType {
  settings: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => Promise<void>;
  getFontSizeMultiplier: () => number;
  getFontSize: () => FontSize;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "app_settings";
const DEFAULT_SETTINGS: SettingsData = {
  language: Config.DEFAULT_LANGUAGE || "en",
  fontSize: "normal",
  speech: false,
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SettingsData;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SettingsData>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  };

  const getFontSizeMultiplier = (): number => {
    switch (settings.fontSize) {
      case "large":
        return 1.2;
      case "extra-large":
        return 1.5;
      case "normal":
      default:
        return 1.0;
    }
  };

  const getFontSize = (): FontSize => {
    return settings.fontSize;
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    getFontSizeMultiplier,
    getFontSize,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

