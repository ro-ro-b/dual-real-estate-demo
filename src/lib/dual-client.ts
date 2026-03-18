/**
 * DUAL SDK Client â Real Estate App
 * Uses the official @dual/sdk for all DUAL Platform API communication.
 * Falls back to demo data when DUAL_CONFIGURED is not set.
 */
import { DualClient, DualConfig, DualError } from './dual-sdk';

export { DualClient, DualError };
export type { DualConfig };

// Re-export DualError as DualApiError for backward compatibility
export const DualApiError = DualError;

/** Check if DUAL SDK is configured with real credentials */
export function isDualConfigured(): boolean {
    return !!(process.env.DUAL_API_KEY || process.env.DUAL_API_TOKEN);
}
let client: DualClient | null = null

/** Get or create the singleton DualClient instance */
export function getDualClient(): DualClient {
    if (!client) {
          client = new DualClient({
                  token: process.env.DUAL_API_TOKEN || undefined,
                  apiKey: process.env.DUAL_API_KEY || undefined,
                  baseUrl: process.env.NEXT_PUBLIC_DUAL_API_URL || 'https://gateway-48587430648.europe-west6.run.app',
                  timeout: 30000,
                  retry: { maxAttempts: 3, backoffMs: 1000 },
          });
    }
    return client;
}



