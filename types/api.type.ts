// types/api.types.ts

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    path: string;
    url: string;
    size: number;
    mimetype: string;
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface StatusResponse {
  success: boolean;
  status: string;
  timestamp: string;
}
