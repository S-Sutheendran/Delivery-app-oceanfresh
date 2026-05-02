# OceanFresh — Premium Seafood Delivery App

A full-stack seafood delivery application built with **Flutter + Dart** on the frontend and **Python FastAPI + PostgreSQL + Firebase** on the backend. Inspired by Swiggy, Zomato, and DoorDash — featuring WhatsApp OTP authentication, real-time cart management, and a polished ocean-themed UI.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [External Services Required](#external-services-required)
4. [Environment Variables](#environment-variables)
5. [Backend Setup](#backend-setup)
6. [Flutter App Setup](#flutter-app-setup)
7. [Running the App](#running-the-app)
8. [App Flow](#app-flow)
9. [API Reference](#api-reference)
10. [Database Schema](#database-schema)
11. [Architecture Overview](#architecture-overview)
12. [Design System](#design-system)
13. [Product Catalog](#product-catalog)
14. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
seafood_delivery_app/
│
├── flutter_app/                    # Flutter mobile application
│   ├── pubspec.yaml                # Dependencies
│   ├── android/
│   │   └── app/
│   │       └── google-services.json    # ← Place Firebase config here
│   ├── ios/
│   │   └── Runner/
│   │       └── GoogleService-Info.plist  # ← Place Firebase config here
│   └── lib/
│       ├── main.dart               # App entry point, MultiProvider setup
│       ├── config/
│       │   ├── theme.dart          # Material 3 theme, colors, typography
│       │   └── app_routes.dart     # Named routes + transition animations
│       ├── models/
│       │   ├── product.dart        # Product model with computed fields
│       │   ├── category.dart       # Category model + 9 default categories
│       │   ├── cart_item.dart      # CartItem (product + quantity)
│       │   └── user_model.dart     # UserModel (uid, phone, address)
│       ├── providers/
│       │   ├── auth_provider.dart  # Auth state, WhatsApp/SMS OTP logic
│       │   ├── cart_provider.dart  # Cart state, free delivery logic
│       │   └── product_provider.dart  # Products, search, filter, sort
│       ├── services/
│       │   └── api_service.dart    # HTTP client for FastAPI backend
│       ├── screens/
│       │   ├── auth/
│       │   │   ├── phone_auth_screen.dart      # Country code + phone input
│       │   │   └── otp_verification_screen.dart  # 6-digit OTP + resend
│       │   ├── home/
│       │   │   └── home_screen.dart  # Carousels, search, header, footer
│       │   ├── products/
│       │   │   ├── product_list_screen.dart    # Grid/list, sort, filter
│       │   │   └── product_detail_screen.dart  # Hero image, add to cart
│       │   └── cart/
│       │       └── cart_screen.dart  # Cart items, delivery fee, checkout
│       └── widgets/
│           ├── home/
│           │   ├── product_carousel.dart   # Horizontal product scroll
│           │   ├── category_carousel.dart  # Emoji category tabs
│           │   └── home_footer.dart        # App footer with links
│           ├── products/
│           │   └── product_card.dart       # Grid + list mode card
│           └── shared/
│               ├── search_filter_bar.dart  # Search + filter bottom sheet
│               └── whatsapp_fab.dart       # Pulsing WhatsApp FAB
│
└── backend/                        # Python FastAPI backend
    ├── main.py                     # FastAPI app, CORS, router registration
    ├── database.py                 # SQLAlchemy engine + session dependency
    ├── models.py                   # ORM table definitions
    ├── schemas.py                  # Pydantic request/response schemas
    ├── seed_data.py                # Seeds 100 seafood products
    ├── requirements.txt            # Python dependencies
    ├── .env.example                # Environment variable template
    └── routers/
        ├── auth.py                 # OTP send/verify (WhatsApp + SMS)
        ├── products.py             # Products + categories endpoints
        └── orders.py              # Order placement + retrieval
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Flutter | 3.32.4 | Cross-platform mobile framework |
| Dart | 3.8.1 | Programming language |
| Provider | ^6.1.4 | State management (ChangeNotifier) |
| firebase_core | ^3.6.0 | Firebase SDK initialization |
| firebase_auth | ^5.3.0 | Phone/SMS OTP authentication |
| http | ^1.2.0 | HTTP client for backend API calls |
| cached_network_image | ^3.4.1 | Image caching with placeholder/error states |
| pin_code_fields | ^8.0.1 | 6-digit animated OTP input box |
| country_code_picker | ^3.0.0 | Searchable country code dropdown (+91, +1, etc.) |
| google_fonts | ^6.2.1 | Poppins font via Google Fonts |
| url_launcher | ^6.2.3 | Open WhatsApp, call support |
| intl | ^0.19.0 | Currency formatting (₹) |
| shared_preferences | ^2.2.2 | Persist auth token locally |
| cupertino_icons | ^1.0.6 | iOS-style icon set |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Language |
| FastAPI | ^0.115 | Async REST API framework |
| Uvicorn | ^0.32 | ASGI server |
| SQLAlchemy | ^2.0 | ORM for PostgreSQL |
| Psycopg2-binary | ^2.9 | PostgreSQL driver |
| Alembic | ^1.14 | Database migrations |
| Pydantic | ^2.9 | Request/response validation |
| Twilio | ^9.3 | WhatsApp Business API + SMS |
| firebase-admin | ^6.5 | Verify Firebase Auth tokens |
| Passlib | ^1.7 | Password hashing (bcrypt) |
| python-jose | ^3.3 | JWT token generation/verification |
| httpx | ^0.27 | Async HTTP client |
| python-dotenv | ^1.0 | Load .env configuration |

### External Services

| Service | Usage |
|---|---|
| PostgreSQL 14+ | Primary relational database |
| Firebase | Phone Auth (SMS OTP fallback) |
| Twilio WhatsApp Business | Primary OTP delivery channel |
| Twilio SMS (optional) | OTP fallback if WhatsApp unavailable |
| Picsum Photos | Deterministic 400×400 product images (no API key needed) |

---

## External Services Required

### 1. PostgreSQL

**What it's used for:** Stores all app data — users, products, categories, orders, and OTP tokens.

**Installation options:**

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download installer from https://www.postgresql.org/download/windows/

# Docker (recommended for dev)
docker run --name oceanfresh-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=oceanfresh \
  -p 5432:5432 \
  -d postgres:16
```

**Create database manually (if not using Docker):**
```bash
psql -U postgres
CREATE DATABASE oceanfresh;
CREATE USER oceanfresh_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE oceanfresh TO oceanfresh_user;
\q
```

**Connection string format:**
```
postgresql://username:password@localhost:5432/oceanfresh
```

---

### 2. Firebase (for Phone Auth / SMS OTP fallback)

Firebase Phone Authentication is used as the fallback OTP channel when WhatsApp is unavailable.

**Steps:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → enter name (e.g., `OceanFresh`) → Continue
3. Disable Google Analytics if not needed → **Create project**

**Enable Phone Authentication:**
4. In the sidebar: **Authentication → Sign-in method**
5. Click **Phone** → Enable → **Save**
6. (For testing) Add test phone numbers under **Authentication → Sign-in method → Phone → Phone numbers for testing**

**Add Android app:**
7. Click the Android icon (</>) on the project overview
8. **Android package name:** `com.example.seafood_delivery`
9. Click **Register app**
10. Download `google-services.json`
11. Place it at: `flutter_app/android/app/google-services.json`

**Add iOS app (optional):**
12. Click the iOS icon on the project overview
13. **iOS bundle ID:** `com.example.seafoodDelivery`
14. Download `GoogleService-Info.plist`
15. Place it at: `flutter_app/ios/Runner/GoogleService-Info.plist`

**Get service account key for backend:**
16. In Firebase Console: **Project settings → Service accounts**
17. Click **Generate new private key** → Download JSON file
18. Set the path in your `.env`: `FIREBASE_CREDENTIALS_PATH=/path/to/serviceAccountKey.json`

---

### 3. Twilio (for WhatsApp OTP and SMS OTP)

Twilio handles OTP delivery. WhatsApp is the primary channel; SMS is the fallback.

**Get Account SID and Auth Token:**
1. Sign up at [twilio.com](https://www.twilio.com/)
2. From the [Console Dashboard](https://console.twilio.com/), copy:
   - **Account SID** → set as `TWILIO_ACCOUNT_SID`
   - **Auth Token** → set as `TWILIO_AUTH_TOKEN`

**Set up WhatsApp Business (Sandbox for testing):**
3. In Twilio Console: **Messaging → Try it out → Send a WhatsApp message**
4. Follow the instructions to join the sandbox (send a WhatsApp message to the sandbox number)
5. The sandbox number looks like: `whatsapp:+14155238886`
6. Set this as `TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886`

**Set up a Twilio SMS number (for SMS fallback):**
7. In Twilio Console: **Phone Numbers → Manage → Buy a number**
8. Choose a number with SMS capability
9. Set it as `TWILIO_SMS_NUMBER=+1XXXXXXXXXX`

**Production WhatsApp:**
- For production, you need a Twilio WhatsApp Business-approved sender
- See [Twilio WhatsApp Business](https://www.twilio.com/en-us/whatsapp/business)

---

## Environment Variables

Copy the example file and fill in your credentials:

```bash
cd backend
cp .env.example .env
```

**`.env` file reference:**

```env
# ── Database ──────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/oceanfresh

# ── Twilio ────────────────────────────────────────────────────────────────
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_SMS_NUMBER=+1XXXXXXXXXX

# ── Firebase ──────────────────────────────────────────────────────────────
FIREBASE_CREDENTIALS_PATH=/absolute/path/to/serviceAccountKey.json

# ── JWT / Security ────────────────────────────────────────────────────────
JWT_SECRET_KEY=your-very-long-random-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=24

# ── App Config ────────────────────────────────────────────────────────────
WHATSAPP_SUPPORT_NUMBER=+919999999999
OTP_EXPIRY_MINUTES=10
```

---

## Backend Setup

### Prerequisites
- Python 3.10 or higher
- PostgreSQL 14 or higher (running)
- pip

### Step-by-step

```bash
# 1. Navigate to backend directory
cd seafood_delivery_app/backend

# 2. Create a Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows (Command Prompt):
venv\Scripts\activate
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# 4. Install all Python dependencies
pip install -r requirements.txt

# 5. Copy and configure environment variables
cp .env.example .env
# Open .env and fill in DATABASE_URL, Twilio keys, Firebase path

# 6. Start the FastAPI server (this auto-creates all tables on first run)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 7. In a second terminal, run the data seeder
python seed_data.py
# Expected output: "Successfully seeded 100 products across 9 categories"

# 8. Verify everything is running
curl http://localhost:8000/health
# Expected: {"status":"healthy","database":"connected"}
```

### Verify API is working

```bash
# List all categories
curl http://localhost:8000/api/v1/categories

# List products with search
curl "http://localhost:8000/api/v1/products?search=salmon&limit=5"

# Get a specific product
curl http://localhost:8000/api/v1/products/1
```

### Running in production

```bash
# Use gunicorn with multiple workers
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## Flutter App Setup

### Prerequisites
- Flutter SDK 3.32.4 (run `flutter --version` to check)
- Android Studio or VS Code with Flutter extension
- Android emulator or physical device

### Step-by-step

```bash
# 1. Navigate to flutter app directory
cd seafood_delivery_app/flutter_app

# 2. Install Flutter dependencies (from local cache, no internet needed)
flutter pub get

# 3. Verify no code issues
flutter analyze
# Expected: "No issues found!"

# 4. Place Firebase configuration
# Android: copy google-services.json → android/app/google-services.json
# iOS:     copy GoogleService-Info.plist → ios/Runner/GoogleService-Info.plist

# 5. (Optional) Check connected devices
flutter devices

# 6. Run the app
flutter run

# For a specific device:
flutter run -d emulator-5554       # Android emulator
flutter run -d "iPhone 15 Pro"     # iOS simulator
```

### Pointing the app to your backend

Open `lib/services/api_service.dart` and update the base URL:

```dart
// Development (Android emulator — 10.0.2.2 maps to host machine's localhost)
static const String _baseUrl = 'http://10.0.2.2:8000/api/v1';

// Development (iOS simulator or physical device on same network)
static const String _baseUrl = 'http://192.168.1.x:8000/api/v1';

// Production
static const String _baseUrl = 'https://your-domain.com/api/v1';
```

### Building for release

```bash
# Android APK
flutter build apk --release

# Android App Bundle (for Play Store)
flutter build appbundle --release

# iOS (requires macOS + Xcode)
flutter build ios --release
```

---

## Running the App

### Full local development stack

**Terminal 1 — PostgreSQL (if using Docker):**
```bash
docker start oceanfresh-db
```

**Terminal 2 — FastAPI backend:**
```bash
cd seafood_delivery_app/backend
source venv/bin/activate          # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8000
```

**Terminal 3 — Flutter app:**
```bash
cd seafood_delivery_app/flutter_app
flutter run
```

**Seeder (one-time, run after backend is up):**
```bash
cd seafood_delivery_app/backend
python seed_data.py
```

**FastAPI interactive docs:**
```
http://localhost:8000/docs       # Swagger UI
http://localhost:8000/redoc      # ReDoc
```

---

## App Flow

### 1. Authentication Flow

```
App Launch
    │
    ▼
PhoneAuthScreen
    ├── User selects country code (searchable dropdown, e.g. +91 India)
    ├── User enters phone number
    └── Taps "Send OTP"
             │
             ▼
    AuthProvider.sendOtp()
             │
             ├── Calls GET /api/v1/auth/check-whatsapp?phone=+91XXXXXXXXXX
             │
             ├── WhatsApp available?
             │       YES → POST /api/v1/auth/send-whatsapp-otp
             │               → Backend sends OTP via Twilio WhatsApp
             │               → OTP stored as SHA-256 hash in PostgreSQL (10-min TTL)
             │
             └── WhatsApp NOT available?
                     → Firebase Phone Auth
                     → SMS OTP sent directly via Firebase

OtpVerificationScreen
    ├── User enters 6-digit OTP
    ├── 30-second countdown for resend
    └── Taps "Verify"
             │
             ├── WhatsApp path → POST /api/v1/auth/verify-whatsapp-otp
             │                    → Backend validates hash
             │                    → Returns JWT access token
             │
             └── SMS path → Firebase verifyPhoneNumber() locally
                            → Returns Firebase ID token

             ▼
         HomeScreen (authenticated)
```

---

### 2. Product Browsing Flow

```
HomeScreen
    ├── SliverAppBar (collapses on scroll)
    │       ├── Left: Delivery address
    │       └── Right: Cart icon with live item count badge
    │
    ├── SearchFilterBar
    │       ├── Contains-search (searches name, description, tags)
    │       └── Filter button → DraggableScrollableSheet
    │               ├── Price range slider (₹0 – ₹5000)
    │               ├── Minimum rating (1–5 stars)
    │               ├── In-stock only toggle
    │               └── Sort by (Popular / Price ↑ / Price ↓ / Rating)
    │
    ├── Promo Banner (PageView, 3 slides, auto-scroll)
    │
    ├── 🔥 Best Sellers Carousel  → [View All] → ProductListScreen(filter: bestsellers)
    ├── 🗂️ Category Carousel       → tap category → ProductListScreen(categoryId: X)
    ├── ⭐ Top Rated Carousel       → [View All] → ProductListScreen(filter: toprated)
    └── 🌿 Seasonal Picks Carousel  → [View All] → ProductListScreen(filter: seasonal)
             └── HomeFooter
                     └── WhatsAppFab (floating, pulsing, bottom-right)

ProductListScreen
    ├── AppBar with grid/list toggle + sort + cart icon
    ├── SearchFilterBar
    └── Products in grid (2 columns) or list mode
             └── Tap product → ProductDetailScreen

ProductDetailScreen
    ├── Hero image (400×400, hero animation from list)
    ├── Badges: Best Seller / Top Rated / Seasonal / Discount %
    ├── Name, origin, rating (with review count)
    ├── Price (with strikethrough original price)
    ├── Chef's tip box
    ├── Quantity selector (− qty +)
    └── "Add to Cart · ₹XXX" CTA button
```

---

### 3. Cart & Order Flow

```
CartScreen
    ├── Free delivery progress banner
    │       "Add ₹XXX more for free delivery!" (threshold: ₹500)
    │
    ├── Cart item list
    │       ├── CachedNetworkImage (400×400)
    │       ├── Name, unit, price per item
    │       ├── Quantity controls (− qty +)
    │       └── Delete button (swipe or trash icon)
    │
    ├── Order Summary
    │       ├── Subtotal: ₹XXX
    │       ├── Delivery fee: ₹49 (FREE if subtotal ≥ ₹500)
    │       └── Total: ₹XXX
    │
    └── "Place Order" button
             │
             ▼
    Confirmation dialog
             │
             ▼
    POST /api/v1/orders
    (Backend decrements stock, saves order)
             │
             ▼
    Success → Cart cleared → back to HomeScreen
```

---

## API Reference

Base URL: `http://localhost:8000/api/v1`

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

### Authentication

#### Check WhatsApp Availability

```
GET /api/v1/auth/check-whatsapp?phone=+919876543210
```

**Response:**
```json
{
  "whatsapp_available": true,
  "phone": "+919876543210"
}
```

---

#### Send WhatsApp OTP

```
POST /api/v1/auth/send-whatsapp-otp
Content-Type: application/json
```

**Request body:**
```json
{
  "phone": "+919876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent via WhatsApp",
  "expires_in": 600
}
```

**Error responses:**
```json
// 429 Too Many Requests
{ "detail": "OTP already sent. Please wait before requesting a new one." }

// 500 Internal Server Error
{ "detail": "Failed to send WhatsApp message" }
```

---

#### Verify WhatsApp OTP

```
POST /api/v1/auth/verify-whatsapp-otp
Content-Type: application/json
```

**Request body:**
```json
{
  "phone": "+919876543210",
  "otp": "482931"
}
```

**Response (200):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "uid": "user_abc123",
    "phone_number": "+919876543210",
    "is_new_user": true
  }
}
```

**Error responses:**
```json
// 400 Bad Request
{ "detail": "Invalid or expired OTP" }
```

---

### Categories

#### List All Categories

```
GET /api/v1/categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Fresh Fish",
    "emoji": "🐟",
    "description": "Fresh catch of the day",
    "product_count": 20
  },
  {
    "id": 2,
    "name": "Shrimp & Prawns",
    "emoji": "🦐",
    "description": "Assorted shrimp and prawns",
    "product_count": 10
  }
]
```

---

### Products

#### List Products

```
GET /api/v1/products
```

**Query parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Contains-search across name, description, tags |
| `category_id` | int | — | Filter by category |
| `min_price` | float | 0 | Minimum price filter |
| `max_price` | float | 5000 | Maximum price filter |
| `min_rating` | float | 0 | Minimum average rating |
| `in_stock` | bool | false | Only show in-stock items |
| `sort_by` | string | `popular` | `popular`, `price_asc`, `price_desc`, `rating` |
| `is_best_seller` | bool | — | Filter best sellers |
| `is_top_rated` | bool | — | Filter top rated |
| `is_seasonal` | bool | — | Filter seasonal picks |
| `limit` | int | 20 | Items per page |
| `offset` | int | 0 | Pagination offset |

**Example request:**
```
GET /api/v1/products?search=salmon&sort_by=rating&limit=10&offset=0
```

**Response:**
```json
{
  "total": 3,
  "products": [
    {
      "id": 5,
      "name": "Atlantic Salmon Fillet",
      "description": "Premium Norwegian salmon, rich in omega-3",
      "price": 649.0,
      "original_price": 799.0,
      "image_url": "https://picsum.photos/seed/prod_5/400/400",
      "category_id": 1,
      "category_name": "Fresh Fish",
      "rating": 4.8,
      "review_count": 312,
      "is_best_seller": true,
      "is_top_rated": true,
      "is_seasonal": false,
      "in_stock": true,
      "unit": "500g",
      "origin": "Norway",
      "cooking_tip": "Pan-sear skin-side down for 4 min for crispy skin",
      "tags": ["omega-3", "premium", "fillet"],
      "stock_quantity": 45,
      "discount_percent": 19
    }
  ]
}
```

---

#### Get Single Product

```
GET /api/v1/products/{id}
```

**Response:** Same as a single product object above.

**Error:**
```json
// 404 Not Found
{ "detail": "Product not found" }
```

---

### Orders

#### Place an Order

```
POST /api/v1/orders
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request body:**
```json
{
  "items": [
    { "product_id": 5, "quantity": 2 },
    { "product_id": 12, "quantity": 1 }
  ],
  "delivery_address": "123 Ocean Drive, Bandra, Mumbai 400050",
  "phone": "+919876543210"
}
```

**Response (201):**
```json
{
  "order_id": "ORD-20240503-001",
  "status": "confirmed",
  "subtotal": 1947.0,
  "delivery_fee": 0.0,
  "total": 1947.0,
  "estimated_delivery": "30-45 minutes",
  "items": [
    {
      "product_id": 5,
      "name": "Atlantic Salmon Fillet",
      "quantity": 2,
      "unit_price": 649.0,
      "subtotal": 1298.0
    },
    {
      "product_id": 12,
      "name": "Tiger Prawns",
      "quantity": 1,
      "unit_price": 649.0,
      "subtotal": 649.0
    }
  ]
}
```

**Error responses:**
```json
// 400 Bad Request — insufficient stock
{ "detail": "Insufficient stock for product: Atlantic Salmon Fillet (available: 1)" }

// 404 Not Found
{ "detail": "Product 99 not found" }
```

---

#### Get Order Details

```
GET /api/v1/orders/{order_id}
Authorization: Bearer <access_token>
```

**Response:** Same as order object above.

---

## Database Schema

### Tables

#### `categories`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| name | VARCHAR(100) | e.g. "Fresh Fish" |
| emoji | VARCHAR(10) | e.g. "🐟" |
| description | TEXT | |
| created_at | TIMESTAMP | |

#### `products`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| name | VARCHAR(200) | |
| description | TEXT | |
| price | NUMERIC(10,2) | Current selling price |
| original_price | NUMERIC(10,2) | Pre-discount price (nullable) |
| image_url | TEXT | Picsum URL with product seed |
| category_id | INT FK → categories.id | |
| rating | NUMERIC(3,2) | 0.0–5.0 |
| review_count | INT | |
| is_best_seller | BOOLEAN | |
| is_top_rated | BOOLEAN | |
| is_seasonal | BOOLEAN | |
| in_stock | BOOLEAN | |
| stock_quantity | INT | |
| unit | VARCHAR(50) | e.g. "500g", "1kg", "per piece" |
| origin | VARCHAR(100) | e.g. "Norway", "Bay of Bengal" |
| cooking_tip | TEXT | Chef's tip |
| tags | TEXT[] | PostgreSQL array of tag strings |
| created_at | TIMESTAMP | |

#### `users`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| uid | VARCHAR(128) UNIQUE | Firebase UID or generated UUID |
| phone_number | VARCHAR(20) UNIQUE | E.164 format (+919876543210) |
| display_name | VARCHAR(200) | |
| delivery_address | TEXT | Default delivery address |
| created_at | TIMESTAMP | |

#### `otp_tokens`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| phone_number | VARCHAR(20) | |
| otp_hash | VARCHAR(64) | SHA-256 hash of the 6-digit OTP |
| channel | VARCHAR(20) | `whatsapp` or `sms` |
| expires_at | TIMESTAMP | Now + 10 minutes |
| used | BOOLEAN | Marked true after successful verification |
| created_at | TIMESTAMP | |

#### `orders`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| order_number | VARCHAR(50) UNIQUE | e.g. "ORD-20240503-001" |
| user_id | INT FK → users.id | |
| status | VARCHAR(30) | `pending`, `confirmed`, `delivered`, `cancelled` |
| subtotal | NUMERIC(10,2) | |
| delivery_fee | NUMERIC(10,2) | 0 if subtotal ≥ ₹500 |
| total | NUMERIC(10,2) | |
| delivery_address | TEXT | |
| created_at | TIMESTAMP | |

#### `order_items`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| order_id | INT FK → orders.id | |
| product_id | INT FK → products.id | |
| quantity | INT | |
| unit_price | NUMERIC(10,2) | Price at time of order |
| subtotal | NUMERIC(10,2) | quantity × unit_price |

---

## Architecture Overview

### Flutter State Management

The app uses the **Provider** pattern with three ChangeNotifier classes:

```
MultiProvider (main.dart)
    ├── AuthProvider
    │       State: AuthState { initial, loading, otpSent, authenticated, error }
    │       Methods: sendOtp(), verifyOtp(), signOut()
    │       Storage: phone, authToken, isWhatsApp flag
    │
    ├── CartProvider
    │       State: Map<productId, CartItem>
    │       Methods: addItem(), removeItem(), setQuantity(), clearCart()
    │       Computed: subtotal, deliveryFee (₹0 if ≥₹500, else ₹49), total, itemCount
    │
    └── ProductProvider
            State: List<Product>, List<Category>, LoadState
            Methods: loadProducts(), loadCategories(), applyFilters(), resetFilters()
            Computed: bestSellers, topRated, seasonal, filteredProducts
```

### OTP Routing Logic

```
AuthProvider.sendOtp(phone)
    │
    ├── Step 1: GET /api/v1/auth/check-whatsapp?phone={phone}
    │           Backend calls Firebase Lookup API to detect WhatsApp
    │
    ├── Step 2a (WhatsApp available):
    │       POST /api/v1/auth/send-whatsapp-otp
    │       Backend generates 6-digit OTP
    │       Stores SHA-256(OTP) in otp_tokens table (10-min TTL)
    │       Sends via Twilio: client.messages.create(to="whatsapp:+91...")
    │
    └── Step 2b (WhatsApp NOT available):
            Firebase Phone Auth
            auth.verifyPhoneNumber(phoneNumber: phone)
            Firebase sends SMS directly
```

### Image Strategy

All 100 product images use Picsum Photos with a deterministic seed:

```
https://picsum.photos/seed/prod_{id}/400/400
```

- Same URL = same image (deterministic by seed)
- All images are exactly 400×400 pixels
- No API key required
- `CachedNetworkImage` caches them after first load
- `BoxFit.cover` + fixed container size ensures uniform display

### Free Delivery Logic

```dart
// CartProvider
double get deliveryFee => subtotal >= 500.0 ? 0.0 : 49.0;
double get total => subtotal + deliveryFee;

// Cart screen shows progress bar:
// "Add ₹{500 - subtotal} more for FREE delivery"
```

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#006064` | App bar, buttons, active states |
| `primaryDark` | `#004D40` | Gradient start, dark accents |
| `secondary` | `#FF6B35` | Cart badge, CTAs, price tags |
| `accent` | `#00BCD4` | Highlights, links |
| `whatsApp` | `#25D366` | WhatsApp FAB, OTP channel badge |
| `background` | `#F4FAFB` | Scaffold background |
| `surface` | `#FFFFFF` | Cards, bottom sheets |
| `cardBg` | `#FFFFFF` | Product cards |
| `textPrimary` | `#1A2332` | Headings, product names |
| `textSecondary` | `#546E7A` | Subtitles, descriptions |
| `textHint` | `#90A4AE` | Input placeholders |
| `divider` | `#E8F0F2` | Separators |
| `error` | `#E53935` | Error states |

### Typography

| Style | Font | Weight | Size |
|---|---|---|---|
| `displayLarge` | Poppins | Bold 700 | 32px |
| `headlineMedium` | Poppins | SemiBold 600 | 24px |
| `titleLarge` | Poppins | SemiBold 600 | 20px |
| `titleMedium` | Poppins | Medium 500 | 16px |
| `bodyMedium` | Poppins | Regular 400 | 14px |
| `bodySmall` | Poppins | Regular 400 | 12px |
| `labelLarge` | Poppins | SemiBold 600 | 14px |

### Spacing & Radius

```dart
AppSpacing.xs = 4.0
AppSpacing.sm = 8.0
AppSpacing.md = 16.0
AppSpacing.lg = 24.0
AppSpacing.xl = 32.0

AppRadius.sm = 8.0
AppRadius.md = 12.0
AppRadius.lg = 16.0
AppRadius.xl = 24.0
AppRadius.full = 100.0
```

---

## Product Catalog

The seeder (`backend/seed_data.py`) populates 100 products across 9 categories:

| Category | Count | Examples |
|---|---|---|
| 🐟 Fresh Fish | 20 | Atlantic Salmon, Sea Bass, Rohu, Pomfret, Tuna |
| 🦐 Shrimp & Prawns | 10 | Tiger Prawns, Vannamei Shrimp, Jumbo Prawns |
| 🦀 Crab | 15 | Blue Swimmer Crab, Mud Crab, Soft Shell Crab |
| 🦞 Lobster | 10 | Maine Lobster, Spiny Lobster, Rock Lobster Tail |
| 🦑 Squid & Octopus | 10 | Baby Squid, Calamari Rings, Whole Octopus |
| 🦪 Oysters & Clams | 10 | Kumamoto Oysters, Manila Clams, Mussels |
| 🍗 Smoked Seafood | 8 | Smoked Salmon, Smoked Mackerel, Smoked Trout |
| 🧊 Frozen Seafood | 9 | Frozen Scallops, Frozen Fish Fingers, IQF Shrimp |
| 🍳 Ready-to-Cook | 8 | Fish Curry Masala Pack, Prawn Biryani Kit, Crab Fry Mix |

Each product has:
- Realistic price range (₹149 – ₹2499)
- Original price (for discount display)
- Origin (e.g., "Bay of Bengal", "Norway", "Maine, USA")
- Chef's cooking tip
- Rating (4.0 – 4.9) + review count
- `isBestSeller` / `isTopRated` / `isSeasonal` flags
- Tags array (for full-text search)

---

## Troubleshooting

### `flutter pub get` fails with "authorization failed" (exit code 69)

**Cause:** Corporate SSL inspection (Zscaler, Netskope, or similar proxy) is intercepting HTTPS to pub.dev.

**Solutions:**

```bash
# Option 1: Run flutter pub get offline (all required packages are cached)
flutter pub get --offline

# Option 2: Use the corporate proxy
flutter pub get --http-proxy=http://proxy.yourcompany.com:8080

# Option 3: Export Zscaler root CA and trust it
# 1. Export Zscaler Root CA from Windows cert store to .pem
# 2. Set DART_VM_OPTIONS before running
export DART_VM_OPTIONS="--root-certs-file=/path/to/zscaler.pem"
flutter pub get
```

---

### `flutter analyze` exits with issues

**Symptoms:** Errors around `CardTheme`, `Category` ambiguous import, `withOpacity` deprecations.

**Fix:** These were already resolved in the codebase:
- `CardTheme` → `CardThemeData` in `lib/config/theme.dart`
- `import 'package:flutter/foundation.dart' hide Category;` in `product_provider.dart`
- All `withOpacity(x)` → `withValues(alpha: x)` across all files

If you see new issues, run:
```bash
flutter analyze
```

---

### Backend: `psycopg2` install fails on macOS (M1/M2)

```bash
# Install PostgreSQL client libraries first
brew install libpq
export LDFLAGS="-L/opt/homebrew/opt/libpq/lib"
export CPPFLAGS="-I/opt/homebrew/opt/libpq/include"
pip install psycopg2-binary
```

---

### Backend: Tables not created on startup

FastAPI uses SQLAlchemy's `create_all()` in the lifespan event. If tables are missing:

```bash
# Manually trigger table creation
python -c "from database import engine; from models import Base; Base.metadata.create_all(engine)"
```

---

### Twilio: "21608 The number is not a valid WhatsApp number"

- You need to join the Twilio WhatsApp sandbox by sending the join keyword to the sandbox number from your WhatsApp before testing
- See [Twilio Sandbox setup](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)

---

### Android emulator can't reach localhost backend

Android emulator maps `10.0.2.2` to your host machine's `localhost`. Update `api_service.dart`:

```dart
static const String _baseUrl = 'http://10.0.2.2:8000/api/v1';
```

For physical device on same WiFi, use your machine's local IP:
```dart
static const String _baseUrl = 'http://192.168.1.x:8000/api/v1';
```

---

### OTP not received on WhatsApp

1. Verify your WhatsApp number joined the Twilio sandbox
2. Check Twilio Console → Monitor → Logs for message status
3. Check `backend/` logs for any Twilio API errors
4. Ensure `TWILIO_WHATSAPP_NUMBER` in `.env` starts with `whatsapp:` prefix

---

## License

MIT — free to use, modify, and distribute.
