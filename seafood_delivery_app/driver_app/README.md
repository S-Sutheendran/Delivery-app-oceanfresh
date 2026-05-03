# OceanFresh Driver App

Flutter mobile application for OceanFresh delivery drivers. Handles order pickup, live GPS tracking, route optimisation, delivery confirmation with photo proof, and earnings management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Flutter 3.x (Dart ≥ 3.2) |
| State Management | Provider 6.x (ChangeNotifier) |
| Auth | Firebase Auth (Phone + OTP) |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Maps & Location | flutter_map + geolocator + latlong2 |
| Secure Storage | flutter_secure_storage |
| Image | image_picker + flutter_image_compress |
| Networking | http |
| Persistence | shared_preferences |

---

## Getting Started

### Prerequisites
- Flutter SDK ≥ 3.2
- Firebase project with Authentication (Phone) and Cloud Messaging enabled
- `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) placed in the appropriate platform directories

### Run

```bash
cd driver_app
flutter pub get
flutter run
```

### Build

```bash
flutter build apk --release          # Android APK
flutter build appbundle --release    # Android App Bundle
flutter build ios --release          # iOS
```

---

## Project Structure

```
lib/
├── main.dart                         # App entry, Firebase init, MultiProvider setup
├── config/
│   ├── app_routes.dart               # All named routes + slide transition builder
│   ├── theme.dart                    # DriverTheme colour constants and MaterialTheme
│   └── constants.dart                # AppConstants (onboarding step labels, etc.)
├── providers/
│   ├── auth_provider.dart            # Phone auth, OTP verify, session state
│   ├── location_provider.dart        # GPS fetch, live tracking start/stop
│   ├── order_provider.dart           # Load assigned orders, route optimisation
│   ├── delivery_provider.dart        # Delivery photo upload, confirm delivery
│   └── onboarding_provider.dart      # Step navigation, form data collection
├── models/
│   ├── assigned_order_model.dart     # Order data (orderId, customerName, address, coords)
│   ├── driver_model.dart             # Driver profile (name, vehicle, zone, status)
│   └── route_stop_model.dart         # Optimised stop (order, sequence, ETA)
├── services/
│   ├── driver_api_service.dart       # REST calls (orders, status updates, profile)
│   ├── fcm_service.dart              # FCM init, background/foreground message handling
│   ├── image_upload_service.dart     # Compress + multipart upload of delivery photo
│   ├── location_service.dart         # Platform location permissions + stream
│   ├── route_optimizer.dart          # Nearest-neighbour route sort from current position
│   └── secure_storage_service.dart   # Token read/write via flutter_secure_storage
├── screens/
│   ├── auth/
│   │   ├── splash_screen.dart        # Auto-route on auth state
│   │   ├── phone_auth_screen.dart    # Country picker + phone number entry
│   │   └── otp_verification_screen.dart  # 6-digit OTP with pin_code_fields
│   ├── onboarding/
│   │   ├── onboarding_shell.dart     # Step host with progress bar
│   │   ├── step1_personal_details.dart
│   │   ├── step2_vehicle_details.dart
│   │   ├── step3_document_details.dart
│   │   ├── step4_photo_uploads.dart
│   │   └── onboarding_complete_screen.dart
│   ├── home/
│   │   └── home_screen.dart          # Order cards, online/offline toggle, pull-to-refresh
│   ├── delivery/
│   │   ├── active_delivery_screen.dart  # Live map, route stops, status actions
│   │   └── delivery_photo_screen.dart   # Camera capture + upload + confirm
│   ├── profile/
│   │   └── profile_screen.dart       # Driver profile, earnings summary, settings
│   └── reviews/
│       └── driver_reviews_screen.dart  # Customer ratings and review list
└── widgets/
    ├── order_card.dart               # Swipeable order summary card
    ├── route_stop_tile.dart          # Individual stop row in active delivery
    └── status_toggle.dart            # Online/offline toggle switch
