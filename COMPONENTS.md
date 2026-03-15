# Component Library Documentation

## Overview

This document provides a comprehensive guide to all reusable UI and layout components in the DUAL Real Estate tokenization platform. All components are built with React 18, TypeScript, and styled with Tailwind CSS.

## Design System

### Color Scheme

**Primary Colors:**
- Teal (Accent): `#15b8a7` - Used for primary actions, active states, and highlights
- Slate-900 (Sidebar): `#0f172a` - Dark background for navigation
- Slate-50 (Background): `#f8fafc` - Light page background
- White: `#ffffff` - Card and content backgrounds

**Semantic Colors:**
- Success (Green): `#10b981` - Available status, positive metrics
- Warning (Amber): `#f59e0b` - Reserved status, pending states
- Danger (Red): `#ef4444` - Errors, deleted states
- Info (Blue): `#3b82f6` - Sold status, informational

### Typography

- **Font Family**: System UI stack (system-ui, -apple-system, sans-serif)
- **Headings**: font-bold with appropriate sizing
- **Body**: text-sm to text-base for readability
- **Labels**: text-xs, uppercase, font-semibold for section headers

### Spacing

Uses Tailwind's default spacing scale (4px unit):
- `p-2` (8px), `p-4` (16px), `p-6` (24px) for containers
- `gap-2`, `gap-3`, `gap-4` for component spacing

### Shadows & Borders

- **Card Shadow**: `shadow-sm` default, `shadow-md` on hover
- **Borders**: `border border-slate-200` on cards, `border-b border-slate-800` on dark backgrounds
- **Radius**: `rounded-lg` (8px) for inputs, `rounded-xl` (12px) for cards

---

## Layout Components

### Sidebar

**Path**: `src/components/layout/Sidebar.tsx`

Vertical navigation sidebar with logo, organized sections, and user profile area.

**Features:**
- Collapsible/expandable toggle
- Active route detection with teal highlight
- Mobile responsive with overlay
- Logo with diamond icon + "DUAL" branding
- Organized nav sections with icons
- User avatar and Demo Mode badge
- Smooth transitions

**Import:**
```tsx
import { Sidebar } from '@/components/layout/Sidebar';
```

**Usage:**
```tsx
<Sidebar />
```

**Mobile Behavior:**
- Hidden on screens < 768px
- Toggle button appears on mobile
- Full-screen overlay when expanded
- Click overlay to close

---

### Header

**Path**: `src/components/layout/Header.tsx`

Top header bar with breadcrumb navigation, search input, notifications, and user avatar.

**Props:**
```tsx
interface HeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
}
```

**Features:**
- Dynamic breadcrumb navigation
- Search input (placeholder, non-functional)
- Notification bell with pulsing indicator dot
- User avatar circle

**Import:**
```tsx
import { Header } from '@/components/layout/Header';
```

**Usage:**
```tsx
<Header breadcrumbs={[
  { label: 'Dashboard', href: '/admin' },
  { label: 'Properties', href: '/properties' },
  { label: 'Details' }
]} />
```

**Responsive:**
- Search bar hidden on mobile (< 768px)
- Breadcrumbs adapt to screen size

---

### AppShell

**Path**: `src/components/layout/AppShell.tsx`

Main layout composition combining Sidebar, Header, and content area with proper spacing.

**Props:**
```tsx
interface AppShellProps {
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}
```

**Features:**
- Full-screen flex layout
- Sidebar on left (hidden on mobile)
- Header + content on right
- Proper overflow handling
- Mobile-optimized layout

**Import:**
```tsx
import { AppShell } from '@/components/layout/AppShell';
```

**Usage:**
```tsx
<AppShell breadcrumbs={breadcrumbs}>
  <h1>Page Content</h1>
  <p>Your content here</p>
</AppShell>
```

---

## UI Components

### Badge

**Path**: `src/components/ui/Badge.tsx`

Small informational label with multiple color variants and sizes.

**Props:**
```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}
```

**Variants:**
- `default`: Slate background, subtle
- `success`: Green background, for positive states
- `warning`: Amber background, for caution
- `danger`: Red background, for errors
- `info`: Blue background, for information
- `outline`: Bordered style, no fill

**Sizes:**
- `sm`: 8px vertical, 8px horizontal, text-xs
- `md`: 6px vertical, 12px horizontal, text-sm (default)

**Import:**
```tsx
import { Badge } from '@/components/ui/Badge';
```

