import instance from "./index";
import { API_URL } from "../constants/config";

/**
 * File upload response interface
 */
export interface FileUploadResponse {
  message: string;
  fileUrl: string;
  filename: string;
  user?: {
    id: string;
    avatar?: string;
    documents?: string[];
  };
}

/**
 * File deletion response interface
 */
export interface FileDeleteResponse {
  message: string;
  success: boolean;
}

/**
 * Image file type for React Native
 */
export interface ImageFile {
  uri: string;
  type: string;
  name: string;
}

/**
 * Upload user profile picture/avatar
 * @param imageFile - Image file object with uri, type, and name
 * @returns Promise with upload response containing file URL
 */
export const uploadAvatar = async (
  imageFile: ImageFile
): Promise<FileUploadResponse> => {
  try {
    console.log("[Files API] Uploading avatar:", imageFile.name);

    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append("avatar", {
      uri: imageFile.uri,
      type: imageFile.type || "image/jpeg",
      name: imageFile.name || "avatar.jpg",
    } as any);

    // Make request with FormData
    // Note: Don't set Content-Type header - let axios set it automatically with boundary
    const response = await instance.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("[Files API] Avatar upload successful:", response.status);

    // Backend should return: { message, fileUrl, filename, user }
    const data = response.data;
    return {
      message: data.message || "Avatar uploaded successfully",
      fileUrl: data.fileUrl || data.avatar || `/uploads/${data.filename}`,
      filename: data.filename || imageFile.name,
      user: data.user,
    };
  } catch (error: any) {
    console.error("[Files API] Error uploading avatar:", {
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
    });

    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error?.response?.status === 400) {
      throw new Error(
        error?.response?.data?.message ||
          "Invalid file. Please upload an image."
      );
    }

    if (error?.response?.status === 413) {
      throw new Error("File too large. Maximum size is 5MB.");
    }

    if (error?.response?.status === 404) {
      throw new Error(
        "Upload endpoint not found. Please ensure the backend has implemented file upload endpoints."
      );
    }

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to upload avatar";
    throw new Error(errorMessage);
  }
};

/**
 * Upload user documents (e.g., identification documents)
 * @param files - Array of image file objects
 * @returns Promise with upload response containing file URLs
 */
export const uploadDocuments = async (
  files: ImageFile[]
): Promise<FileUploadResponse> => {
  try {
    console.log("[Files API] Uploading documents:", files.length);

    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("documents", {
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.name || `document-${index}.jpg`,
      } as any);
    });

    const response = await instance.post("/users/me/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("[Files API] Documents upload successful:", response.status);

    const data = response.data;
    return {
      message: data.message || "Documents uploaded successfully",
      fileUrl: data.fileUrls?.[0] || data.fileUrl || "",
      filename: data.filenames?.[0] || files[0]?.name || "",
      user: data.user,
    };
  } catch (error: any) {
    console.error("[Files API] Error uploading documents:", {
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
    });

    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error?.response?.status === 400) {
      throw new Error(
        error?.response?.data?.message ||
          "Invalid files. Please upload images only."
      );
    }

    if (error?.response?.status === 413) {
      throw new Error("Files too large. Maximum size is 5MB per file.");
    }

    if (error?.response?.status === 404) {
      throw new Error(
        "Upload endpoint not found. Please ensure the backend has implemented file upload endpoints."
      );
    }

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to upload documents";
    throw new Error(errorMessage);
  }
};

/**
 * Delete user avatar
 * @returns Promise with deletion response
 */
export const deleteAvatar = async (): Promise<FileDeleteResponse> => {
  try {
    console.log("[Files API] Deleting avatar");

    const response = await instance.delete("/users/me/avatar");

    console.log("[Files API] Avatar deletion successful:", response.status);

    return {
      message: response.data.message || "Avatar deleted successfully",
      success: true,
    };
  } catch (error: any) {
    console.error("[Files API] Error deleting avatar:", {
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
    });

    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error?.response?.status === 404) {
      throw new Error(
        "Delete endpoint not found. Please ensure the backend has implemented file deletion endpoints."
      );
    }

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete avatar";
    throw new Error(errorMessage);
  }
};

