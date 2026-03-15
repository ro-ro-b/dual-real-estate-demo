/**
 * DUAL Protocol API Client
 * Properly typed, no 'any' usage
 */

import { getConfig } from './env';
import {
  Organization,
  Template,
  Property,
  DualObject,
  Webhook,
  WebhookEventType,
  Action,
  ActionResult,
} from '@/types';

export class DualApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = 'DualApiError';
  }
}

export class DualClient {
  private baseUrl: string;
  private apiKey: string;
  private orgId: string;
  private configured: boolean;

  constructor() {
    try {
      const config = getConfig();
      this.baseUrl = config.dualApiUrl;
      this.apiKey = config.dualApiKey;
      this.orgId = config.dualOrgId;
      this.configured = config.isDualConfigured;
    } catch {
      this.baseUrl = '';
      this.apiKey = '';
      this.orgId = '';
      this.configured = false;
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    if (!this.configured) {
      throw new DualApiError('DUAL API not configured', 503, { message: 'Set DUAL_CONFIGURED=true' });
    }

    const url = `${this.baseUrl}${path}`;
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      throw new DualApiError(
        `DUAL API Error: ${response.statusText}`,
        response.status,
        data
      );
    }

    return data as T;
  }

  // Properties
  async listProperties(filters?: Record<string, unknown>): Promise<DualObject[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const path = `/objects?${queryParams.toString()}`;
    const response = await this.request<{ objects: DualObject[] }>('GET', path);
    return response.objects;
  }

  async getProperty(objectId: string): Promise<DualObject> {
    return this.request<DualObject>('GET', `/objects/${objectId}`);
  }

  async mintProperty(
    templateId: string,
    ownerWallet: string,
    propertyData: Record<string, unknown>
  ): Promise<DualObject> {
    const response = await this.request<DualObject>('POST', '/objects', {
      templateId,
      ownerWallet,
      data: propertyData,
    });
    return response;
  }

  // Templates
  async getTemplate(templateId: string): Promise<Template> {
    return this.request<Template>('GET', `/templates/${templateId}`);
  }

  async listTemplates(): Promise<Template[]> {
    const response = await this.request<{ templates: Template[] }>('GET', '/templates');
    return response.templates;
  }

  async createTemplate(
    name: string,
    version: string,
    schema: Record<string, unknown>
  ): Promise<Template> {
    return this.request<Template>('POST', '/templates', {
      name,
      version,
      schema,
      orgId: this.orgId,
    });
  }

  // Actions
  async executeAction(
    objectId: string,
    actionType: string,
    actor: string,
    parameters: Record<string, unknown>
  ): Promise<Action> {
    return this.request<Action>('POST', `/objects/${objectId}/actions`, {
      actionType,
      actor,
      parameters,
    });
  }

  async getAction(actionId: string): Promise<Action> {
    return this.request<Action>('GET', `/actions/${actionId}`);
  }

  async getPropertyActions(objectId: string): Promise<Action[]> {
    const response = await this.request<{ actions: Action[] }>('GET', `/objects/${objectId}/actions`);
    return response.actions;
  }

  // Organizations
  async createOrganization(name: string): Promise<Organization> {
    return this.request<Organization>('POST', '/organizations', { name });
  }

  async getOrganization(orgId: string): Promise<Organization> {
    return this.request<Organization>('GET', `/organizations/${orgId}`);
  }

  async listOrganizations(): Promise<Organization[]> {
    const response = await this.request<{ organizations: Organization[] }>('GET', '/organizations');
    return response.organizations;
  }

  async addOrganizationMember(
    orgId: string,
    address: string,
    role: 'admin' | 'member' | 'viewer'
  ): Promise<Organization> {
    return this.request<Organization>('POST', `/organizations/${orgId}/members`, {
      address,
      role,
    });
  }

  // Webhooks
  async subscribeWebhook(
    url: string,
    events: WebhookEventType[]
  ): Promise<Webhook> {
    return this.request<Webhook>('POST', '/webhooks', {
      url,
      events,
      orgId: this.orgId,
    });
  }

  async listWebhooks(): Promise<Webhook[]> {
    const response = await this.request<{ webhooks: Webhook[] }>('GET', '/webhooks');
    return response.webhooks;
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.request<Record<string, unknown>>('DELETE', `/webhooks/${webhookId}`);
  }

  // Sequencer
  async getBatch(batchId: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('GET', `/batches/${batchId}`);
  }

  async listBatches(): Promise<Record<string, unknown>[]> {
    const response = await this.request<{ batches: Record<string, unknown>[] }>('GET', '/batches');
    return response.batches;
  }

  // Storage
  async uploadFile(fileData: Buffer, filename: string): Promise<string> {
    if (!this.configured) {
      throw new DualApiError('DUAL API not configured', 503);
    }

    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(fileData)]), filename);

    const response = await fetch(`${this.baseUrl}/storage/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new DualApiError(`Upload failed: ${response.statusText}`, response.status);
    }

    const data = (await response.json()) as { url?: string };
    if (!data.url) {
      throw new DualApiError('No URL returned from upload', 400);
    }

    return data.url;
  }

  async getFileUrl(fileId: string): Promise<string> {
    const response = await this.request<{ url: string }>('GET', `/storage/${fileId}`);
    return response.url;
  }

  // EIP-712 Signing (Placeholder)
  signRequest(_payload: Record<string, unknown>): string {
    // TODO: Implement EIP-712 signing when web3 provider is available
    // For now return a placeholder signature
    return '0x' + 'b'.repeat(130); // 65 bytes (130 hex chars)
  }
}

export const dualClient = new DualClient();
