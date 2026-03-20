/**
 * DUAL SDK Client â Real Estate App
 * Uses the official @dual/sdk for all DUAL Platform API communication.
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



// Gateway Object Mapper - maps DUAL gateway objects to Property interface
// Reads from obj.metadata (template defaults) + obj.custom (mint-time overrides)
function mapGatewayToProperty(obj: any): any {
  const m = obj.metadata || {};
  const c = obj.custom || {};
  return {
    id: obj.id || '',
    objectId: obj.id || '',
    templateId: obj.template_id || '',
    status: obj.content_hash ? 'anchored' : 'draft',
    owner: obj.owner || '',
    propertyData: {
      address: c.address || m.name || 'Property Token',
      city: c.city || '',
      state: c.state || '',
      zipCode: c.zipCode || '',
      country: c.country || '',
      latitude: c.latitude ? parseFloat(c.latitude) : 0,
      longitude: c.longitude ? parseFloat(c.longitude) : 0,
      squareFeet: c.squareFeet ? parseInt(c.squareFeet) : 0,
      squareMeters: c.squareMeters ? parseInt(c.squareMeters) : 0,
      bedrooms: c.bedrooms ? parseInt(c.bedrooms) : 0,
      bathrooms: c.bathrooms ? parseInt(c.bathrooms) : 0,
      yearBuilt: c.yearBuilt ? parseInt(c.yearBuilt) : 0,
      propertyType: c.propertyType || m.category || 'Token',
      price: c.price ? parseFloat(c.price) : 0,
      marketValue: c.marketValue ? parseFloat(c.marketValue) : 0,
      taxAssessedValue: c.taxAssessedValue ? parseFloat(c.taxAssessedValue) : 0,
      ownerName: c.ownerName || '',
      ownerEmail: c.ownerEmail || '',
      ownerPhone: c.ownerPhone || '',
      features: c.features || [],
      description: c.description || m.description || '',
      status: c.status || 'available',
      imageUrl: c.imageUrl || m.image?.url || '/placeholder-property.svg',
    },
    provenance: {
      verified: !!obj.content_hash,
      txHash: obj.content_hash || '',
      chain: 'BLOCKv EVM',
      confirmations: obj.content_hash ? 10 : 0,
    },
    contentHash: obj.content_hash || '',
    integrityHash: obj.integrity_hash || '',
    actions: [],
    createdAt: obj.when_created || new Date().toISOString(),
    updatedAt: obj.when_modified || new Date().toISOString(),
    explorerLinks: {
      owner: obj.owner ? `https://32f.blockv.io/address/${obj.owner}` : null,
      contentHash: null,
      integrityHash: null,
      org: obj.org_id ? `https://32f.blockv.io/address/0xed75538AeDD6E45FfadF30B9EEC68A3959654bF9` : null,
    },
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
          const query = { template_id: process.env.DUAL_TEMPLATE_ID || undefined, ...filters };
          const result = await c.objects.listObjects(query as any);
          return (result?.objects || result?.data || []).map((obj: any) => mapGatewayToProperty(obj));
    },
    listObjects: async (query: Record<string, unknown>) => {
          const c = getDualClient();
          return c.objects.listObjects({ ...query, template_id: process.env.DUAL_TEMPLATE_ID || undefined });
    },
    getProperty: async (id: string) => {
          const c = getDualClient();
          const obj = await c.objects.getObject(id);
          return obj ? mapGatewayToProperty(obj) : null;
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
          return (result?.actions || result?.data || []).map((a: any) => ({ id: a.id, type: a.action_type || a.type, objectId: a.object_id, status: a.status || 'completed', actor: a.initiator || a.owner, parameters: a.parameters || {}, timestamp: a.when_created || new Date().toISOString(), description: a.description || '', createdAt: a.when_created || new Date().toISOString(), updatedAt: a.when_modified || new Date().toISOString() }));
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
