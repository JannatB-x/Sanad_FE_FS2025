// types/company.types.ts
import { UserType } from "./user.type";

export interface ICompany {
  _id: string;
  name: string;
  email: string;
  userType: UserType.COMPANY;
  address: string;
  phone: string;
  website?: string;
  logo?: string;
  description?: string;
  licenseNumber: string;
  licenseExpirationDate: string;
  licenseImage?: string;
  drivers: string[];
  vehicles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  licenseNumber: string;
  licenseExpirationDate: string;
}

export interface UpdateCompanyData {
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
  logo?: string;
}

export interface CompanyResponse {
  success: boolean;
  data: ICompany;
}

export interface CompaniesResponse {
  success: boolean;
  data: ICompany[];
}

export interface CompanyStats {
  totalRiders: number;
  totalVehicles: number;
  activeRiders: number;
  totalRides: number;
  completedRides: number;
  totalRevenue: number;
  averageRating: number;
}