**Examples:**
```tsx
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="warning">Pending Review</Badge>
<Badge variant="outline">Draft</Badge>
<Badge variant="danger">Error</Badge>
```

---

### Button

**Path**: `src/components/ui/Button.tsx`

Interactive button with variants, sizes, and loading states.

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

**Variants:**
- `primary`: Teal background, white text (default)
- `secondary`: Gray background, dark text
- `outline`: Bordered, no fill
- `ghost`: No background, text only
- `danger`: Red background, white text

**Sizes:**
- `sm`: 6px vertical, 12px horizontal, text-sm
- `md`: 8px vertical, 16px horizontal, text-sm (default)
- `lg`: 12px vertical, 24px horizontal, text-base

**Features:**
- Loading state with spinner
- Disabled state with opacity
- Smooth transitions
- Focus states

**Import:**
```tsx
import { Button } from '@/components/ui/Button';
```

**Examples:**
```tsx
<Button onClick={handleSubmit}>Submit</Button>
<Button variant="secondary" size="lg">Large Button</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Delete</Button>
<Button loading>Processing...</Button>
<Button disabled>Disabled</Button>
```

---

### Card

**Path**: `src/components/ui/Card.tsx`

Container component for organizing content with optional header, body, and footer sections.

**Components:**
- `Card`: Main container
- `CardHeader`: Top section, typically for titles
- `CardBody`: Main content area
- `CardFooter`: Bottom section, typically for actions

**Card Props:**
```tsx
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}
```

**Features:**
- White background with subtle border
- Rounded corners (rounded-xl)
- Optional hover effect (shadow + border color change)
- Click handler support

**Import:**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
```

**Examples:**
```tsx
// Simple card
<Card>
  <CardBody>
    <p>Simple content</p>
  </CardBody>
</Card>

// Full-featured card
<Card hover>
  <CardHeader>
    <h2>Card Title</h2>
  </CardHeader>
  <CardBody>
    <p>Main content goes here</p>
  </CardBody>
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>

// Clickable card
<Card hover onClick={() => handleCardClick()}>
  <CardBody>
    Click to expand
  </CardBody>
</Card>
```

---

### StatusBadge

**Path**: `src/components/ui/StatusBadge.tsx`

Specialized badge component for property status indicators.

**Props:**
```tsx
interface StatusBadgeProps {
  status: 'available' | 'reserved' | 'sold';
  className?: string;
}
```

**Status Mapping:**
- `available`: Green background with "Available" label
- `reserved`: Amber background with "Reserved" label
- `sold`: Blue background with "Sold" label

**Features:**
- Leading dot indicator matching status color
- Semantic color usage

**Import:**
```tsx
import { StatusBadge } from '@/components/ui/StatusBadge';
```

**Examples:**
```tsx
<StatusBadge status="available" />
<StatusBadge status="reserved" />
<StatusBadge status="sold" />
```

---

## Property Components

### PropertyCard

**Path**: `src/components/properties/PropertyCard.tsx`

Display card for individual properties in grid or list layouts.

**Props:**
```tsx
interface PropertyCardProps {
  property: PropertyData;
}

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

**Features:**
- Responsive image with gradient fallback
- Status badge in top-right overlay
- On-chain status indicator (green dot for anchored, amber for pending)
- Large price display
- Address with text truncation
- Bed/bath/sqm row with icons
- "View Details" link with icon
- Hover effects: scale animation + enhanced shadow
- Links to `/properties/[id]` route

**Import:**
```tsx
import { PropertyCard } from '@/components/properties/PropertyCard';
```

**Usage:**
```tsx
<PropertyCard property={propertyData} />

// In a grid:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {properties.map(prop => (
    <PropertyCard key={prop.id} property={prop} />
  ))}
</div>
```

---

### PropertyFilters

**Path**: `src/components/properties/PropertyFilters.tsx`

Filter and sort controls for property listings.

**Props:**
```tsx
interface PropertyFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  status: 'all' | 'available' | 'reserved' | 'sold';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
}
```

**Filters:**
1. **Status**: Pill buttons (All, Available, Reserved, Sold)
2. **Price Range**: Min and Max input fields
3. **Bedrooms**: Dropdown (Any, 1+, 2+, 3+, 4+)
4. **Sort**: Dropdown (Newest, Price Low-High, Price High-Low)

**Features:**
- Real-time filter updates
- Responsive grid layout
- Controlled state management
- Callback on filter changes

**Import:**
```tsx
import { PropertyFilters } from '@/components/properties/PropertyFilters';
```

