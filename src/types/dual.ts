/**
 * Consolidated DUAL Real Estate App Types
 * Single source of truth for all type definitions
 */

// Organization Types
export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  members: OrgMember[];
}

export interface OrgMember {
  address: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface OrgContext {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
}

// Wallet Types
export interface Wallet {
  address: string;
  publicKey?: string;
  isConnected: boolean;
}

// Face Types (used in templates)
export type FaceType = 'image' | '3d' | 'web';

export interface Face {
  type: FaceType;
  url: string;
  metadata?: Record<string, unknown>;
}

// Property Data - Canonical Definition
export interface PropertyData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  squareFeet: number;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'land' | 'Token';
  price: number;
  marketValue: number;
  taxAssessedValue: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  features: string[];
  description: string;
  status: 'available' | 'reserved' | 'sold';
  imageUrl: string;
}

// Explorer Links Type
export interface ExplorerLinks {
  owner: string | null;
  contentHash: string | null;
  integrityHash: string | null;
  org: string | null;
}

// DUAL Object Type
export interface DualObject {
  id: string;
  templateId: string;
  templateName?: string;
  orgId: string;
  ownerWallet: string;
  data: Record<string, unknown>;
  status: 'draft' | 'anchored' | 'failed';
  onChainStatus: 'pending' | 'anchored' | 'failed' | 'none';
  transactionHash?: string;
  createdAt: string;
  updatedAt: string;
  faces: Face[];
  explorerLinks?: ExplorerLinks;
}

// Property Type
export interface Property extends DualObject {
  propertyData: PropertyData;
  contentHash?: string;
  integrityHash?: string;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  version: string;
  orgId: string;
  schema: Record<string, unknown>;
  properties: TemplateProperty[];
  actions: TemplateAction[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
}

export interface TemplateAction {
  name: string;
  description?: string;
  parameters: Record<string, unknown>;
  validStates: string[];
}

export interface TemplateSchema {
  [key: string]: {
    dualField: string;
    type: string;
    transform?: (value: unknown) => unknown;
  };
}

// Action Types
export type ActionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Action {
  id: string;
  objectId: string;
  type: 'RESERVE' | 'TRANSFER' | 'UPDATE_STATUS' | 'BURN' | 'VIEW_ON_CHAIN' | 'MINT';
  actor: string;
  parameters: Record<string, unknown>;
  status: ActionStatus;
  result?: Record<string, unknown>;
  error?: string;
  description: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionRequest {
  objectId: string;
  type: string;
  actor: string;
  parameters: Record<string, unknown>;
}

export interface ActionResult {
  id: string;
  status: ActionStatus;
  result?: Record<string, unknown>;
  error?: string;
}

// Webhook Types
export type WebhookEventType =
  | 'property.anchored'
  | 'property.anchoring_failed'
  | 'action.completed'
  | 'action.failed'
  | 'template.created'
  | 'organization.created';

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  objectId: string;
  orgId?: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEventType[];
  orgId: string;
  active: boolean;
  createdAt: string;
}

// Authentication Types
export interface AuthSession {
  id: string;
  email: string;
  wallet: string;
  orgId: string;
  orgName: string;
  role: 'admin' | 'member' | 'viewer';
  token: string;
  expiresAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Mint/Create Property Types
export interface MintPropertyRequest {
  propertyData: PropertyData;
  ownerWallet: string;
  templateId: string;
  faces?: Face[];
}

export interface MintPropertyResponse {
  id: string;
  objectId: string;
  transactionHash?: string;
  status: 'draft' | 'anchored' | 'failed';
}

// Query & Filter Types
export interface FilterOptions {
  propertyType?: string;
  status?: string;
  orgId?: string;
  templateId?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface DashboardStats {
  totalProperties: number;
  totalActions: number;
  anchoredCount: number;
  failedCount: number;
  pendingCount: number;
  organizations: number;
  templates: number;
  available: number;
  reserved: number;
  sold: number;
  totalValue: number;
  totalValueChange: string;
  anchored?: number;
}
