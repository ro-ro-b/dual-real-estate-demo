# DUAL Real Estate App Integration Layer - Files Created

## Type Definitions
- `/src/types/dual.ts` - Consolidated type definitions (no `any` usage)
- `/src/types/index.ts` - Type exports

## Environment & Configuration
- `/src/lib/env.ts` - Environment validation with `getConfig()` and `isDualConfigured()`

## Core Libraries
- `/src/lib/wallet.ts` - Wallet utilities (generateMockWallet, shortenAddress, EIP712)
- `/src/lib/db.ts` - SQLite database layer using better-sqlite3
- `/src/lib/dual-client.ts` - DUAL Protocol API client (fully typed, no `any`)
- `/src/lib/action-types.ts` - Action type validation and schemas
- `/src/lib/template-schema.ts` - Property to DUAL template mapping

## Data Provider Architecture
- `/src/lib/data-provider.ts` - Abstract DataProvider interface with DemoDataProvider and DualDataProvider implementations

## Real-time & Caching
- `/src/lib/realtime.ts` - SSE manager for real-time updates
- `/src/lib/indexer-cache.ts` - In-memory cache with TTL
- `/src/lib/webhook-handlers.ts` - Webhook event processing

## React Hooks
- `/src/hooks/useDataProvider.ts` - Data provider access hook
- `/src/hooks/useActionStatus.ts` - Action status polling hook

## UI Components
- `/src/components/admin/OrgSelector.tsx` - Organization selector dropdown
- `/src/components/admin/FaceUploader.tsx` - Face uploader for templates

## API Endpoints

### Real-time
- `/src/app/api/sse/route.ts` - Server-Sent Events endpoint

### Organizations
- `/src/app/api/organizations/route.ts` - List and create organizations

### Templates
- `/src/app/api/templates/route.ts` - List and create templates
- `/src/app/api/faces/route.ts` - Add faces to templates

### Properties
- `/src/app/api/properties/route.ts` - List and mint properties (uses DataProvider)
- `/src/app/api/properties/[propertyId]/route.ts` - Get specific property

### Actions
- `/src/app/api/actions/route.ts` - Create and list actions (validates with action-types)
- `/src/app/api/actions/[actionId]/route.ts` - Get specific action status

### Webhooks
- `/src/app/api/webhooks/route.ts` - Receive and process webhook events
- `/src/app/api/webhooks/subscribe/route.ts` - Manage webhook subscriptions

### Public Endpoints
- `/src/app/api/indexer/route.ts` - Public indexer (no auth required)
- `/src/app/api/auth/route.ts` - Authentication (generates wallet, returns AuthSession)
- `/src/app/api/stats/route.ts` - Dashboard stats

## Configuration Files
- `/.env.example` - Environment variables template
- `/package.json.update` - Dependencies to add (better-sqlite3)

## Architecture Highlights

### Type Safety
- All functions have explicit input/output types
- NO `any` type usage anywhere
- Proper error types with DualApiError including details

### DataProvider Pattern
- Abstract interface for data access
- DemoDataProvider: Uses mock data for development
- DualDataProvider: Uses DUAL API with graceful fallback to demo
- `getDataProvider()` returns appropriate implementation based on DUAL_CONFIGURED

### Graceful Degradation
- When DUAL API is not configured or unavailable, all endpoints fall back to demo mode
- Local SQLite database persists data
- Demo and DUAL providers use same interface

### Real-time Updates
- SSE endpoint for browser connections
- WebhookManager broadcasts events to all connected clients
- Action, property, and webhook events propagated in real-time

### Validation
- All property data validated before minting
- All actions validated for availability given property state
- Webhook signatures verified if DUAL configured

## Environment Variables Required for DUAL Mode

```
DUAL_CONFIGURED=true
DUAL_API_URL=https://api.dual.io
DUAL_API_KEY=xxx
DUAL_ORG_ID=xxx
DUAL_TEMPLATE_ID=xxx
DUAL_WEBHOOK_SECRET=xxx
DUAL_WEBHOOK_CALLBACK_URL=http://localhost:3000/api/webhooks
```

Default database: `file:./dev.db` (SQLite)

## Next Steps

1. Install dependencies:
   ```bash
   npm install better-sqlite3 @types/better-sqlite3
   ```

2. Set environment variables in `.env.local`

3. Test endpoints with demo mode first (DUAL_CONFIGURED=false)

4. When DUAL API is available, set DUAL_CONFIGURED=true and provide API credentials

5. All API responses follow standard format: `{ success: boolean, data?: T, error?: string }`
