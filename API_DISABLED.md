# API Connections Disabled

All backend API connections have been disabled to allow free editing without backend dependencies.

## What Was Changed

1. **`constants/API.ts`**
   - `API_BASE_URL` set to empty string
   - `API_ENABLED` flag set to `false`
   - All localhost URLs commented out

2. **`api/index.ts`**
   - Added request interceptor that blocks all API calls when `API_ENABLED = false`
   - Throws clear error message when API is disabled

3. **`context/Auth.context.tsx`**
   - Login: Uses mock user data instead of API call
   - Register: Uses mock user data instead of API call
   - Logout: Skips API call
   - `getMe()` call disabled in `loadAuthData()`

4. **`api/auth.api.ts`**
   - Added header comment noting API is disabled
   - All API functions still exist but will be blocked by interceptor

## How to Re-enable API Connections

When you're ready to connect to the backend:

1. **Update `constants/API.ts`:**
   ```typescript
   export const API_BASE_URL = "http://localhost:5000/api/v1"; // or your server URL
   export const API_ENABLED = true; // Enable API calls
   ```

2. **Update `context/Auth.context.tsx`:**
   - In `login()`: Uncomment the API call and remove mock code
   - In `register()`: Uncomment the API call and remove mock code
   - In `logout()`: Uncomment the API call
   - In `loadAuthData()`: Uncomment the `getMe()` call

3. **Test the connection:**
   - Ensure your backend server is running
   - Test login/register flows
   - Verify API responses match expected format

## Current Behavior

- **Login/Register**: Creates mock users locally and stores them in AsyncStorage
- **Navigation**: Works normally based on user type
- **All other API calls**: Will throw error "API connections are disabled"

## Notes

- Mock users are stored in AsyncStorage, so you can test the full app flow
- User data persists between app restarts
- All validation and UI logic remains intact
- Only the actual network calls are disabled

