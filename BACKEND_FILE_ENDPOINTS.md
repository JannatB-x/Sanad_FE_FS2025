# Backend File Upload/Storage Endpoints Review

## Summary

After reviewing the backend codebase (`Sanad_BE_FS2025`), here's what I found regarding file upload and storage endpoints:

## Current Status

### ✅ **File Upload Infrastructure EXISTS**

The backend has file upload infrastructure configured but **NO ACTIVE FILE UPLOAD ENDPOINTS** are currently implemented.

### 📁 **File Upload Configuration**

1. **Multer Configuration** (`src/config/multer.ts`):

   - ✅ Configured for image uploads only (jpeg, jpg, png, gif)
   - ✅ File size limit: 5MB
   - ✅ Storage: Local disk storage in `uploads/` directory
   - ✅ Filename format: `{fieldname}-{timestamp}-{random}.{ext}`

2. **Alternative Upload Middleware** (`src/middlewares/upload.ts`):

   - ✅ Basic multer configuration (less restrictive than `config/multer.ts`)
   - ⚠️ **Note**: Two different multer configs exist - should be consolidated

3. **Static File Serving** (`src/app.ts` line 119-120):
   ```typescript
   const uploadsPath = path.join(process.cwd(), "uploads");
   app.use("/uploads", express.static(uploadsPath));
   ```
   - ✅ Files uploaded to `uploads/` directory are accessible via `GET /uploads/{filename}`

### ❌ **Missing File Upload Endpoints**

**No file upload routes are currently registered in any router:**

- ❌ No user profile picture upload endpoint
- ❌ No document upload endpoint (e.g., identification documents)
- ❌ No general file upload endpoint
- ❌ No driver license/document upload endpoint

## Expected Endpoints (Not Currently Implemented)

Based on the infrastructure, the following endpoints **should** exist but are **missing**:

### 1. User Profile Picture Upload

```
POST /api/users/me/avatar
POST /api/users/profile/avatar
```

- **Expected**: Upload user profile picture
- **Status**: ❌ Not implemented
- **Middleware needed**: `authorize`, `upload.single('avatar')`

### 2. User Document Upload

```
POST /api/users/me/documents
POST /api/users/profile/documents
```

- **Expected**: Upload identification documents
- **Status**: ❌ Not implemented
- **Middleware needed**: `authorize`, `upload.array('documents')`

### 3. Driver License/Document Upload

```
POST /api/drivers/documents
POST /api/drivers/license
```

- **Expected**: Upload driver license and verification documents
- **Status**: ❌ Not implemented
- **Middleware needed**: `authorize`, `driverMiddleware`, `upload.single('license')`

## Backend Code References

### File Upload Configuration Files

**File**: `src/config/multer.ts`

```typescript
export const upload = multer({
  storage,
  fileFilter, // Only images: jpeg, jpg, png, gif
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
```

**File**: `src/middlewares/upload.ts`

```typescript
const upload = multer({ storage: mystorage });
// Less restrictive - no file type filtering
```

**File**: `src/app.ts` (lines 118-120)

```typescript
// Static Files
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));
```

### User Model

**File**: `src/models/user.ts`

- ❌ No `avatar` or `profilePicture` field
- ❌ No `documents` array field
- **Note**: User model would need to be updated to store file paths/URLs

## Recommendations

### 1. **Implement User Profile Picture Upload**

```typescript
// In src/routes/user.router.ts
import { upload } from "../config/multer";

router.post(
  "/me/avatar",
  authorize,
  upload.single("avatar"),
  uploadAvatarController
);

// In src/controllers/user.controller.ts
const uploadAvatarController = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `/uploads/${file.filename}`;
  // Update user with fileUrl
  // Return updated user
};
```

### 2. **Update User Model**

Add fields to store file references:

```typescript
Avatar: {
  type: String,
  default: "",
},
Documents: [{
  type: String, // File paths
}],
```

### 3. **Consolidate Multer Configurations**

- Remove duplicate `src/middlewares/upload.ts` or merge with `src/config/multer.ts`
- Use a single, consistent multer configuration

### 4. **Add File Deletion Endpoint**

```
DELETE /api/users/me/avatar
DELETE /api/users/me/documents/:documentId
```

### 5. **Consider Cloud Storage**

For production, consider using:

- AWS S3
- Google Cloud Storage
- Firebase Storage
- Cloudinary

Instead of local file storage.

## Frontend Integration Notes

If file upload endpoints are implemented, the frontend should:

1. **Use FormData for file uploads**:

   ```typescript
   const formData = new FormData();
   formData.append("avatar", {
     uri: imageUri,
     type: "image/jpeg",
     name: "avatar.jpg",
   } as any);
   ```

2. **Set proper headers**:

   ```typescript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'multipart/form-data',
   }
   ```

3. **Handle file URLs**:
   - Backend returns file path: `/uploads/filename.jpg`
   - Frontend constructs full URL: `${API_URL}/uploads/filename.jpg`
   - Or backend returns full URL: `http://134.122.96.197:3000/uploads/filename.jpg`

## Priority

🟡 **MEDIUM** - File upload functionality is infrastructure-ready but endpoints need to be implemented. This is not blocking core functionality but would enhance user experience (profile pictures, document verification).

---

**Last Updated**: Based on review of `Sanad_BE_FS2025` codebase
**Backend Server**: `http://134.122.96.197:3000`
**Static Files Base URL**: `http://134.122.96.197:3000/uploads/`
