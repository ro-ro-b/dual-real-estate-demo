# DUAL Real Estate - Property Tokenization Platform

A modern, professional Next.js 14 application for property tokenization built on DUAL. Features a clean design with dark sidebar navigation and white content areas, styled with Tailwind CSS and a teal accent color.

## Project Structure

```
src/
├── app/
│   ├── globals.css           # Global styles and Tailwind setup
│   └── layout.tsx            # Root layout with metadata
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx       # Main navigation sidebar
│   │   ├── Header.tsx        # Top header bar with breadcrumbs
│   │   └── AppShell.tsx      # Layout composition component
│   ├── ui/
│   │   ├── Badge.tsx         # Reusable badge component
│   │   ├── Button.tsx        # Button with variants and states
│   │   ├── Card.tsx          # Card container with sections
│   │   └── StatusBadge.tsx   # Property status indicator
│   └── properties/
│       ├── PropertyCard.tsx  # Individual property display card
│       ├── PropertyFilters.tsx # Filter and sort controls
│       └── StatsCards.tsx    # Dashboard metrics display
├── lib/
│   └── utils.ts              # Utility functions (cn, formatPrice, etc.)
└── types/
    └── index.ts              # TypeScript interfaces
```

## Components

### Layout Components

#### `Sidebar`
Navigation sidebar with collapsible state, active route detection, and mobile support.
- Logo with DUAL branding
- Organized nav sections (Dashboard, Properties, Management)
- User avatar and Demo Mode badge
- Responsive toggle for desktop/mobile

**Usage:**
```tsx
import { Sidebar } from '@/components/layout/Sidebar';

<Sidebar />
```

#### `Header`
Top header bar with breadcrumbs, search input, notification bell, and user avatar.

**Props:**
```tsx
interface HeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
}
```

**Usage:**
```tsx
<Header breadcrumbs={[
  { label: 'Dashboard', href: '/admin' },
  { label: 'Properties' }
]} />
```

#### `AppShell`
Main layout composition component combining Sidebar, Header, and content area.

**Props:**
```tsx
interface AppShellProps {
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}
```

**Usage:**
```tsx
<AppShell breadcrumbs={breadcrumbs}>
  <main>Your content here</main>
</AppShell>
```

### UI Components

#### `Badge`
Reusable badge component with multiple variants and sizes.

**Props:**
```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
<Badge variant="success" size="md">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

#### `Button`
Button component with variants, sizes, and loading state.

**Props:**
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
<Button variant="primary" size="lg">Submit</Button>
<Button variant="outline" loading>Processing...</Button>
<Button variant="danger">Delete</Button>
```

#### `Card`
Card container with optional header, body, and footer sections.

**Usage:**
```tsx
<Card hover>
  <CardHeader>
    <h2>Card Title</h2>
  </CardHeader>
  <CardBody>
    <p>Card content</p>
  </CardBody>
  <CardFooter>
    <button>Action</button>
  </CardFooter>
</Card>
```

#### `StatusBadge`
Specialized badge for property status with dot indicators.

**Props:**
```tsx
interface StatusBadgeProps {
  status: 'available' | 'reserved' | 'sold';
  className?: string;
}
```

**Usage:**
```tsx
<StatusBadge status="available" />
```

### Property Components

#### `PropertyCard`
Card component for displaying individual properties in grid layouts.

**Props:**
```tsx
interface PropertyCardProps {
  property: PropertyData;
}
```

**Features:**
- Property image with gradient fallback
- Status badge overlay
- On-chain status indicator (anchored/pending)
- Bed/bath/sqm specifications
- Hover effects and scale animation

**Usage:**
```tsx
<PropertyCard property={propertyData} />
```

#### `PropertyFilters`
Filter bar for status, price range, bedrooms, and sorting.

**Props:**
```tsx
interface PropertyFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}
```

**Features:**
- Status pills (All, Available, Reserved, Sold)
- Min/Max price inputs
- Bedrooms dropdown (Any, 1+, 2+, 3+, 4+)
- Sort options (Newest, Price asc/desc)

**Usage:**
```tsx
<PropertyFilters onFilterChange={(filters) => {
  // Handle filter changes
}} />
```

#### `StatsCards`
Dashboard metrics display with four stat cards.

**Props:**
```tsx
interface StatsCardsProps {
  stats: DashboardStats;
}
```

**Features:**
- Total Properties
- Available Properties
- Reserved Properties
- Total Value
- Trend indicators with percentage changes

**Usage:**
```tsx
<StatsCards stats={dashboardStats} />
```

## Utilities

### `cn()`
Combines Tailwind classes with clsx and twMerge for safe class merging.

```tsx
import { cn } from '@/lib/utils';

cn('px-2 py-1', isActive && 'bg-teal-500')
```

### `formatPrice()`
Formats numbers as USD currency.

```tsx
formatPrice(299500) // '$299,500'
```

### `formatAddress()`
Truncates long addresses to 50 characters.

```tsx
formatAddress('123 Main Street, Springfield, IL 62701')
```

### `calculatePriceChange()`
Calculates percentage change between two prices.

```tsx
calculatePriceChange(350000, 300000) // { percentage: 16.7, isPositive: true }
```

## Types

### `PropertyData`
```tsx
interface PropertyData {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  imageUrl?: string;
  status: 'available' | 'reserved' | 'sold';
  onChainStatus: 'anchored' | 'pending' | 'failed';
  tokenizationProgress: number;
}
```

### `DashboardStats`
```tsx
interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  reservedProperties: number;
  totalValue: number;
}
```

### `FilterOptions`
```tsx
interface FilterOptions {
  status: 'all' | 'available' | 'reserved' | 'sold';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
}
```

## Color Palette

- **Primary**: Teal (#15b8a7)
- **Sidebar**: Slate 900 (#0f172a)
- **Background**: Slate 50 (#f8fafc)
- **Card**: White (#ffffff)
- **Border**: Slate 200 (#e2e8f0)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Features

- Modern, clean design with teal accent color
- Dark sidebar navigation with active state detection
- Responsive mobile navigation
- Reusable component system
- TypeScript support
- Tailwind CSS utility-first styling
- Icon system via lucide-react
- Production-ready component library
