/**
 * Example usage of file upload API functions
 *
 * This file demonstrates how to use the file upload functions
 * once the backend endpoints are implemented.
 *
 * NOTE: These examples use React Native's ImagePicker or similar libraries
 * for selecting images. You'll need to install and configure an image picker.
 */

import * as ImagePicker from "expo-image-picker";
import {
  uploadAvatar,
  uploadDocuments,
  deleteAvatar,
  deleteDocument,
  getFileUrl,
  uploadDriverLicense,
  uploadDriverDocuments,
  type ImageFile,
} from "./files";

/**
 * Example: Upload user profile picture
 */
export const handleUploadProfilePicture = async () => {
  try {
    // Request permission to access camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload photos!");
      return;
    }

    // Pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile pictures
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Prepare file object
      const imageFile: ImageFile = {
        uri: asset.uri,
        type: "image/jpeg", // or asset.type if available
        name: "profile-picture.jpg",
      };

      // Upload avatar
      const response = await uploadAvatar(imageFile);
      console.log("Avatar uploaded:", response.fileUrl);

      // Get full URL for display
      const fullUrl = getFileUrl(response.fileUrl);
      console.log("Full avatar URL:", fullUrl);

      return {
        success: true,
        fileUrl: fullUrl,
        message: response.message,
      };
    }
  } catch (error: any) {
    console.error("Error uploading profile picture:", error);
    return {
      success: false,
      error: error.message || "Failed to upload profile picture",
    };
  }
};

/**
 * Example: Upload identification documents
 */
export const handleUploadDocuments = async () => {
  try {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload documents!");
      return;
    }

    // Pick multiple images
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.9, // Higher quality for documents
    });

    if (!result.canceled && result.assets.length > 0) {
      // Convert assets to ImageFile format
      const files: ImageFile[] = result.assets.map((asset, index) => ({
        uri: asset.uri,
        type: "image/jpeg",
        name: `document-${index + 1}.jpg`,
      }));

      // Upload documents
      const response = await uploadDocuments(files);
      console.log("Documents uploaded:", response.fileUrl);

      return {
        success: true,
        fileUrl: response.fileUrl,
        message: response.message,
      };
    }
  } catch (error: any) {
    console.error("Error uploading documents:", error);
    return {
      success: false,
      error: error.message || "Failed to upload documents",
    };
  }
};

/**
 * Example: Delete profile picture
 */
export const handleDeleteProfilePicture = async () => {
  try {
    const response = await deleteAvatar();
    console.log("Avatar deleted:", response.message);
    return {
      success: true,
      message: response.message,
    };
  } catch (error: any) {
    console.error("Error deleting avatar:", error);
    return {
      success: false,
      error: error.message || "Failed to delete avatar",
    };
  }
};

/**
 * Example: Delete a specific document
 */
export const handleDeleteDocument = async (documentId: string) => {
  try {
    const response = await deleteDocument(documentId);
    console.log("Document deleted:", response.message);
    return {
      success: true,
      message: response.message,
    };
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return {
      success: false,
      error: error.message || "Failed to delete document",
    };
  }
};

/**
 * Example: Upload driver license
 */
export const handleUploadDriverLicense = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const imageFile: ImageFile = {
        uri: asset.uri,
        type: "image/jpeg",
        name: "driver-license.jpg",
      };

      const response = await uploadDriverLicense(imageFile);
      console.log("Driver license uploaded:", response.fileUrl);

      return {
        success: true,
        fileUrl: getFileUrl(response.fileUrl),
        message: response.message,
      };
    }
  } catch (error: any) {
    console.error("Error uploading driver license:", error);
    return {
      success: false,
      error: error.message || "Failed to upload driver license",
    };
  }
};

/**
 * Example: Display image from file URL
 *
 * Usage in a React Native component:
 *
 * ```tsx
 * import { Image } from 'react-native';
 * import { getFileUrl } from '../api/files';
 *
 * const ProfilePicture = ({ avatarPath }) => {
 *   const imageUrl = getFileUrl(avatarPath);
 *
 *   return (
 *     <Image
 *       source={{ uri: imageUrl }}
 *       style={{ width: 100, height: 100, borderRadius: 50 }}
 *     />
 *   );
 * };
 * ```
 */

/**
 * Example: Using with React Query
 *
 * ```tsx
 * import { useMutation, useQueryClient } from '@tanstack/react-query';
 * import { uploadAvatar } from '../api/files';
 *
 * const ProfileScreen = () => {
 *   const queryClient = useQueryClient();
 *
 *   const uploadMutation = useMutation({
 *     mutationFn: uploadAvatar,
 *     onSuccess: () => {
 *       // Invalidate profile query to refetch with new avatar
 *       queryClient.invalidateQueries({ queryKey: ['profile'] });
 *     },
 *   });
 *
 *   const handleUpload = async (imageFile) => {
 *     try {
 *       await uploadMutation.mutateAsync(imageFile);
 *       alert('Profile picture updated!');
 *     } catch (error) {
 *       alert(error.message);
 *     }
 *   };
 *
 *   return (
 *     // Your component JSX
 *   );
 * };
 * ```
 */
