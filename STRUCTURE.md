# Project Structure and File Organization

## Complete File Tree

```
dual-real-estate-app/
├── src/
│   ├── app/
│   │   ├── globals.css                 # Global Tailwind setup & CSS variables
│   │   └── layout.tsx                  # Root layout with metadata
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx            # Navigation sidebar (collapsible)
│   │   │   ├── Header.tsx             # Top header with breadcrumbs
│   │   │   └── AppShell.tsx           # Layout composition component
│   │   │
│   │   ├── ui/
│   │   │   ├── Badge.tsx              # Reusable badge component
│   │   │   ├── Button.tsx             # Button with variants
│   │   │   ├── Card.tsx               # Card container + sections
│   │   │   └── StatusBadge.tsx        # Property status indicator
│   │   │
│   │   └── properties/
│   │       ├── PropertyCard.tsx       # Individual property display
│   │       ├── PropertyFilters.tsx    # Filter & sort controls
│   │       └── StatsCards.tsx         # Dashboard metrics
│   │
│   ├── lib/
│   │   └── utils.ts                   # Helper functions (cn, formatPrice, etc.)
│   │
│   └── types/
│       └── index.ts                   # TypeScript interfaces
│
├── public/                             # Static assets (future)
│
├── .gitignore                          # Git ignore rules
├── README.md                           # Project overview
├── COMPONENTS.md                       # Component library docs
├── STRUCTURE.md                        # This file
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
├── next.config.js                      # Next.js configuration
├── postcss.config.js                   # PostCSS configuration
└── .eslintrc.json                      # ESLint configuration (optional)
```

## File Descriptions

### Core Application Files

#### `src/app/globals.css`
Global stylesheet with:
- Tailwind directives (@tailwind)
- CSS custom properties for colors
- Custom utility classes
- Scrollbar styling
- Base styles

#### `src/app/layout.tsx`
Root layout component:
- Defines HTML metadata
- Imports globals.css
- Sets up body wrapper
- Entry point for all pages

### Layout Components

#### `src/components/layout/Sidebar.tsx`
- Dark navigation sidebar (slate-900)
- Logo with diamond icon + DUAL branding
- Collapsible/expandable state
- Active route detection (teal highlight)
- Mobile responsive (hidden < 768px)
- User profile section with avatar
- Demo Mode badge

#### `src/components/layout/Header.tsx`
- Sticky top header
- Dynamic breadcrumb navigation
- Search input (placeholder)
- Notification bell with indicator
- User avatar button
- Responsive (search hidden on mobile)

#### `src/components/layout/AppShell.tsx`
- Composes Sidebar + Header + content
- Full-screen layout wrapper
- Proper flex and overflow handling
- Mobile-optimized layout
- Content area with padding

### UI Components

#### `src/components/ui/Badge.tsx`
- 6 variants: default, success, warning, danger, info, outline
- 2 sizes: sm, md
- Rounded pill shape
- Uses cn() for class merging
- Fully customizable with className prop

#### `src/components/ui/Button.tsx`
- 5 variants: primary, secondary, outline, ghost, danger
- 3 sizes: sm, md, lg
- Loading state with spinner
- Disabled state handling
- Smooth transitions
- Full HTML button attributes support

#### `src/components/ui/Card.tsx`
- Main Card component + CardHeader, CardBody, CardFooter
- White background with subtle border
- Rounded corners (rounded-xl)
- Optional hover effect
- Click handler support
- Proper section styling and borders

#### `src/components/ui/StatusBadge.tsx`
- Specialized badge for property status
- 3 status types: available (green), reserved (amber), sold (blue)
- Leading dot indicator
- Maps status to semantic colors

### Property Components

#### `src/components/properties/PropertyCard.tsx`
- Displays single property in grid
- Image with gradient fallback
- Status badge overlay
- On-chain indicator (anchored/pending)
- Bed/bath/sqm icons
- Price and address
- View Details link
- Hover animation (scale + shadow)
- Links to /properties/[id]

