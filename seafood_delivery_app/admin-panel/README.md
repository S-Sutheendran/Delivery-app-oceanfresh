# OceanFresh Admin Panel

React 18 + Vite 5 + Tailwind CSS web dashboard for managing the OceanFresh seafood delivery platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 (dark mode via `class`) |
| Icons | Lucide React |
| State | React Context API + useState |
| Auth | sessionStorage (`of_admin` key) |
| Theme | localStorage (`of_theme` key) |

---

## Getting Started

```bash
cd admin-panel
npm install
npm run dev       # Development server → http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

**Login credentials:** `admin` / `admin123`

---

## Project Structure

```
src/
├── main.jsx                    # App entry point
├── App.jsx                     # Route definitions (31 routes)
├── contexts/
│   ├── AuthContext.jsx          # Session-based auth
│   └── ThemeContext.jsx         # Light/dark theme toggle
├── components/
│   ├── layout/
│   │   ├── Layout.jsx           # Shell: Sidebar + Header + Outlet
│   │   ├── Sidebar.jsx          # Full nav tree (all 31 paths)
│   │   └── Header.jsx           # Top bar, theme toggle, logout
│   └── ui/
│       ├── PageHeader.jsx       # Title + subtitle + optional action button
│       ├── Badge.jsx            # 7 colour variants (success/warning/danger/brand/info/gray/orange)
│       ├── Modal.jsx            # Reusable modal wrapper
│       └── StatCard.jsx         # KPI summary card
└── pages/                      # 27 page components
```

---

## Pages and Features

### Dashboard (`/`)
- KPI cards: total orders, revenue, active drivers, new customers
- Weekly revenue bar chart
- Recent orders table
- Top products list

---

### Orders (`/orders`)
**Status flow (admin-controlled):**
```
pending → confirmed → packed
                          ↓ (driver-controlled, shown as info banner)
                      picked_up → in_transit → delivered
