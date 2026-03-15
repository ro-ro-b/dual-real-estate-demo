# Component System Architecture

## Visual Component Hierarchy

```
AppShell (Main Layout)
├── Sidebar
│   ├── Logo Section
│   │   └── Diamond Icon + "DUAL" + "Real Estate"
│   ├── Navigation Sections
│   │   ├── Dashboard Link
│   │   ├── Properties Link
│   │   ├── Mint Property Link
│   │   ├── Webhooks Link
│   │   └── Settings Link
│   ├── User Section
│   │   ├── Avatar
│   │   ├── User Info
│   │   └── Demo Mode Badge
│   └── Toggle Button
│
├── Header
│   ├── Breadcrumbs
│   ├── Search Input
│   └── Right Actions
│       ├── Notification Bell (+ indicator)
│       └── User Avatar
│
└── Content Area
    ├── StatsCards (if dashboard)
    │   ├── Total Properties Card
    │   │   ├── Icon (blue)
    │   │   ├── Value
    │   │   ├── Change % (trending)
    │   │   └── Change Label
    │   ├── Available Card
    │   │   ├── Icon (green)
    │   │   ├── Value
    │   │   ├── Change % (trending)
    │   │   └── Change Label
    │   ├── Reserved Card
    │   │   ├── Icon (amber)
    │   │   ├── Value
    │   │   ├── Change % (trending)
    │   │   └── Change Label
    │   └── Total Value Card
    │       ├── Icon (teal)
    │       ├── Value
    │       ├── Change % (trending)
    │       └── Change Label
    │
    ├── PropertyFilters
    │   ├── Status Pills
    │   │   ├── All
    │   │   ├── Available
    │   │   ├── Reserved
    │   │   └── Sold
    │   ├── Price Min Input
    │   ├── Price Max Input
    │   ├── Bedrooms Dropdown
    │   └── Sort Dropdown
    │
    └── PropertyGrid
        └── PropertyCard(s) [repeating]
            ├── Image/Placeholder
            ├── Status Badge (overlay)
            ├── On-Chain Indicator (dot)
            ├── Price
            ├── Title
            ├── Address
            ├── Specs Row
            │   ├── Bedrooms (icon)
            │   ├── Bathrooms (icon)
            │   └── Square Meters (icon)
            └── View Details Link
```

## Component Dependency Graph

```
UI Layer
├── Badge (standalone)
├── StatusBadge (extends Badge)
├── Button (standalone)
└── Card (standalone)
    ├── CardHeader
    ├── CardBody
    └── CardFooter

Layout Layer
├── Sidebar (uses icons from lucide-react)
├── Header (uses Badge, Button, icons)
└── AppShell (composes Sidebar + Header)

Feature Layer
├── PropertyCard (uses Card, StatusBadge, icons, formatPrice)
├── PropertyFilters (uses Button, inputs)
└── StatsCards (uses Card, icons, formatPrice)

Page Layer
└── Pages use AppShell + Feature components
```

## Component Communication Flow

```
Page Component
    ↓
    ├─→ AppShell (provides layout structure)
    │    ├─→ Sidebar (displays navigation)
    │    ├─→ Header (displays breadcrumbs)
    │    └─→ [Page children]
    │
    ├─→ StatsCards
    │    └─→ Card (for each stat)
    │
    ├─→ PropertyFilters
    │    ├─→ Button (for pills)
    │    ├─→ Input (for price)
    │    └─→ Select (for dropdowns)
    │    └─→ (onFilterChange callback)
    │
    └─→ PropertyCard (in a grid)
         ├─→ Card (container)
         ├─→ StatusBadge (status)
         └─→ Icons from lucide-react
```

## Data Flow Example

```
Page State: filters
    ↓
PropertyFilters Component
    ↓
    ├─→ User changes filter
    ├─→ onFilterChange callback fired
    ├─→ Page state updated
    ↓
Page state used to:
    ├─→ Filter property list
    ├─→ Sort property list
    └─→ Pass filtered properties to PropertyCard(s)
```

## Color Usage Guide

### Sidebar Section
```
Background: slate-900 (#0f172a)
Text: slate-100
Accent Active: teal-500 (#15b8a7)
Hover: slate-800
Border: slate-800
```

### Header Section
```
Background: white
Border: slate-200
Text: slate-900
Accent: teal-600
Icon: slate-600
```

### Content Area
```
Background: slate-50 (#f8fafc)
Cards: white
Borders: slate-200
Text: slate-900
Muted: slate-600
```

### Status Colors
```
Available: green-500 (bg: green-100, text: green-800)
Reserved: amber-500 (bg: amber-100, text: amber-800)
Sold: blue-500 (bg: blue-100, text: blue-800)
```

### Badge Variants
```
default:  slate-100 bg, slate-800 text
success:  green-100 bg, green-800 text
warning:  amber-100 bg, amber-800 text
danger:   red-100 bg, red-800 text
info:     blue-100 bg, blue-800 text
outline:  slate-200 border, slate-700 text
```

## Responsive Behavior Matrix

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Sidebar | Hidden | Hidden | Visible |
| Sidebar Toggle | Visible | Visible | Hidden |
| Header | Visible | Visible | Visible |
| Search Bar | Hidden | Visible | Visible |
| PropertyFilters | Stack | Stack | Grid |
| PropertyGrid | 1 col | 2 col | 3-4 col |
| StatsCards | 1 col | 2 col | 4 col |

## Interaction Patterns

### Button States
```
Normal → Hover → Active → Disabled
```

### Card States
```
Normal → Hover (if hover prop) → Click (if onClick prop)
```

### Filter Updates
```
User Input → Filter State Change → onFilterChange Callback → Page Re-render
```

### Navigation
```
Click Link → Active Route Detected → Sidebar Highlight Updated → Page Renders
```

## Styling Patterns

### Padding
- Sidebar: `px-6 py-4` for sections, `px-3 py-2.5` for nav items
- Header: `px-6 py-4` for header
- Cards: `px-6 py-4` for body, sections
- Buttons: Varies by size (sm/md/lg)

### Gaps
- Components: `gap-2` to `gap-6` depending on context
- Grid: `gap-6` for property grids

### Borders
- Cards: `border border-slate-200`
- Sidebar sections: `border-b border-slate-800`
- Inputs: `border border-slate-300` with focus ring

### Transitions
- All interactive: `transition-smooth` utility (200ms ease-out)
- Animations: Scale on hover, color transitions

## Accessibility Features

### Keyboard Navigation
- All buttons and links focusable
- Sidebar navigation via keyboard
- Focus states visible

### ARIA
- Navigation landmarks
- Button roles
- Badge semantic meaning

### Color Contrast
- All text meets WCAG AA (4.5:1)
- Status indicators have dot + text
- Interactive elements have clear states

### Semantic HTML
- `<button>` for buttons
- `<nav>` for navigation
- `<article>` for cards
- `<header>` for header
- Proper heading hierarchy

## Performance Optimizations

### Code Splitting
- Components in separate files
- Lazy load as needed

### CSS
- Tailwind purges unused styles
- Custom scrollbar (minimal CSS)

### Images
- Image component from Next.js
- Optimization enabled

### Client Components
- Marked with "use client" where needed
- Minimal client JS

## Extension Points

### Easy to Extend
1. **Badge**: Add variant in variantStyles object
2. **Button**: Add variant or size
3. **Card**: Add new CardSection variant
4. **PropertyCard**: Add new property fields/display
5. **Filters**: Add new filter type

### Common Additions
- Modal/Dialog component
- Tooltip component
- Dropdown menu component
- Table component
- Form input wrapper component

