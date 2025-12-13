# Backend API Endpoints Reference

## Base URL

`http://localhost:3000/api` (or your server IP for iOS Simulator)

---

## 🔐 Authentication & Users (`/api/users`)

### ✅ Available Endpoints:

- `POST /api/users/register` - Register new user

  - Body: `{ Email, Password, Name, Username?, Identification?, MedicalHistory?, Disabilities?, FunctionalNeeds?, Location?, EmergencyContact?, EmergencyContactPhone?, EmergencyContactRelationship? }`
  - Returns: `{ message, user: { id, email, name }, token }`

- `POST /api/users/login` - Login user

  - Body: `{ Email, Password }`
  - Returns: `{ token }`

- `GET /api/users` - Get all users (no auth required)

  - Returns: `{ message, users: [] }`

- `GET /api/users/:id` - Get user by ID (no auth required)

  - Returns: `{ message, user: {} }`

- `POST /api/users` - Create user (no auth required)

  - Body: User object
  - Returns: `{ message, newUser: {} }`

- `PUT /api/users/:id` - Update user (no auth required)

  - Body: User object fields to update
  - Returns: `{ message, user: {} }`

- `DELETE /api/users/:id` - Delete user (no auth required)
  - Returns: `{ message }`

### ❌ Missing Endpoints:

- `GET /api/users/me` - Get current authenticated user
  - **Status**: Not implemented in backend
  - **Frontend expects**: Used in `api/profile.ts` → `getMyProfile()`
  - **Workaround**: Frontend decodes JWT token to get user ID, then calls `/api/users/:id`

---

## 🚗 Rides (`/api/rides`)

### ✅ Available Endpoints:

**Public/Admin:**

- `GET /api/rides` - Get all rides
- `GET /api/rides/:id` - Get ride by ID

**Authenticated User Routes (require `authorize` middleware):**

- `GET /api/rides/history/all` - Get ride history
- `GET /api/rides/upcoming/index` - Get upcoming rides
- `GET /api/rides/:rideId/driver/location` - Get driver location for a ride
- `POST /api/rides/request` - Request a ride
- `POST /api/rides/estimate` - Estimate fare
- `PUT /api/rides/:rideId/cancel` - Cancel a ride
- `PUT /api/rides/:rideId/dropoff` - Update dropoff location
- `POST /api/rides` - Create ride
- `PUT /api/rides/:id` - Update ride
- `DELETE /api/rides/:id` - Delete ride

---

## 📅 Calendar/Bookings (`/api/calendar`)

### ✅ Available Endpoints:

- `GET /api/calendar` - Get all bookings
- `GET /api/calendar/:id` - Get booking by ID
- `POST /api/calendar` - Create booking
- `PUT /api/calendar/:id` - Update booking
- `DELETE /api/calendar/:id` - Delete booking
- `POST /api/calendar/register` - Register booking (seems duplicate)
- `POST /api/calendar/login` - Login booking (seems duplicate/incorrect)

**Note**: The `register` and `login` endpoints in calendar router seem incorrect - they should probably be removed.

---

## 🚕 Drivers (`/api/drivers`)

### ✅ Available Endpoints (all require `authorize` + `driverMiddleware`):

- `POST /api/drivers/register` - Register as driver
- `POST /api/drivers/available` - Toggle driver availability
- `POST /api/drivers/location` - Update driver location
- `GET /api/drivers/nearby-rides` - Get nearby ride requests
- `PUT /api/drivers/ride/:rideId/accept` - Accept a ride
- `PUT /api/drivers/ride/:rideId/start` - Start a ride
- `PUT /api/drivers/ride/:rideId/complete` - Complete a ride
- `GET /api/drivers/earnings` - Get driver earnings

---

## 📜 History (`/api/history`)

### ✅ Available Endpoints (all require `authorize` middleware):

- `GET /api/history` - Get all history
- `GET /api/history/type/:type` - Get history by type
- `GET /api/history/:id` - Get history by ID
- `POST /api/history` - Create history entry
- `DELETE /api/history/:id` - Delete history entry

---

## 💳 Payments (`/api/payments`)

### ✅ Available Endpoints (no auth required):

- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

---

## 💰 Wallet (`/api/wallet`)

### ✅ Available Endpoints (all require `authorize` middleware):

- `GET /api/wallet` - Get wallet
- `GET /api/wallet/transactions` - Get wallet transactions
- `POST /api/wallet/add` - Add funds to wallet
- `POST /api/wallet/withdraw` - Withdraw funds from wallet

---

## ⭐ Reviews (`/api/reviews`)

### ✅ Available Endpoints:

**Public:**

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/ride/:rideId` - Get reviews by ride
- `GET /api/reviews/driver/:driverId` - Get reviews by driver
- `GET /api/reviews/:id` - Get review by ID

**Authenticated (require `authorize` middleware):**

- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

---

## 🔔 Notifications (`/api/notifications`)

### ✅ Available Endpoints:

**Public:**

- `POST /api/notifications` - Create notification

**Authenticated (require `authorize` middleware):**

- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread/count` - Get unread notification count
- `GET /api/notifications/:id` - Get notification by ID
- `PUT /api/notifications/:id` - Update notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read/all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

---

## 🛠️ Services (`/api/services`)

### ✅ Available Endpoints (no auth required):

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

---

## 🔑 Authentication Middleware

The backend uses an `authorize` middleware that:

- Checks for `Authorization: Bearer <token>` header
- Verifies JWT token
- Attaches user info to `req.user` (via `CustomRequest`)

**JWT Token Structure:**

```json
{
  "id": "user_mongodb_id",
  "role": "user"
}
```

---

## 📝 Frontend-Backend Mismatches

### 1. Missing `/api/users/me` endpoint

- **Frontend**: `api/profile.ts` tries to call `/users/me` first, then falls back to decoding token
- **Backend**: No `/me` endpoint exists
- **Recommendation**: Add `getCurrentUser` controller and route `GET /api/users/me` with `authorize` middleware

### 2. Login Response Format

- **Backend returns**: `{ token }`
- **Frontend expects**: `{ token }` ✅ (matches)

### 3. Register Response Format

- **Backend returns**: `{ message, user: { id, email, name }, token }`
- **Frontend expects**: Similar format ✅ (matches)

### 4. User Profile Fields

- **Backend model**: Uses PascalCase (Email, Name, etc.)
- **Frontend**: Uses PascalCase ✅ (matches)

---

## 🚀 Socket.io Events

The backend also supports real-time features via Socket.io:

- `updateLocation` - Driver location updates
- `driverLocation` - Broadcast driver location to ride room
- `joinRide` - Join a ride room
- `leaveRide` - Leave a ride room

---

## 📌 Notes

1. Most endpoints that require authentication use the `authorize` middleware
2. Driver-specific endpoints require both `authorize` and `driverMiddleware`
3. The backend uses MongoDB with Mongoose
4. JWT tokens expire after 1 hour
5. Password hashing uses bcrypt with salt rounds of 10
