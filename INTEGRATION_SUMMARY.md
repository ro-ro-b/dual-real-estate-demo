# DUAL Real Estate Integration Layer - Complete Summary

## Overview
The integration layer provides a complete architectural foundation for the DUAL real estate app with full type safety, graceful degradation between demo and production modes, and real-time capabilities.

## Key Architectural Patterns

### 1. Type Consolidation
**File**: `/src/types/dual.ts`
- Single source of truth for all types
- Zero use of `any` type
- Exports: Organization, Wallet, Template, Property, DualObject, Action, Webhook, AuthSession, and response types

### 2. Environment-Driven Configuration
**File**: `/src/lib/env.ts`
- Validates environment variables at startup
- Exports `getConfig()` and `isDualConfigured()` helper
- Supports both DUAL API mode and demo mode
- Clear error messages when required vars are missing

### 3. DataProvider Pattern (Core Architecture)
**File**: `/src/lib/data-provider.ts`

The DataProvider pattern is the KEY architectural piece:
- **DataProvider Interface**: Abstract contract for data access
- **DemoDataProvider**: Uses mock in-memory data for development
- **DualDataProvider**: Calls DUAL API but gracefully falls back to demo on error
- **getDataProvider()**: Returns correct implementation based on DUAL_CONFIGURED

This allows:
- Development/testing without DUAL API
- Seamless production mode when DUAL is available
- Same code path for both scenarios
- No duplicate endpoint logic

### 4. Database Persistence
**File**: `/src/lib/db.ts`
- SQLite-backed using better-sqlite3 (synchronous, no ORM)
- Tables: properties, actions, webhook_events
- Functions: saveProperty, getProperty, listProperties, saveAction, getActions, saveWebhookEvent, getUnprocessedEvents
- Lazy initialization on first call
- Supports migration to more complex DB later

### 5. DUAL API Client
**File**: `/src/lib/dual-client.ts`
- Fully typed, zero `any` usage
- Error type: DualApiError with statusCode and details
- Methods for: Properties, Templates, Actions, Organizations, Webhooks, Sequencer, Storage
- EIP-712 signing placeholder with TODO comment
- `isConfigured()` method for API availability checks

### 6. Action Type System
**File**: `/src/lib/action-types.ts`
- ActionType enum: RESERVE, TRANSFER, UPDATE_STATUS, BURN, VIEW_ON_CHAIN, MINT
- ActionSchema with validation rules for each type
- `getAvailableActions(property)`: Returns valid actions for property's current state
- `validateAction()`: Full parameter validation before execution

### 7. Template Schema Mapping
**File**: `/src/lib/template-schema.ts`
- Maps property data to DUAL template format
- propertyToTemplatePayload: Creates DUAL template
- propertyToObjectPayload: Creates DUAL object for minting
- objectToProperty: Converts DUAL object back to Property type
- validatePropertyData: Full property validation

### 8. Real-time Updates
**Files**: `/src/lib/realtime.ts`, `/src/lib/webhook-handlers.ts`
- SSE endpoint broadcasts to all connected clients
- Webhook processor handles events: property.anchored, property.anchoring_failed, action.completed, action.failed
- Events automatically propagated to frontend via SSE
- EventEmitter-based manager for scalable client tracking

### 9. Caching Strategy
**File**: `/src/lib/indexer-cache.ts`
- In-memory cache with TTL (default 60 seconds)
- Pattern-based invalidation
- Cache keys based on query parameters
- Reduces API calls for frequent queries

### 10. React Hooks
**Files**: `/src/hooks/useDataProvider.ts`, `/src/hooks/useActionStatus.ts`
- useDataProvider: State management for properties, actions, stats
- useActionStatus: Polling hook for action completion (2-second interval, 60-second max)

## API Endpoints Structure

### Public (No Auth)
- `GET /api/indexer?template_id=&org_id=&status=` - Query properties with caching
- `POST /api/auth` - Generate wallet session

### Real-time
- `GET /api/sse` - SSE stream for real-time updates

### Organizations
- `GET /api/organizations` - List orgs
- `POST /api/organizations` - Create org

### Templates
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `POST /api/faces` - Add face to template

### Properties
- `GET /api/properties?filters` - List (uses DataProvider)
- `POST /api/properties` - Mint property (validates with template-schema)
- `GET /api/properties/[id]` - Get specific property

### Actions
- `GET /api/actions?objectId=` - List actions for property
- `POST /api/actions` - Execute action (validates with action-types)
- `GET /api/actions/[id]` - Get action status

### Webhooks
- `POST /api/webhooks` - Receive webhook events (signature verification)
- `GET /api/webhooks/subscribe` - List subscriptions
- `POST /api/webhooks/subscribe` - Create subscription

