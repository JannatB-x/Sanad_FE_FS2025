// types/user.type.ts

export enum UserType {
  ADMIN = "admin",
  USER = "user",
  RIDER = "rider",
  COMPANY = "company",
}

// Disability levels
export enum DisabilityLevel {
  NONE = "none",
  MILD = "mild",
  MODERATE = "moderate",
  SEVERE = "severe",
}

// Emergency contact relations
export const EMERGENCY_RELATIONS = [
  "Parent",
  "Spouse",
  "Sibling",
  "Child",
  "Friend",
  "Guardian",
  "Other",
] as const;

export type EmergencyRelation = (typeof EMERGENCY_RELATIONS)[number];

export interface IUser {
  _id: string;
  name: string;
  email: string;
  userType: UserType;
  diseases: string[];
  disabilityLevel: DisabilityLevel;
  statusDocument?: string;
  statusDocuments?: string[];
  emergencyContact?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: EmergencyRelation;
  location?: string;
  rideHistory?: string[];
  rideRatings?: string[];
  appointments?: string[];
  earnings?: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  userType?: UserType;
  diseases?: string[];
  disabilityLevel?: DisabilityLevel;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: EmergencyRelation;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  diseases?: string[];
  disabilityLevel?: DisabilityLevel;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: EmergencyRelation;
  profileImage?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    token: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: IUser;
}

export interface EmergencyContactInfo {
  emergencyContact: string;
  emergencyContactPhone: string;
  emergencyContactRelation: EmergencyRelation;
}

export interface MedicalInfo {
  diseases: string[];
  disabilityLevel: DisabilityLevel;
  statusDocuments: string[];
}
