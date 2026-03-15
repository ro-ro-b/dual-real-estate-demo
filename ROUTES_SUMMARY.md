# DUAL Real Estate Tokenization App - Routes & Files Summary

## Project Structure

All files have been created in `/sessions/adoring-clever-shannon/mnt/MC/dual-real-estate-app/src`

### Page Routes (Next.js 14 App Router)

#### Public Routes
- **`src/app/page.tsx`** - Root page that redirects to `/properties`

#### Dashboard Routes (wrapped with AppShell layout)
All dashboard pages are in the `(dashboard)` route group and inherit the AppShell layout.

- **`src/app/(dashboard)/layout.tsx`** - Dashboard layout wrapper with AppShell, Sidebar, and Header
  
- **`src/app/(dashboard)/properties/page.tsx`** - Property listing page
  - Shows all 8 demo properties in responsive grid (1 col mobile, 2 tablet, 3 desktop)
  - StatsCards showing portfolio overview
  - PropertyFilters with status, bedrooms, price range, and sorting
  - Filter logic for status, bedrooms, price
  - "Mint New Property" button links to `/admin/mint`
  - Subtitle: "Manage your tokenised real estate portfolio"

- **`src/app/(dashboard)/properties/[id]/page.tsx`** - Property detail page
  - Back button to /properties
  - Hero section with image and overlay (address + price + status badge)
  - Two-column layout:
    - LEFT (2/3): PropertyDetails, PropertyActions (Reserve/Transfer/View On-Chain), ActivityHistory
    - RIGHT (1/3): StatusCard, OwnerCard, TemplateInfo, FacesCard
  - Dynamically finds property by ID from demo data
  - Action buttons trigger API calls to /api/actions

- **`src/app/(dashboard)/admin/page.tsx`** - Admin dashboard
  - Title: "Admin Dashboard"
  - StatsCards with portfolio stats
  - Recent Activity table showing last 5 actions with timestamp, type, object ID, status
  - Quick Actions cards: Mint Property, Manage Templates, Configure Webhooks, View Sequencer Status
  - On-Chain Status section with progress bar (anchored vs pending)

- **`src/app/(dashboard)/admin/mint/page.tsx`** - Mint new property form
  - Form with fields: address, city, country, description, price, bedrooms, bathrooms, squareMeters, latitude, longitude, imageUrl, status
  - Template selector (pre-filled with demo template)
  - Live preview card showing property as it will appear
  - Form validation (required fields, price > 0)
  - Submit button with loading state
  - Success alert with mock object ID on submit

### API Routes

- **`src/app/api/auth/route.ts`** - Authentication endpoint
  - POST: Accepts `{ email, password }`
  - Returns mock JWT token and session data with userId, wallet, organizationId
  - Demo implementation that accepts any credentials

- **`src/app/api/properties/route.ts`** - Properties data endpoint
  - GET: Returns filtered demo properties list
    - Query params: `status`, `minPrice`, `maxPrice`
    - Returns array of Property objects with total count
  - POST: Mints new property
    - Accepts PropertyData with imageUrl
    - Validates required fields
    - Returns `{ objectId, templateId, status, message }`
    - Returns 201 on success

- **`src/app/api/webhooks/route.ts`** - Webhook receiver
  - POST: Receives webhook events from DUAL sequencer
  - Validates mock signature (can be enabled in production)
  - Handles events: property.anchored, property.anchoring_failed, action.completed, action.failed
  - Logs all webhook events
  - Returns 200 with `{ received: true, eventId }`

- **`src/app/api/actions/route.ts`** - Action execution endpoint
  - POST: Executes actions on properties
  - Accepts `{ objectId, action, parameters }`
  - Supports actions: RESERVE, TRANSFER, VIEW_ON_CHAIN
  - Each returns ActionResult with actionId, status (pending/completed), and result data
  - Returns 202 (Accepted) for async processing

## Components

### Layout Components
- **`components/layout/AppShell.tsx`** - Main app shell with sidebar and header
- **`components/layout/Header.tsx`** - Top header with app title and user info
- **`components/layout/Sidebar.tsx`** - Navigation sidebar with links to Properties and Admin

### Properties List Components
- **`components/properties/StatsCards.tsx`** - Portfolio overview stats (4 cards)
- **`components/properties/PropertyFilters.tsx`** - Filter and sort controls
- **`components/properties/PropertyCard.tsx`** - Individual property card with image, price, details

