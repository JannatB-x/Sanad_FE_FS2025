# Backend Routes and Controllers Review

## Executive Summary

This document provides a comprehensive review of all routes and controllers in the `Sanad_BE_FS2025` backend codebase, identifying implemented endpoints, missing routes, security issues, and inconsistencies.

**Review Date**: Based on current codebase state  
**Backend Server**: `http://134.122.96.197:3000`  
**Base API Path**: `/api`

---

## Table of Contents

1. [Route Registration Overview](#route-registration-overview)
2. [Detailed Route Analysis](#detailed-route-analysis)
3. [Controller Analysis](#controller-analysis)
4. [Security Issues](#security-issues)
5. [Missing Routes](#missing-routes)
6. [Inconsistencies](#inconsistencies)
7. [Recommendations](#recommendations)

---

## Route Registration Overview

### Registered Routes in `app.ts`

All routes are properly registered in `src/app.ts`:

```typescript
app.use("/api/users", userRouter);
app.use("/api/rides", rideRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/services", serviceRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/history", historyRouter);
```

✅ **Status**: All routes are properly registered.

---

## Detailed Route Analysis

### 1. User Routes (`/api/users`)

**File**: `src/routes/user.router.ts`

#### Implemented Routes

| Method | Endpoint    | Middleware  | Controller          | Status                  |
| ------ | ----------- | ----------- | ------------------- | ----------------------- |
| POST   | `/register` | None        | `registerUser`      | ✅                      |
| POST   | `/login`    | None        | `loginUser`         | ✅                      |
| GET    | `/me`       | `authorize` | `getCurrentUser`    | ✅                      |
| PUT    | `/me`       | `authorize` | `updateCurrentUser` | ✅                      |
| GET    | `/profile`  | `authorize` | `getCurrentUser`    | ✅ (duplicate of `/me`) |
| PUT    | `/profile`  | `authorize` | `updateCurrentUser` | ✅ (duplicate of `/me`) |
| GET    | `/`         | None        | `getAllUsers`       | ⚠️ **No auth**          |
| GET    | `/:id`      | None        | `getUserById`       | ⚠️ **No auth**          |
| POST   | `/`         | `authorize` | `createUser`        | ✅                      |
| PUT    | `/:id`      | `authorize` | `updateUser`        | ✅                      |
| DELETE | `/:id`      | `authorize` | `deleteUser`        | ✅                      |

#### Issues

1. ⚠️ **Security**: `GET /api/users` and `GET /api/users/:id` have **no authorization middleware** - anyone can access all users
2. ⚠️ **Duplicate Routes**: `/me` and `/profile` are duplicates (both call same controllers)
3. ❌ **Missing File Upload Routes**: Controllers exist but routes are not registered:
   - `POST /api/users/me/avatar` - `uploadAvatar` controller exists
   - `POST /api/users/me/documents` - `uploadDocuments` controller exists
   - `DELETE /api/users/me/avatar` - `deleteAvatar` controller exists
   - `DELETE /api/users/me/documents/:documentId` - `deleteDocument` controller exists

#### Controllers Available (Not Routed)

From `user.controller.ts`:

- ✅ `uploadAvatar` - **Not in router**
- ✅ `uploadDocuments` - **Not in router**
- ✅ `deleteAvatar` - **Not in router**
- ✅ `deleteDocument` - **Not in router**

---

### 2. Ride Routes (`/api/rides`)

**File**: `src/routes/ride.router.ts`

#### Implemented Routes

| Method | Endpoint                   | Middleware  | Controller              | Status                |
| ------ | -------------------------- | ----------- | ----------------------- | --------------------- |
| GET    | `/`                        | None        | `getAllRides`           | ⚠️ **No auth**        |
| GET    | `/:id`                     | None        | `getRideById`           | ⚠️ **No auth**        |
| GET    | `/history/all`             | `authorize` | `getRideHistory`        | ✅                    |
| GET    | `/upcoming/index`          | `authorize` | `getUpcomingRides`      | ✅                    |
| GET    | `/:rideId/driver/location` | `authorize` | `getDriverLocation`     | ⚠️ **Route conflict** |
| POST   | `/request`                 | `authorize` | `requestRide`           | ✅                    |
| POST   | `/estimate`                | `authorize` | `estimateFare`          | ✅                    |
| PUT    | `/:rideId/cancel`          | `authorize` | `cancelRide`            | ⚠️ **Route conflict** |
| PUT    | `/:rideId/dropoff`         | `authorize` | `updateDropoffLocation` | ⚠️ **Route conflict** |
| POST   | `/`                        | `authorize` | `createRide`            | ✅                    |
| PUT    | `/:id`                     | `authorize` | `updateRide`            | ⚠️ **Route conflict** |
| DELETE | `/:id`                     | `authorize` | `deleteRide`            | ⚠️ **Route conflict** |

#### Issues

1. ⚠️ **Route Conflicts**: The following routes have potential conflicts:

   - `GET /:id` vs `GET /:rideId/driver/location` - Express will match `/:id` first
   - `PUT /:id` vs `PUT /:rideId/cancel` - Express will match `/:id` first
   - `PUT /:id` vs `PUT /:rideId/dropoff` - Express will match `/:id` first
   - `DELETE /:id` - No conflict but should be more specific

2. ⚠️ **Security**: `GET /api/rides` and `GET /api/rides/:id` have **no authorization** - anyone can see all rides

3. ✅ **Route Order**: Specific routes (`/history/all`, `/upcoming/index`, `/request`, `/estimate`) are correctly placed before `/:id` route

---

### 3. Driver Routes (`/api/drivers`)

**File**: `src/routes/driver.router.ts`

#### Implemented Routes

| Method | Endpoint                 | Middleware                      | Controller           | Status |
| ------ | ------------------------ | ------------------------------- | -------------------- | ------ |
| POST   | `/register`              | `authorize`                     | `registerDriver`     | ✅     |
| POST   | `/available`             | `authorize`, `driverMiddleware` | `toggleAvailability` | ✅     |
| POST   | `/location`              | `authorize`, `driverMiddleware` | `updateLocation`     | ✅     |
| GET    | `/nearby-rides`          | `authorize`, `driverMiddleware` | `getNearbyRides`     | ✅     |
| PUT    | `/ride/:rideId/accept`   | `authorize`, `driverMiddleware` | `acceptRide`         | ✅     |
| PUT    | `/ride/:rideId/start`    | `authorize`, `driverMiddleware` | `startRide`          | ✅     |
| PUT    | `/ride/:rideId/complete` | `authorize`, `driverMiddleware` | `completeRide`       | ✅     |
| GET    | `/earnings`              | `authorize`, `driverMiddleware` | `getEarnings`        | ✅     |

#### Issues

1. ❌ **Missing File Upload Routes**: Controllers exist but routes are not registered:
   - `POST /api/drivers/license` - `uploadLicense` controller exists
   - `POST /api/drivers/documents` - `uploadDocuments` controller exists
   - `DELETE /api/drivers/license` - `deleteLicense` controller exists
   - `DELETE /api/drivers/documents/:documentId` - `deleteDocument` controller exists

#### Controllers Available (Not Routed)

From `driver.controller.ts`:

- ✅ `uploadLicense` - **Not in router**
- ✅ `uploadDocuments` - **Not in router**
- ✅ `deleteLicense` - **Not in router**
- ✅ `deleteDocument` - **Not in router**

---

### 4. Calendar Routes (`/api/calendar`)

**File**: `src/routes/calendar.router.ts`

#### Implemented Routes

| Method | Endpoint    | Middleware | Controller        | Status                                         |
| ------ | ----------- | ---------- | ----------------- | ---------------------------------------------- |
| GET    | `/`         | None       | `getBookings`     | ⚠️ **No auth, but has manual check**           |
| GET    | `/:id`      | None       | `getBookingById`  | ⚠️ **No auth**                                 |
| POST   | `/`         | None       | `createBooking`   | ⚠️ **No auth, but has manual check**           |
| PUT    | `/:id`      | None       | `updateBooking`   | ⚠️ **No auth, but has manual check**           |
| DELETE | `/:id`      | None       | `deleteBooking`   | ⚠️ **No auth, but has manual check**           |
| POST   | `/register` | None       | `registerBooking` | ⚠️ **Incorrect - should be user registration** |
| POST   | `/login`    | None       | `loginBooking`    | ⚠️ **Incorrect - should be user login**        |

#### Issues

1. ⚠️ **Security**: Most routes have **no authorization middleware**, but controllers have manual role checks:

   - `getBookings` checks for `role != "author"` (should use `authorize` middleware)
   - `createBooking` checks for `role != "booking"` (should use `authorize` middleware)
   - `updateBooking` checks for `role != "booking"` (should use `authorize` middleware)
   - `deleteBooking` checks for `role != "booking"` (should use `authorize` middleware)

2. ❌ **Incorrect Routes**: `/register` and `/login` endpoints in calendar router are **wrong**:

   - These should be in user router, not calendar router
   - Calendar bookings should not have their own authentication

3. ⚠️ **Inconsistent Auth**: Manual role checks in controllers instead of using middleware

---

### 5. Payment Routes (`/api/payments`)

**File**: `src/routes/payment.router.ts`

#### Implemented Routes

| Method | Endpoint | Middleware | Controller       | Status         |
| ------ | -------- | ---------- | ---------------- | -------------- |
| GET    | `/`      | None       | `getAllPayments` | ⚠️ **No auth** |
| GET    | `/:id`   | None       | `getPaymentById` | ⚠️ **No auth** |
| POST   | `/`      | None       | `createPayment`  | ⚠️ **No auth** |
| PUT    | `/:id`   | None       | `updatePayment`  | ⚠️ **No auth** |
| DELETE | `/:id`   | None       | `deletePayment`  | ⚠️ **No auth** |

#### Issues

1. ⚠️ **Security**: **ALL payment routes have no authorization** - critical security issue
2. ❌ **Missing Routes**: Controllers exist but routes are not registered:
   - `POST /api/payments/process` - `processPayment` controller exists
   - `POST /api/payments/callback` - `paymentCallback` controller exists

#### Controllers Available (Not Routed)

From `payment.controller.ts`:

- ✅ `processPayment` - **Not in router**
- ✅ `paymentCallback` - **Not in router**

---

### 6. Service Routes (`/api/services`)

**File**: `src/routes/service.router.ts`

#### Implemented Routes

| Method | Endpoint | Middleware | Controller       | Status         |
| ------ | -------- | ---------- | ---------------- | -------------- |
| GET    | `/`      | None       | `getAllServices` | ⚠️ **No auth** |
| GET    | `/:id`   | None       | `getServiceById` | ⚠️ **No auth** |
| POST   | `/`      | None       | `createService`  | ⚠️ **No auth** |
| PUT    | `/:id`   | None       | `updateService`  | ⚠️ **No auth** |
| DELETE | `/:id`   | None       | `deleteService`  | ⚠️ **No auth** |

#### Issues

1. ⚠️ **Security**: **ALL service routes have no authorization** - anyone can create/update/delete services

---

### 7. Review Routes (`/api/reviews`)

**File**: `src/routes/review.router.ts`

#### Implemented Routes

| Method | Endpoint            | Middleware  | Controller           | Status      |
| ------ | ------------------- | ----------- | -------------------- | ----------- |
| GET    | `/`                 | None        | `getAllReviews`      | ✅ (public) |
| GET    | `/ride/:rideId`     | None        | `getReviewsByRide`   | ✅ (public) |
| GET    | `/driver/:driverId` | None        | `getReviewsByDriver` | ✅ (public) |
| GET    | `/:id`              | None        | `getReviewById`      | ✅ (public) |
| POST   | `/`                 | `authorize` | `createReview`       | ✅          |
| PUT    | `/:id`              | `authorize` | `updateReview`       | ✅          |
| DELETE | `/:id`              | `authorize` | `deleteReview`       | ✅          |

#### Issues

1. ✅ **Good**: Public read routes, protected write routes - correct pattern

---

### 8. Notification Routes (`/api/notifications`)

**File**: `src/routes/notification.router.ts`

#### Implemented Routes

| Method | Endpoint        | Middleware  | Controller            | Status                |
| ------ | --------------- | ----------- | --------------------- | --------------------- |
| GET    | `/`             | `authorize` | `getAllNotifications` | ✅                    |
| GET    | `/unread/count` | `authorize` | `getUnreadCount`      | ✅                    |
| GET    | `/:id`          | `authorize` | `getNotificationById` | ⚠️ **Route conflict** |
| POST   | `/`             | None        | `createNotification`  | ⚠️ **No auth**        |
| PUT    | `/:id`          | `authorize` | `updateNotification`  | ⚠️ **Route conflict** |
| PUT    | `/:id/read`     | `authorize` | `markAsRead`          | ⚠️ **Route conflict** |
| PUT    | `/read/all`     | `authorize` | `markAllAsRead`       | ✅                    |
| DELETE | `/:id`          | `authorize` | `deleteNotification`  | ⚠️ **Route conflict** |

#### Issues

1. ⚠️ **Route Conflicts**: `GET /:id` will match before `/unread/count` - but `/unread/count` is correctly placed first
2. ⚠️ **Security**: `POST /api/notifications` has **no authorization** - anyone can create notifications
3. ⚠️ **Route Order**: `PUT /:id/read` should be before `PUT /:id` to avoid conflicts

---

### 9. Wallet Routes (`/api/wallet`)

**File**: `src/routes/wallet.router.ts`

#### Implemented Routes

| Method | Endpoint        | Middleware  | Controller        | Status |
| ------ | --------------- | ----------- | ----------------- | ------ |
| GET    | `/`             | `authorize` | `getWallet`       | ✅     |
| GET    | `/transactions` | `authorize` | `getTransactions` | ✅     |
| POST   | `/add`          | `authorize` | `addFunds`        | ✅     |
| POST   | `/withdraw`     | `authorize` | `withdrawFunds`   | ✅     |

#### Issues

1. ✅ **Good**: All routes properly protected with authorization

---

### 10. History Routes (`/api/history`)

**File**: `src/routes/history.router.ts`

#### Implemented Routes

| Method | Endpoint      | Middleware  | Controller         | Status                |
| ------ | ------------- | ----------- | ------------------ | --------------------- |
| GET    | `/`           | `authorize` | `getAllHistory`    | ✅                    |
| GET    | `/type/:type` | `authorize` | `getHistoryByType` | ✅                    |
| GET    | `/:id`        | `authorize` | `getHistoryById`   | ⚠️ **Route conflict** |
| POST   | `/`           | `authorize` | `createHistory`    | ✅                    |
| DELETE | `/:id`        | `authorize` | `deleteHistory`    | ✅                    |

#### Issues

1. ⚠️ **Route Conflict**: `GET /type/:type` is correctly placed before `GET /:id`, so no conflict
2. ✅ **Good**: All routes properly protected

---

## Controller Analysis

### Controllers with Missing Routes

The following controllers exist but are **NOT connected to routes**:

#### User Controllers (Missing Routes)

- `uploadAvatar` - Should be `POST /api/users/me/avatar`
- `uploadDocuments` - Should be `POST /api/users/me/documents`
- `deleteAvatar` - Should be `DELETE /api/users/me/avatar`
- `deleteDocument` - Should be `DELETE /api/users/me/documents/:documentId`

#### Driver Controllers (Missing Routes)

- `uploadLicense` - Should be `POST /api/drivers/license`
- `uploadDocuments` - Should be `POST /api/drivers/documents`
- `deleteLicense` - Should be `DELETE /api/drivers/license`
- `deleteDocument` - Should be `DELETE /api/drivers/documents/:documentId`

#### Payment Controllers (Missing Routes)

- `processPayment` - Should be `POST /api/payments/process`
- `paymentCallback` - Should be `POST /api/payments/callback`

---

## Security Issues

### Critical Security Issues

1. 🔴 **Payment Routes Unprotected** (`/api/payments/*`)

   - All payment routes have no authorization
   - Anyone can create, update, delete payments
   - **Risk**: Financial data exposure, unauthorized transactions

2. 🔴 **Service Routes Unprotected** (`/api/services/*`)

   - All service routes have no authorization
   - Anyone can create, update, delete services
   - **Risk**: Service manipulation, data corruption

3. 🟡 **User Routes Partially Unprotected**

   - `GET /api/users` - Anyone can list all users
   - `GET /api/users/:id` - Anyone can view any user profile
   - **Risk**: Privacy violation, user data exposure

4. 🟡 **Ride Routes Partially Unprotected**

   - `GET /api/rides` - Anyone can list all rides
   - `GET /api/rides/:id` - Anyone can view any ride details
   - **Risk**: Privacy violation, location data exposure

5. 🟡 **Calendar Routes Inconsistent Auth**

   - Routes have no middleware but controllers have manual checks
   - Manual checks can be bypassed if middleware is added later
   - **Risk**: Inconsistent security, potential bypass

6. 🟡 **Notification Creation Unprotected**
   - `POST /api/notifications` - Anyone can create notifications
   - **Risk**: Spam, notification abuse

---

## Missing Routes

### File Upload Routes (Controllers Exist)

#### User File Uploads

```
POST   /api/users/me/avatar
POST   /api/users/me/documents
DELETE /api/users/me/avatar
DELETE /api/users/me/documents/:documentId
```

#### Driver File Uploads

```
POST   /api/drivers/license
POST   /api/drivers/documents
DELETE /api/drivers/license
DELETE /api/drivers/documents/:documentId
```

### Payment Processing Routes (Controllers Exist)

```
POST /api/payments/process
POST /api/payments/callback
```

---

## Inconsistencies

### 1. Route Naming Conventions

- ✅ **Consistent**: Most routes use RESTful conventions
- ⚠️ **Inconsistent**: Some routes use action verbs (`/request`, `/estimate`, `/cancel`)
- ⚠️ **Inconsistent**: Some routes use nouns (`/earnings`, `/transactions`)

### 2. Authorization Patterns

- ✅ **Good**: Most routes use `authorize` middleware consistently
- ⚠️ **Bad**: Calendar routes use manual role checks instead of middleware
- ⚠️ **Bad**: Some routes have no authorization at all

### 3. Response Formats

- ⚠️ **Inconsistent**: Some controllers return `{ message, data }`, others return just `data`
- ⚠️ **Inconsistent**: Error responses vary between controllers

### 4. Route Ordering

- ✅ **Good**: Most routers place specific routes before parameterized routes
- ⚠️ **Issue**: Some routers have potential route conflicts (rides, notifications)

---

## Recommendations

### Priority 1: Critical Security Fixes

1. **Add Authorization to Payment Routes**

   ```typescript
   // In payment.router.ts
   router.get("/", authorize, getAllPayments);
   router.get("/:id", authorize, getPaymentById);
   router.post("/", authorize, createPayment);
   router.put("/:id", authorize, updatePayment);
   router.delete("/:id", authorize, deletePayment);
   ```

2. **Add Authorization to Service Routes**

   ```typescript
   // In service.router.ts
   router.get("/", authorize, getAllServices); // Or make public if needed
   router.get("/:id", authorize, getServiceById); // Or make public if needed
   router.post("/", authorize, createService);
   router.put("/:id", authorize, updateService);
   router.delete("/:id", authorize, deleteService);
   ```

3. **Add Authorization to User List Routes**

   ```typescript
   // In user.router.ts
   router.get("/", authorize, getAllUsers); // Or restrict to admin
   router.get("/:id", authorize, getUserById); // Or restrict to admin/self
   ```

4. **Add Authorization to Ride List Routes**

   ```typescript
   // In ride.router.ts
   router.get("/", authorize, getAllRides); // Or restrict to admin
   router.get("/:id", authorize, getRideById); // Or restrict to participant
   ```

5. **Fix Calendar Routes**
   ```typescript
   // In calendar.router.ts
   // Remove /register and /login (these don't belong here)
   // Add authorize middleware to all routes
   router.get("/", authorize, getBookings);
   router.post("/", authorize, createBooking);
   // etc.
   ```

### Priority 2: Add Missing Routes

1. **Add File Upload Routes to User Router**

   ```typescript
   // In user.router.ts
   import { upload } from "../config/multer";
   import {
     uploadAvatar,
     uploadDocuments,
     deleteAvatar,
     deleteDocument,
   } from "../controllers/user.controller";

   router.post("/me/avatar", authorize, upload.single("avatar"), uploadAvatar);
   router.post(
     "/me/documents",
     authorize,
     upload.array("documents"),
     uploadDocuments
   );
   router.delete("/me/avatar", authorize, deleteAvatar);
   router.delete("/me/documents/:documentId", authorize, deleteDocument);
   ```

2. **Add File Upload Routes to Driver Router**

   ```typescript
   // In driver.router.ts
   import { upload } from "../config/multer";
   import {
     uploadLicense,
     uploadDocuments,
     deleteLicense,
     deleteDocument,
   } from "../controllers/driver.controller";

   router.post(
     "/license",
     authorize,
     driverMiddleware,
     upload.single("license"),
     uploadLicense
   );
   router.post(
     "/documents",
     authorize,
     driverMiddleware,
     upload.array("documents"),
     uploadDocuments
   );
   router.delete("/license", authorize, driverMiddleware, deleteLicense);
   router.delete(
     "/documents/:documentId",
     authorize,
     driverMiddleware,
     deleteDocument
   );
   ```

3. **Add Payment Processing Routes**

   ```typescript
   // In payment.router.ts
   import {
     processPayment,
     paymentCallback,
   } from "../controllers/payment.controller";

   router.post("/process", authorize, processPayment);
   router.post("/callback", paymentCallback); // May not need auth for webhook
   ```

### Priority 3: Fix Route Conflicts

1. **Fix Ride Router Conflicts**

   ```typescript
   // Move specific routes before parameterized routes
   router.get("/history/all", authorize, getRideHistory);
   router.get("/upcoming/index", authorize, getUpcomingRides);
   router.get("/:rideId/driver/location", authorize, getDriverLocation);
   router.post("/request", authorize, requestRide);
   router.post("/estimate", authorize, estimateFare);
   router.put("/:rideId/cancel", authorize, cancelRide);
   router.put("/:rideId/dropoff", authorize, updateDropoffLocation);
   // Then general routes
   router.get("/", getAllRides);
   router.get("/:id", getRideById);
   router.post("/", authorize, createRide);
   router.put("/:id", authorize, updateRide);
   router.delete("/:id", authorize, deleteRide);
   ```

2. **Fix Notification Router Conflicts**
   ```typescript
   // Ensure specific routes come first
   router.get("/unread/count", authorize, getUnreadCount);
   router.put("/read/all", authorize, markAllAsRead);
   router.put("/:id/read", authorize, markAsRead); // Before /:id
   // Then parameterized routes
   router.get("/:id", authorize, getNotificationById);
   router.put("/:id", authorize, updateNotification);
   router.delete("/:id", authorize, deleteNotification);
   ```

### Priority 4: Code Quality Improvements

1. **Standardize Response Formats**

   - Create a response utility function
   - Ensure all controllers return consistent format: `{ message, data }`

2. **Remove Duplicate Routes**

   - Remove `/profile` routes from user router (use `/me` instead)

3. **Remove Incorrect Routes**

   - Remove `/register` and `/login` from calendar router

4. **Add Route Documentation**
   - Add JSDoc comments to all routes
   - Document expected request/response formats

---

## Summary Statistics

### Route Coverage

- **Total Routes**: ~60+ routes
- **Protected Routes**: ~35 routes (58%)
- **Unprotected Routes**: ~25 routes (42%)
- **Missing Routes**: 10 routes (file uploads + payment processing)

### Security Score

- 🔴 **Critical Issues**: 2 (Payment, Service routes)
- 🟡 **Medium Issues**: 4 (User, Ride, Calendar, Notification routes)
- ✅ **Well Protected**: 4 routers (Review, Wallet, History, Driver)

### Controller Coverage

- **Total Controllers**: ~50+ controller functions
- **Routed Controllers**: ~40 controllers (80%)
- **Unrouted Controllers**: 10 controllers (20%)

---

## Conclusion

The backend has a solid foundation with most routes properly implemented, but there are **critical security issues** that need immediate attention, particularly around payment and service routes. Additionally, several controllers exist but are not connected to routes, particularly file upload functionality.

**Immediate Action Required**:

1. Add authorization to all payment routes
2. Add authorization to all service routes
3. Add missing file upload routes
4. Fix calendar router (remove incorrect routes, add proper auth)

**Next Steps**:

1. Review and fix route conflicts
2. Standardize response formats
3. Add comprehensive route documentation
4. Implement role-based access control (RBAC) for admin routes

---

**Last Updated**: Based on review of `Sanad_BE_FS2025` codebase  
**Reviewed By**: AI Assistant  
**Next Review**: After implementing recommended fixes