/**
 * Delete a specific document
 * @param documentId - Document ID or filename to delete
 * @returns Promise with deletion response
 */
export const deleteDocument = async (
  documentId: string
): Promise<FileDeleteResponse> => {
  try {
    console.log("[Files API] Deleting document:", documentId);

    const response = await instance.delete(`/users/me/documents/${documentId}`);

    console.log("[Files API] Document deletion successful:", response.status);

    return {
      message: response.data.message || "Document deleted successfully",
      success: true,
    };
  } catch (error: any) {
    console.error("[Files API] Error deleting document:", {
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
    });

    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error?.response?.status === 404) {
      throw new Error("Delete endpoint not found or document does not exist.");
    }

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete document";
    throw new Error(errorMessage);
  }
};

/**
 * Get full URL for a file path
 * @param filePath - File path (e.g., "/uploads/filename.jpg")
 * @returns Full URL to access the file
 */
export const getFileUrl = (filePath: string): string => {
  if (!filePath) return "";

  // If already a full URL, return as is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  // Remove leading slash if present
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  // Construct full URL
  // Backend serves static files at /uploads, so we need to use the base URL without /api
  const baseUrl = API_URL.replace("/api", "");
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Upload driver license/document
 * @param imageFile - Image file object with uri, type, and name
 * @returns Promise with upload response containing file URL
 */
export const uploadDriverLicense = async (
  imageFile: ImageFile
): Promise<FileUploadResponse> => {
  try {
    console.log("[Files API] Uploading driver license:", imageFile.name);

    const formData = new FormData();
    formData.append("license", {
      uri: imageFile.uri,
      type: imageFile.type || "image/jpeg",
      name: imageFile.name || "license.jpg",
    } as any);

    const response = await instance.post("/drivers/license", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(
      "[Files API] Driver license upload successful:",
      response.status
    );

    const data = response.data;
    return {
      message: data.message || "License uploaded successfully",
      fileUrl: data.fileUrl || data.license || `/uploads/${data.filename}`,
      filename: data.filename || imageFile.name,
      user: data.user || data.driver,
    };
  } catch (error: any) {
    console.error("[Files API] Error uploading driver license:", {
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
    });

    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error?.response?.status === 400) {
      throw new Error(
        error?.response?.data?.message ||
          "Invalid file. Please upload an image."
      );
    }

    if (error?.response?.status === 413) {
      throw new Error("File too large. Maximum size is 5MB.");
    }

    if (error?.response?.status === 404) {
      throw new Error(
        "Upload endpoint not found. Please ensure the backend has implemented driver document upload endpoints."
      );
    }

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to upload driver license";
    throw new Error(errorMessage);
  }
};

/**
 * Upload driver documents
 * @param files - Array of image file objects
 * @returns Promise with upload response containing file URLs
 */
export const uploadDriverDocuments = async (
  files: ImageFile[]
): Promise<FileUploadResponse> => {
  try {
    console.log("[Files API] Uploading driver documents:", files.length);

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("documents", {
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.name || `document-${index}.jpg`,
      } as any);
    });

    const response = await instance.post("/drivers/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(
      "[Files API] Driver documents upload successful:",
      response.status
    );

    const data = response.data;
    return {
      message: data.message || "Documents uploaded successfully",
      fileUrl: data.fileUrls?.[0] || data.fileUrl || "",
      filename: data.filenames?.[0] || files[0]?.name || "",
      user: data.user || data.driver,
    };
  } catch (error: any) {
    console.error("[Files API] Error uploading driver documents:", {
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
    });

    if (error?.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error?.response?.status === 400) {
      throw new Error(
        error?.response?.data?.message ||
          "Invalid files. Please upload images only."
      );
    }

    if (error?.response?.status === 413) {
      throw new Error("Files too large. Maximum size is 5MB per file.");
    }

    if (error?.response?.status === 404) {
      throw new Error(
        "Upload endpoint not found. Please ensure the backend has implemented driver document upload endpoints."
      );
    }

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to upload driver documents";
    throw new Error(errorMessage);
  }
};