### Property Detail Components
- **`components/property-detail/PropertyDetails.tsx`** - Full property information card
- **`components/property-detail/PropertyActions.tsx`** - Action buttons (Reserve, Transfer, View On-Chain)
- **`components/property-detail/ActivityHistory.tsx`** - Timeline of actions/events
- **`components/property-detail/StatusCard.tsx`** - Large status badge (Available/Reserved/Sold) + on-chain status
- **`components/property-detail/OwnerCard.tsx`** - Wallet address display with copy button
- **`components/property-detail/TemplateInfo.tsx`** - Template ID and name
- **`components/property-detail/FacesCard.tsx`** - List of attached faces (images/documents)

### Admin Components
- **`components/admin/MintForm.tsx`** - Full mint form with all input fields and validation
- **`components/admin/PropertyPreview.tsx`** - Live preview showing how property will appear

## Mock Data

**`src/lib/demo-data.ts`** - Demo data and types
- **demoProperties**: 8 realistic properties with:
  - Luxury penthouse in Manhattan - $8.5M, 4bed/3bath, 500sqm, available
  - Beach house in Malibu - $12.2M, 5bed/4bath, 650sqm, reserved
  - Townhouse in Brooklyn - $2.1M, 3bed/2bath, 220sqm, available
  - Villa in Miami Beach - $6.8M, 6bed/5bath, 800sqm, sold
  - Loft in SoHo - $3.4M, 2bed/2bath, 180sqm, available
  - Estate in Beverly Hills - $22M, 8bed/10bath, 1500sqm, available
  - Condo in San Francisco - $1.8M, 2bed/1bath, 120sqm, reserved
  - Ranch in Austin - $4.5M, 5bed/4bath, 2000sqm, available
  - Each has: proper UUIDs, wallet addresses, coordinates, dates
  
- **demoActions**: 8 sample actions showing property creation and anchoring
- **demoTemplate**: Property template with name "real-estate::property::v1"
- **demoStats**: Portfolio statistics (8 properties, 5 available, 2 reserved, 1 sold, $61.3M total value)

## Features

### Properties Page
- Responsive grid layout (mobile: 1 col, tablet: 2 cols, desktop: 3 cols)
- Filter by status (available/reserved/sold)
- Filter by number of bedrooms
- Filter by price range
- Sort by: newest, oldest, price ascending, price descending
- Status badges and on-chain status indicators on each card

### Property Detail Page
- Large hero section with property image or gradient
- Address and price overlay on hero
- Full property information (address, description, bed/bath, sqm, coordinates, listing date)
- Three action buttons that call the /api/actions endpoint
- Activity history timeline
- Owner wallet display with copy functionality
- Template information
- Attached faces/images

### Admin Dashboard
- Portfolio statistics overview
- Recent activity table
- Quick action cards for common tasks
- On-chain anchoring progress bar

### Mint Property Page
- Form with all required and optional fields
- Form validation
- Live preview showing final property appearance
- Template information display

## Type Definitions

All types are properly defined in `src/lib/demo-data.ts`:
- `PropertyData` - Property details
- `Face` - Attached media/documents
- `DualObject` - Base DUAL object structure
- `Property` - Complete property with metadata
- `Action` - History action/event
- `Template` - Template definition

## Styling

- Uses Tailwind CSS utility classes
- Responsive design with breakpoints (mobile, md, lg)
- Consistent color scheme with status indicators
- Gradient backgrounds and shadows for visual hierarchy
- Hover states and transitions

## Navigation & Routing

All routes are protected by the (dashboard) layout group:
- `/` → redirects to `/properties`
- `/properties` → Property listing
- `/properties/[id]` → Property detail
- `/admin` → Admin dashboard
- `/admin/mint` → Mint new property

API routes are accessible at `/api/*` paths and return JSON responses.

## Next Steps for Production

1. Connect to real DUAL API instead of using demo data
2. Implement real authentication with JWT tokens
3. Add database integration (Postgres/MongoDB)
4. Implement real blockchain anchoring
5. Add WebSocket support for real-time updates
6. Implement proper error handling and logging
7. Add rate limiting to API routes
8. Implement webhook signature validation
9. Add image upload handling (currently expects URLs)
10. Add transaction history and detailed analytics