```

---

## Screen-by-Screen Flow

### 1. Splash (`/`)
- Checks stored auth token via `SecureStorageService`
- If valid session → `/home`
- If new user → `/auth/phone`

---

### 2. Authentication

**Phone Auth (`/auth/phone`)**
- Country code picker with flag (country_code_picker)
- Phone number field with validation
- Submits to Firebase Auth `verifyPhoneNumber`
- On code sent → navigates to OTP screen passing `verificationId`

**OTP Verification (`/auth/otp`)**
- 6-digit PIN field with auto-advance (pin_code_fields)
- Resend OTP with 60-second countdown
- On success → `AuthProvider` fetches driver profile from backend
- New driver (no profile) → `/onboarding`
- Returning driver → `/home`

---

### 3. Onboarding (`/onboarding`)
4-step wizard managed by `OnboardingProvider`. Progress bar shows current step.

| Step | Screen | Fields |
|---|---|---|
| 1 | Personal Details | Full name, date of birth, emergency contact |
| 2 | Vehicle Details | Vehicle type, registration number, make/model, year |
| 3 | Document Details | Driving licence number, expiry, Aadhaar/PAN number |
| 4 | Photo Uploads | Profile photo, licence front/back, vehicle photo |

Step 4 uses `image_picker` for camera or gallery. Images are compressed via `flutter_image_compress` before upload.

On submit → API creates driver profile → `/onboarding/done`

**Onboarding Complete (`/onboarding/done`)**
- Success confirmation screen
- "Go to Dashboard" → `/home`
- Note: account requires admin approval before orders are assigned

---

### 4. Home (`/home`)
Main dashboard shown to approved, active drivers.

- **Header:** Driver name, avatar, earnings today, total deliveries
- **Online/Offline toggle:** `StatusToggle` widget calls `LocationProvider` to start/stop GPS broadcasting; backend marks driver availability
- **Assigned orders:** Horizontal page-view of `OrderCard` widgets (smooth_page_indicator for dots)
- **Pull to refresh:** Reloads orders and re-runs route optimisation from current GPS position
- **Route optimisation:** `RouteOptimizer.sort(orders, currentPosition)` uses nearest-neighbour algorithm to reorder stops
- Tapping an order card navigates to `/delivery/active` with `orderId` as route argument

---

### 5. Active Delivery (`/delivery/active`)
Opened via `onGenerateRoute` with a slide-in transition.

- **Map:** `flutter_map` with OpenStreetMap tiles, driver position marker, delivery target marker
- **Live tracking:** `LocationProvider.startTracking(orderId, deliveryTarget)` streams GPS updates to backend every 5 seconds
- **Route stops list:** `RouteStopTile` rows showing sequence, address, ETA
- **Status action buttons:**
  - **Mark Picked Up** — calls `DriverApiService.updateOrderStatus(orderId, 'picked_up')`, shows snackbar confirmation
  - **Mark In Transit** — calls status update to `in_transit`
  - **Complete Delivery** — navigates to `/delivery/photo` for proof capture
- Tracking stops (`LocationProvider.stopTracking()`) when screen is disposed

---

### 6. Delivery Photo (`/delivery/photo`)
Requires `orderId` as route argument.

- Camera capture using rear camera at 80% quality via `image_picker`
- Photo preview with "Retake" option
- **Upload & Confirm:**
  1. `ImageUploadService` compresses and multipart-uploads photo
  2. `DeliveryProvider.confirmDelivery(orderId)` marks order `delivered`
  3. Updates `OrderProvider` local state
  4. Optionally requests a customer review (one-tap after delivery confirmation)
- On success → returns to Home with order removed from queue

---

### 7. Profile (`/profile`)
- Driver details: name, phone, vehicle, assigned zone
- Earnings summary: today, this week, this month
- Payout history and pending payout request
- Edit profile fields
- Logout (clears secure storage, navigates to `/auth/phone`)

---

### 8. My Reviews (`/reviews`)
- List of customer ratings with star display
- Filter by rating (1–5 stars)
- Average rating shown in header
- Individual review cards with order reference and date

---

## Order Status Flow (Driver Perspective)

```
[Admin] pending → confirmed → packed
                                 ↓
[Driver]                     picked_up → in_transit → delivered
```

Drivers only see orders in `packed` or later state. Each status transition is a separate API call (`DriverApiService.updateOrderStatus`). Admins can see these updates in real-time in the admin panel.

---

## Providers

| Provider | Responsibility |
|---|---|
| `AuthProvider` | Firebase phone auth, driver model, login/logout |
| `LocationProvider` | One-shot position fetch, continuous tracking stream, start/stop |
| `OrderProvider` | Fetch assigned orders, local status updates, route sort |
| `DeliveryProvider` | Photo upload, delivery confirmation, error state |
| `OnboardingProvider` | Step index, form data across all 4 steps, submit |

---

## Services

| Service | Responsibility |
|---|---|
| `DriverApiService` | All REST calls: orders list, status update, profile CRUD |
| `FcmService` | FCM init, foreground/background message handlers, order assignment notifications |
| `ImageUploadService` | Compress image, build multipart form, POST to upload endpoint |
| `LocationService` | Request location permission, return Geolocator position stream |
| `RouteOptimizer` | Sort `AssignedOrder` list by nearest-neighbour from current `LatLng` |
| `SecureStorageService` | Read/write auth token, driver ID from encrypted storage |

---

## Push Notifications

New order assignments and cancellations are delivered via FCM. `FcmService.init()` is called at startup before `runApp`. Background messages are handled via `@pragma('vm:entry-point')` top-level handler. Foreground messages show an in-app banner. Tapping an order notification navigates to `/delivery/active` with the relevant `orderId`.

---

## Permissions Required

| Permission | Purpose |
|---|---|
| Location (fine + background) | Live delivery tracking |
| Camera | Delivery photo proof |
| Storage / Photos | Image picker gallery access |
| Notifications | FCM order assignment alerts |
