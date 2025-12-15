// context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { IUser, UserType, DisabilityLevel } from "../types/user.type";
import { authAPI } from "../api/auth.api";
import { saveAuthData, getAuthData, clearAuthData } from "../utils/storage";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    userType: UserType
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: IUser) => void;
  // Authorization helpers
  isUser: () => boolean;
  isRider: () => boolean;
  isCompany: () => boolean;
  isAdmin: () => boolean;
  hasRole: (role: UserType) => boolean;
  hasAnyRole: (roles: UserType[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      setIsLoading(true);
      const { token: storedToken, user: storedUser } = await getAuthData();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);

        // Optionally fetch fresh user data (disabled when API is off)
        // try {
        //   const freshUser = await authAPI.getMe();
        //   setUser(freshUser);
        //   await saveAuthData(storedToken, freshUser);
        // } catch (error) {
        //   console.log("Could not fetch fresh user data, using stored data");
        // }
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // API connections disabled - using mock login for development
    // TODO: Re-enable API call when backend is ready
    try {
      // Mock login - replace with actual API call when ready
      // const response = await authAPI.login({ email, password });
      
      // For now, create a mock user for testing
      const mockUser: IUser = {
        _id: "mock-user-id",
        name: email.split("@")[0],
        email: email,
        userType: UserType.USER,
        diseases: [],
        disabilityLevel: DisabilityLevel.NONE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockToken = "mock-token-" + Date.now();
      
      setToken(mockToken);
      setUser(mockUser);
      await saveAuthData(mockToken, mockUser);
      
      // Uncomment below when API is enabled:
      // const response = await authAPI.login({ email, password });
      // if (!response.token || !response.user) {
      //   throw new Error("Invalid response from server");
      // }
      // setToken(response.token);
      // setUser(response.user);
      // await saveAuthData(response.token, response.user);
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    userType: UserType
  ) => {
    // Validate input
    if (!name || name.trim().length === 0) {
      throw new Error("Name is required");
    }
    if (!email || email.trim().length === 0) {
      throw new Error("Email is required");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Prevent unauthorized registration of admin or company accounts
    if (userType === UserType.ADMIN || userType === UserType.COMPANY) {
      throw new Error(
        "Admin and Company accounts cannot be created through public registration"
      );
    }

    try {
      // API connections disabled - using mock registration for development
      // TODO: Re-enable API call when backend is ready
      
      // Mock registration - replace with actual API call when ready
      const mockUser: IUser = {
        _id: "mock-user-" + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        userType,
        diseases: [],
        disabilityLevel: DisabilityLevel.NONE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockToken = "mock-token-" + Date.now();
      
      setToken(mockToken);
      setUser(mockUser);
      await saveAuthData(mockToken, mockUser);
      
      // Uncomment below when API is enabled:
      // const response = await authAPI.register({
      //   name: name.trim(),
      //   email: email.trim().toLowerCase(),
      //   password,
      //   userType,
      // });
      // if (!response.token || !response.user) {
      //   throw new Error("Invalid response from server");
      // }
      // setToken(response.token);
      // setUser(response.user);
      // await saveAuthData(response.token, response.user);
    } catch (error: any) {
      console.error("Register error:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      // Re-throw with user-friendly message
      throw error;
    }
  };

  const logout = async () => {
    try {
      // API connections disabled - skip API call
      // TODO: Re-enable API call when backend is ready
      // await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      await clearAuthData();
    }
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    if (token) {
      saveAuthData(token, updatedUser);
    }
  };

  // Authorization helper functions
  const isUser = (): boolean => {
    return user?.userType === UserType.USER;
  };

  const isRider = (): boolean => {
    return user?.userType === UserType.RIDER;
  };

  const isCompany = (): boolean => {
    return user?.userType === UserType.COMPANY;
  };

  const isAdmin = (): boolean => {
    return user?.userType === UserType.ADMIN;
  };

  const hasRole = (role: UserType): boolean => {
    return user?.userType === role;
  };

  const hasAnyRole = (roles: UserType[]): boolean => {
    return user ? roles.includes(user.userType) : false;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isUser,
    isRider,
    isCompany,
    isAdmin,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