**Usage:**
```tsx
const [filters, setFilters] = useState<FilterOptions>({
  status: 'all',
  sortBy: 'newest'
});

<PropertyFilters onFilterChange={setFilters} />
```

---

### StatsCards

**Path**: `src/components/properties/StatsCards.tsx`

Dashboard metrics display with four stat cards showing key property statistics.

**Props:**
```tsx
interface StatsCardsProps {
  stats: DashboardStats;
}

interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  reservedProperties: number;
  totalValue: number;
}
```

**Cards Displayed:**
1. **Total Properties**: Count with trending icon and percentage
2. **Available**: Count with trending icon and percentage
3. **Reserved**: Count with trending icon and percentage
4. **Total Value**: Formatted price with trending icon and percentage

**Features:**
- Color-coded icons (blue, green, amber, teal)
- Trending indicators with percentage changes
- "from last month" time context
- Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
- Hover effects on cards

**Import:**
```tsx
import { StatsCards } from '@/components/properties/StatsCards';
```

**Usage:**
```tsx
const stats: DashboardStats = {
  totalProperties: 148,
  availableProperties: 42,
  reservedProperties: 58,
  totalValue: 125500000
};

<StatsCards stats={stats} />
```

---

## Utility Functions

### `cn()`

**Path**: `src/lib/utils.ts`

Safely merge Tailwind CSS classes using clsx and tailwind-merge.

```tsx
import { cn } from '@/lib/utils';

const buttonClasses = cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-teal-500 text-white',
  disabled && 'opacity-50 cursor-not-allowed'
);
```

### `formatPrice()`

Format numbers as USD currency with proper localization.

```tsx
import { formatPrice } from '@/lib/utils';

formatPrice(299500)  // '$299,500'
formatPrice(1500000) // '$1,500,000'
```

### `formatAddress()`

Truncate long addresses to 50 characters with ellipsis.

```tsx
import { formatAddress } from '@/lib/utils';

formatAddress('123 Main Street, Springfield, IL 62701')
// '123 Main Street, Springfield, IL 627...'
```

### `calculatePriceChange()`

Calculate percentage change between two prices.

```tsx
import { calculatePriceChange } from '@/lib/utils';

const change = calculatePriceChange(350000, 300000);
// { percentage: 16.7, isPositive: true }
```

---

## Type Definitions

All types are defined in `src/types/index.ts`:

```tsx
export interface PropertyData {
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

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  reservedProperties: number;
  totalValue: number;
}

export interface FilterOptions {
  status: 'all' | 'available' | 'reserved' | 'sold';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
}
```

---

## Responsive Design

All components follow a mobile-first approach:

**Breakpoints:**
- Mobile: < 768px (sm)
- Tablet: 768px - 1024px (md)
- Desktop: > 1024px (lg)

**Key Responsive Behaviors:**
- **Sidebar**: Hidden on mobile, toggle button visible
- **Header**: Search bar hidden on mobile
- **Grids**: 1 column mobile, 2-4 columns on larger screens
- **Filters**: Stack vertically on mobile, horizontal on desktop

---

## Accessibility

All components follow web accessibility best practices:

- Semantic HTML (button, nav, article, etc.)
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states for all interactive elements
- Color contrast meets WCAG AA standards

---

## Integration Examples

### Complete Dashboard Page

```tsx
'use client';

import { AppShell } from '@/components/layout/AppShell';
import { StatsCards } from '@/components/properties/StatsCards';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { useState } from 'react';
import type { FilterOptions } from '@/types';

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    sortBy: 'newest'
  });

  const stats = {
    totalProperties: 148,
    availableProperties: 42,
    reservedProperties: 58,
    totalValue: 125500000
  };

  const properties = [/* ... */];

  return (
    <AppShell breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-8">
        <StatsCards stats={stats} />
        
        <div>
          <h1 className="text-3xl font-bold mb-6">Properties</h1>
          <PropertyFilters onFilterChange={setFilters} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
```

---

## Best Practices

1. **Always use the `cn()` utility** for conditional classes
2. **Use semantic components** (Card, Badge, Button) instead of div/span
3. **Import types** from `@/types` for consistency
4. **Leverage TypeScript** - all props are fully typed
5. **Handle loading states** with the Button `loading` prop
6. **Use responsive utilities** - design mobile-first, then enhance
7. **Follow the color scheme** - use teal for primary actions, semantic colors for status
8. **Add breadcrumbs** for better navigation context
9. **Test on mobile** - many users access the platform on mobile devices
10. **Document custom components** that extend the library