#### `src/components/properties/PropertyFilters.tsx`
- Status pills (All, Available, Reserved, Sold)
- Price range inputs (min/max)
- Bedrooms dropdown
- Sort options dropdown
- Real-time filter updates
- Responsive grid layout
- onFilterChange callback

#### `src/components/properties/StatsCards.tsx`
- 4 stat cards in responsive grid
- Total Properties (blue icon)
- Available Properties (green icon)
- Reserved Properties (amber icon)
- Total Value (teal icon)
- Trending indicators with percentages
- Hover effects

### Utility & Type Files

#### `src/lib/utils.ts`
Functions:
- `cn()` - Safe class merging
- `formatPrice()` - USD currency formatting
- `formatAddress()` - Address truncation
- `calculatePriceChange()` - Percentage change calculation

#### `src/types/index.ts`
Type definitions:
- `PropertyData` - Complete property object
- `DashboardStats` - Dashboard metrics
- `FilterOptions` - Filter state type

### Configuration Files

#### `package.json`
Dependencies:
- react, react-dom, next (core)
- lucide-react (icons)
- clsx, tailwind-merge (utilities)
- tailwindcss, postcss, autoprefixer (styling)
- typescript, @types/* (typing)

Scripts:
- `dev` - Development server
- `build` - Production build
- `start` - Production server
- `lint` - ESLint checker

#### `tsconfig.json`
- TypeScript compilation options
- Path aliases (@/*)
- Strict mode enabled
- ES2020 target

#### `tailwind.config.ts`
- Content sources for purging
- Custom teal color palette
- Theme extensions

#### `next.config.js`
- Image optimization settings
- Build configuration

#### `postcss.config.js`
- Tailwind CSS plugin
- Autoprefixer plugin

### Documentation Files

#### `README.md`
Project overview with:
- Installation instructions
- Development/build commands
- Component descriptions
- Usage examples
- Color palette reference
- Feature highlights

#### `COMPONENTS.md`
Comprehensive component documentation:
- Design system overview
- Complete component reference
- Props and interfaces
- Usage examples
- Responsive behavior
- Best practices

#### `STRUCTURE.md`
This file - project organization guide

## Quick Navigation

### To Add a New Component:
1. Create file in appropriate `src/components/` subdirectory
2. Use existing components as templates
3. Export as named export
4. Add TypeScript types
5. Import and test
6. Document in COMPONENTS.md

### To Modify Styling:
1. Global changes → `src/app/globals.css`
2. Tailwind config → `tailwind.config.ts`
3. Component-specific → Use Tailwind classes in component

### To Add New Routes:
Create files in `src/app/(dashboard)/`:
```
src/app/(dashboard)/
├── layout.tsx          # Shared layout with AppShell
└── [route]/
    └── page.tsx        # Page component
```

## Design Patterns Used

1. **Component Composition**: Smaller components combine into larger ones
2. **Props Drilling**: Props passed down for customization
3. **Callback Functions**: onFilterChange, onClick, etc.
4. **TypeScript Interfaces**: Every component fully typed
5. **CSS Utility Classes**: Tailwind-first styling approach
6. **Client Components**: "use client" directive where needed
7. **Responsive Classes**: mobile-first, then md: and lg: prefixes
8. **Semantic HTML**: Proper use of button, nav, article, etc.

## Environment Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Import Path Aliases

All imports use the `@/` alias pointing to `src/`:
```tsx
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { PropertyData } from '@/types';
```

## Color Variables

Defined in `globals.css`:
```css
--background: #f8fafc;
--foreground: #0f172a;
--card: #ffffff;
--primary: #15b8a7;      /* Teal */
--primary-foreground: #ffffff;
--muted: #f1f5f9;
--muted-foreground: #64748b;
--border: #e2e8f0;
--accent: #15b8a7;       /* Teal */
--sidebar: #0f172a;      /* Dark slate */
--sidebar-foreground: #e2e8f0;
```

## Next Steps

1. Set up API endpoints in `src/app/api/`
2. Create dashboard page in `src/app/(dashboard)/admin/page.tsx`
3. Create properties listing in `src/app/(dashboard)/properties/page.tsx`
4. Integrate with DUAL blockchain
5. Add form components if needed
6. Add more specialized components as needed

