/**
 * DUAL SDK Client — Real Estate App
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

let client: DualClient | null = null;

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

/** Backward-compatible singleton instance */
export const dualClient = {
  isConfigured: isDualConfigured,
  listProperties: async (filters?: Record<string, unknown>) => {
    const c = getDualClient();
    const result = await c.objects.listObjects(filters as any);
    return result?.objects || result?.data || result || [];
  },
  getProperty: async (id: string) => {
    const c = getDualClient();
    return c.objects.getObject(id);
  },
  mintProperty: async (templateId: string, ownerWallet: string, propertyData: Record<string, unknown>) => {
    const c = getDualClient();
    return c.ebus.executeAction({ actionType: 'MINT', templateId, ownerWallet, data: propertyData });
  },
  getTemplate: async (id: string) => {
    const c = getDualClient();
    return c.templates.getTemplate(id);
  },
  listTemplates: async () => {
    const c = getDualClient();
    const result = await c.templates.listTemplates({ limit: 100 });
    return result?.templates || result?.data || result || [];
  },
  executeAction: async (body: Record<string, unknown>) => {
    const c = getDualClient();
    return c.executeAction(body);
  },
  getAction: async (id: string) => {
    const c = getDualClient();
    return c.ebus.getAction(id);
  },
  getPropertyActions: async (objectId: string) => {
    const c = getDualClient();
    const result = await c.objects.getObjectActivity(objectId);
    return result?.actions || result?.data || result || [];
  },
  getOrganization: async (id: string) => {
    const c = getDualClient();
    return c.organizations.getOrganization(id);
  },
  listOrganizations: async () => {
    const c = getDualClient();
    const result = await c.organizations.listOrganizations();
    return result?.organizations || result?.data || result || [];
  },
};