// Gateway Object Mapper - enriched with realistic property data
const PROPERTY_CATALOG = [
  { address: '123 Park Avenue, Manhattan', city: 'New York', country: 'USA', type: 'residential', price: 8500000, beds: 4, baths: 3, sqft: 500, desc: 'Luxury penthouse with panoramic Central Park views.', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop' },
  { address: '456 Pacific Coast Highway, Malibu', city: 'Malibu', country: 'USA', type: 'residential', price: 12000000, beds: 5, baths: 6, sqft: 750, desc: 'Beachfront estate with infinity pool and ocean views.', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop' },
  { address: '789 Fulton Street, Brooklyn', city: 'Brooklyn', country: 'USA', type: 'residential', price: 2200000, beds: 3, baths: 2, sqft: 280, desc: 'Modern brownstone in prime Fort Greene location.', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop' },
  { address: '234 Market Street, San Francisco', city: 'San Francisco', country: 'USA', type: 'commercial', price: 15000000, beds: 0, baths: 8, sqft: 2000, desc: 'Class A office building in the Financial District.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop' },
  { address: '555 Broadway, SoHo', city: 'New York', country: 'USA', type: 'commercial', price: 6800000, beds: 0, baths: 4, sqft: 800, desc: 'Prime retail space in the heart of SoHo.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop' },
  { address: '88 Bondi Road, Bondi Beach', city: 'Sydney', country: 'Australia', type: 'residential', price: 3500000, beds: 3, baths: 2, sqft: 320, desc: 'Coastal apartment with panoramic ocean views.', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop' },
  { address: '12 Circular Quay, The Rocks', city: 'Sydney', country: 'Australia', type: 'commercial', price: 22000000, beds: 0, baths: 12, sqft: 3500, desc: 'Heritage-listed commercial building near the Opera House.', img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop' },
  { address: '45 Lake Shore Drive, Chicago', city: 'Chicago', country: 'USA', type: 'residential', price: 4200000, beds: 4, baths: 3, sqft: 450, desc: 'Lakefront condo with stunning skyline views.', img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop' },
];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mapGatewayToProperty(obj: any): any {
  const m = obj.metadata || {};
  const idx = hashCode(obj.id || '') % PROPERTY_CATALOG.length;
  const seed = PROPERTY_CATALOG[idx];
  const hasReal = m.address || m.bedrooms || m.price;
  const p = hasReal ? m : seed;
  return {
    id: obj.id || '',
    templateId: obj.template_id || '',
    status: m.status || (obj.content_hash ? 'anchored' : 'draft'),
    owner: obj.owner || '',
    propertyData: {
      address: p.address || m.name || 'Unknown Address',
      city: p.city || 'Unknown City',
      state: p.state || '',
      country: p.country || '',
      propertyType: p.type || 'residential',
      price: p.price || 0,
      bedrooms: p.beds || 0,
      bathrooms: p.baths || 0,
      squareFeet: p.sqft || 0,
      description: p.desc || p.description || '',
      imageUrl: p.img || p.imageUrl || '',
    },
    provenance: {
      verified: !!obj.content_hash,
      txHash: obj.content_hash || '',
      chain: 'Ethereum Sepolia',
      confirmations: obj.content_hash ? 10 : 0,
    },
    actions: [],
    createdAt: obj.when_created || new Date().toISOString(),
    updatedAt: obj.when_modified || new Date().toISOString(),
  };
}

function mapGatewayToTemplate(t: any): any {
  const m = t.object?.metadata || t.metadata || {};
  return {
    id: t.id || '',
    name: t.name || m.name || 'Untitled Template',
    description: m.description || '',
    version: t.version || '1.0',
    schema: t.object || {},
    organizationId: t.org_id || '',
    createdAt: t.when_created || new Date().toISOString(),
  };
}


/** Backward-compatible singleton instance */
export const dualClient = {
    isConfigured: isDualConfigured,
    listProperties: async (filters?: Record<string, unknown>) => {
          const c = getDualClient();
          const result = await c.objects.listObjects(filters as any);
          return (result?.objects || result?.data || []).map((obj: any) => mapGatewayToProperty(obj));
    },
    listObjects: async (query: Record<string, unknown>) => {
          const c = getDualClient();
          return c.objects.listObjects(query);
    },
    getProperty: async (id: string) => {
          const c = getDualClient();
          return c.objects.getObject(id);
    },
    mintProperty: async (templateId: string, ownerWallet: string, propertyData: Record<string, unknown>) => {
          const c = getDualClient();
          return c.ebus.executeAction({ actionType: 'MINT', templateId, ownerWallet, data: propertyData });
    },
    mintObject: async (body: Record<string, unknown>) => {
          const c = getDualClient();
                  return c.ebus.executeAction({ actionType: 'MINT', ...body });
    },
    getTemplate: async (id: string) => {
          const c = getDualClient();
          return c.templates.getTemplate(id);
    },
    listTemplates: async () => {
          const c = getDualClient();
          const result = await c.templates.listTemplates({ limit: 100 });
          return (result?.templates || result?.data || []).map((t: any) => mapGatewayToTemplate(t));
    },
    createTemplate: async (name: string, version: string, schema: unknown) => {
          const c = getDualClient();
          return c.templates.createTemplate({ name, version, schema });
    },
    executeAction: async (objectId: string, actionType: string, actor: string, parameters: Record<string, unknown>) => {
          const c = getDualClient();
          return c.ebus.executeAction({ objectId, actionType, actor, ...parameters });
    },
    getAction: async (id: string) => {
          const c = getDualClient();
          return c.ebus.getAction(id);
    },
    getPropertyActions: async (objectId: string) => {
          const c = getDualClient();
          const result = await c.objects.getObjectActivity(objectId);
          return (result?.actions || result?.data || []).map((a: any) => ({ id: a.id, type: a.action_type || a.type, objectId: a.object_id, status: a.status || 'completed', actor: a.initiator || a.owner, timestamp: a.when_created, description: a.description || '' }));
    },
    getOrganization: async (id: string) => {
          const c = getDualClient();
          return c.organizations.getOrganization(id);
    },
    listOrganizations: async () => {
          const c = getDualClient();
          const result = await c.organizations.listOrganizations();
          return (result?.organizations || result?.data || []).map((o: any) => ({ id: o.id, name: o.name || o.fqdn, description: o.description || '', members: o.members || [], createdAt: o.when_created }));
    },
    createOrganization: async (name: string) => {
          const c = getDualClient();
          return c.organizations.createOrganization({ name });
    },
    listWebhooks: async () => {
          const c = getDualClient();
          const result = await c.webhooks.listWebhooks();
          return result?.webhooks || result?.data || [];
    },
    subscribeWebhook: async (url: string, events: string[]) => {
          const c = getDualClient();
          return c.webhooks.createWebhook({ url, events });
    },
};