```
- Admin can advance: pending→confirmed, confirmed→packed
- Admin can cancel from any non-terminal state
- Driver-controlled steps (picked_up, in_transit, delivered) are shown as read-only info banners in the detail modal — admin cannot trigger these
- Order detail modal: full item list, customer info, address, status history, status action buttons
- Filters by status tab (All / Pending / Confirmed / Packed / Picked Up / In Transit / Delivered / Cancelled)
- Search by order ID or customer name

---

### Customers (`/customers`)
- Customer list with join date, order count, spend, status
- Add new customer (name, phone, email)
- Ban / Unban toggle per customer
- Customer detail page (`/customers/:id`): full order history, stats

---

### Fleet Management

#### Delivery Persons (`/fleet/delivery-person`)
- Driver cards with name, phone, vehicle, zone, status badge
- Add new driver modal (name, phone, vehicle type, assigned zone)
- Edit driver details
- View driver detail modal (full profile)
- Suspend / Reinstate with confirmation dialog

#### Verify Delivery Person (`/fleet/verify-delivery-person`)
- Applicant list with submitted documents
- View applicant detail modal (all submitted info)
- Approve: removes from pending list (moves to active fleet)
- Reject: reason picker (6 options + free-text "Other")
- Empty state shown when all applicants reviewed

#### Zone Management (`/fleet/zone-management`)
- Delivery zones list with area description and fee
- Add zone (name, area description, delivery fee)
- Edit zone details
- Delete zone with confirmation

#### Driver Reasons (`/fleet/driver-reasons`)
- List of reasons drivers can select when marking an order undeliverable
- Inline edit: click edit → text field replaces label → Enter or ✓ to save
- Add new reason
- Delete reason

---

### Menu Management

#### Foods (`/menu/foods`)
- Product list with category, price, stock level, bestseller flag
- Add product modal (name, category, price, stock, bestseller toggle)
- Edit product details
- Delete with confirmation
- Prices stored as numbers, displayed as ₹

#### Categories (`/menu/categories`)
- Parent categories with enable/disable toggle
- Expandable subcategory list per category
- Add / Edit / Delete categories
- Add / Edit / Delete subcategories (nested modal at z-[60])

#### Item Tags (`/menu/item-tags`)
- Colour-coded tags (Fresh, Bestseller, New, etc.)
- Add tag modal with live colour preview
- Edit tag name and colour
- Delete tag

---

### Service

#### Banners (`/service/banner`)
Banner dimension reference:
| Target | Size | Ratio |
|---|---|---|
| Home Screen | 1200 × 400 px | 3:1 |
| App Popup | 720 × 320 px | 9:4 |
| Checkout Strip | 800 × 200 px | 4:1 |

- Add banner: drag-and-drop image upload, title, target screen, active/inactive status
- Image preview with correct aspect ratio matching selected target
- Dimension guide table highlighted by currently selected target
- Banners list: real thumbnail if image uploaded, gradient placeholder otherwise
- Activate / deactivate toggle
- Delete banner

#### Coupon Offers (`/service/coupon-offers`)
- Coupon list with code, type (flat/percent), value, usage, expiry, status
- Add coupon: code (auto-uppercased), discount type, value, min order, max usage, expiry date
- Edit coupon
- Delete with confirmation
- Usage displayed as `used/max` (e.g. `142/500` or `83/∞` for unlimited)

#### Customer Testimonials (`/service/testimonials`)
- Review cards with star rating, featured/pending badges
- Add testimonial manually (customer name, star rating via star picker, review text up to 300 chars)
- Feature / Unfeature toggle
- Approve / Unapprove toggle
- Delete review
- Summary: featured count + pending approval count in subtitle

#### Documents (`/service/documents`)
- Legal and operational document list (Terms, Privacy, Driver Agreement, etc.)
- Upload document modal: drag-and-drop PDF/DOC/DOCX, title, type (Legal/Driver/Ops), version, status
- View details modal with Publish / Unpublish action
- Download: serves actual file if uploaded, shows alert for placeholder entries
- Delete document

#### Payout Requests (`/service/payout-request`)
- Driver payout requests with amount, bank details, date, status
- View payout detail modal: full driver info + bank account
- Approve from modal (status → approved)
- Reject from modal with optional rejection reason
- Summary: pending count + total pending amount in subtitle

---

### System Settings

#### General Settings (`/system/general-settings`)
- App name, timezone, language, currency, support email, contact number

#### Business Settings (`/system/business-settings`)
- Business name, GSTIN, address, operating hours (open/close time), open days checkboxes

#### App Settings (`/system/app-settings`)
- Maintenance mode toggle, min app version, max delivery radius, free delivery threshold, service charge

#### App Theme (`/system/app-theme`)
- Primary and secondary colour pickers
- Font family selector
- Preview swatch updates live

#### Contact Us (`/system/contact-us`)
- Support email, phone, WhatsApp number, social media links (Instagram, Facebook, Twitter)

#### Finance Settings (`/system/finance-settings`)
Payment gateways — each supports enable/disable, Set as Default, delete, and API key configuration:
- Razorpay (Key ID, Key Secret, Webhook Secret)
- Paytm (Merchant ID, Merchant Key, Website Name)
- PhonePe (Merchant ID, Salt Key, Salt Index)
- Google Pay (Merchant ID, API Key)
- Stripe (Publishable Key, Secret Key, Webhook Secret)
- Cashfree (App ID, Secret Key)
- UPI Generic (VPA / UPI ID)
- Cash on Delivery (no credentials)

API keys use show/hide password fields. Adding a gateway opens a modal filtered to gateways not yet added.

Tax: GST rate (%) and GST number.
Driver Payout: per-delivery rate, payout cycle (Weekly/Bi-weekly/Monthly), min threshold, platform commission %.

#### Policy Settings (`/system/policy-settings`)
5-tab layout with independent save state per tab:

| Tab | Contents |
|---|---|
| Terms & Conditions | Versioned document editor (textarea, version field, draft/published toggle) |
| Privacy Policy | Same editor with pre-filled GDPR-style content |
| Cancellation | Cancellation window (minutes), cancellation fee (%), refund policy selector |
| Delivery | Max delivery attempts, undelivered order action |
| Returns | Return window (hours), accepted return reasons (one per line) |

Save stamps today's date as the "last updated" timestamp.

---

### Insights (`/insights`)
- Revenue, orders, and customer acquisition charts
- Period selector: Weekly / Monthly / Quarterly / Half Yearly / Yearly
- Data scaled proportionally using `PM = { Weekly:1, Monthly:4.3, Quarterly:13, 'Half Yearly':26, Yearly:52 }`

---

## Authentication Flow

1. `/login` renders with admin/admin123 pre-filled (demo mode)
2. On submit → 600 ms simulated delay → `AuthContext.login()` stores `{ username, role }` in sessionStorage under `of_admin`
3. All routes inside `<Layout>` check `isAuthenticated`; unauthenticated requests redirect to `/login`
4. Logout clears sessionStorage and returns to `/login`

---

## Dark Mode

- Toggle button in Header switches `document.documentElement.classList` between `''` and `'dark'`
- Preference saved to localStorage under `of_theme`
- All components use Tailwind `dark:` variants

---

## Key Patterns

**Modal pattern:** `fixed inset-0 z-50`, backdrop click closes via `e.target === e.currentTarget`. Nested modals (e.g., subcategory modal inside category modal) use `z-[60]`.

**Inline edit:** `editId` + `editText` state replaces row text with an `<input>`. Enter key or ✓ button saves; Escape or ✗ cancels.

**File upload:** Hidden `<input type="file">` accessed via `useRef`. Drag-and-drop overlay via `onDragOver/onDrop`. `FileReader.readAsDataURL` stores content for in-browser download.

**Save feedback:** `markSaved(key)` sets a boolean true, shows "✓ Saved!", then resets after 2 seconds.