### Stats
- `GET /api/stats` - Dashboard statistics

## Response Format (Consistent Across All Endpoints)

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string, code?: string, details?: Record<string, unknown> }

// Paginated
{ success: true, data: T[], total: number, page: number, pageSize: number, hasMore: boolean }
```

## File Structure

```
src/
├── types/
│   ├── dual.ts           (consolidated types, no any)
│   └── index.ts          (re-exports)
├── lib/
│   ├── env.ts            (config validation)
│   ├── wallet.ts         (wallet utilities, EIP712)
│   ├── db.ts             (SQLite persistence)
│   ├── dual-client.ts    (DUAL API client, fully typed)
│   ├── action-types.ts   (action validation)
│   ├── template-schema.ts (property mapping)
│   ├── data-provider.ts  (DataProvider interface + implementations)
│   ├── realtime.ts       (SSE manager)
│   ├── webhook-handlers.ts (event processing)
│   └── indexer-cache.ts  (caching)
├── hooks/
│   ├── useDataProvider.ts (data access hook)
│   └── useActionStatus.ts (polling hook)
├── components/admin/
│   ├── OrgSelector.tsx   (org dropdown)
│   └── FaceUploader.tsx   (face uploader)
└── app/api/
    ├── sse/route.ts
    ├── organizations/route.ts
    ├── templates/route.ts
    ├── faces/route.ts
    ├── properties/route.ts
    ├── properties/[id]/route.ts
    ├── actions/route.ts
    ├── actions/[id]/route.ts
    ├── webhooks/route.ts
    ├── webhooks/subscribe/route.ts
    ├── indexer/route.ts
    ├── auth/route.ts
    └── stats/route.ts
```

## Mode Switching

### Demo Mode (Default - DUAL_CONFIGURED=false)
- All endpoints use mock data
- DemoDataProvider returns hardcoded properties/actions
- No database persistence needed
- No API keys required
- Perfect for development/testing

### Production Mode (DUAL_CONFIGURED=true)
- All endpoints use DUAL API
- DualDataProvider calls dualClient methods
- Falls back to demo mode if API unavailable
- Persists to SQLite database
- Webhook signatures verified
- Requires: DUAL_API_URL, DUAL_API_KEY, DUAL_ORG_ID, DUAL_TEMPLATE_ID, DUAL_WEBHOOK_SECRET

## Error Handling

1. **Validation Errors**: 400 Bad Request with error details
2. **Not Found**: 404 with "Property/Organization/Template not found"
3. **API Errors**: 500 with graceful fallback to demo
4. **Webhook Signature**: 401 Unauthorized if signature invalid

All errors follow consistent format with `success: false` flag.

## Database Schema

### properties
- id (TEXT, PK)
- template_id (TEXT)
- org_id (TEXT)
- owner_wallet (TEXT)
- property_data (TEXT, JSON)
- on_chain_status (TEXT)
- created_at (TEXT, ISO)
- updated_at (TEXT, ISO)

### actions
- id (TEXT, PK)
- object_id (TEXT)
- action_type (TEXT)
- actor (TEXT)
- parameters (TEXT, JSON)
- status (TEXT)
- result (TEXT, JSON, nullable)
- created_at (TEXT, ISO)

### webhook_events
- id (TEXT, PK)
- event_type (TEXT)
- object_id (TEXT)
- data (TEXT, JSON)
- processed (INTEGER, 0|1)
- created_at (TEXT, ISO)

## Validation Layers

1. **Property Data**: validatePropertyData() checks all required fields, types, ranges
2. **Actions**: validateAction() checks parameters, getAvailableActions() checks state
3. **Templates**: Schema validation on creation
4. **Webhooks**: Signature verification, event type validation
5. **Environment**: Config validation on startup

## No Dependencies Added to App
- All new code uses only existing deps (Next.js, React, TypeScript)
- Only new external dep: better-sqlite3 (added to package.json)
- No web3/ethers yet (placeholders with TODO for EIP-712)

## Testing Strategy

1. **Dev without DUAL**: Set DUAL_CONFIGURED=false, test all endpoints with demo data
2. **Mock DUAL responses**: DemoDataProvider can be extended with realistic data
3. **Integration tests**: Hit endpoints, verify DataProvider behavior
4. **Webhook tests**: POST to /api/webhooks with test events, verify processing

## Future Enhancements

1. Real EIP-712 signing when ethers/web3 available
2. Database migrations for schema changes
3. Authentication middleware for protected endpoints
4. Role-based access control using org membership
5. File upload handling for faces
6. Advanced filtering and search
7. Batch operations for multiple properties/actions
8. Event replay from webhook_events table
