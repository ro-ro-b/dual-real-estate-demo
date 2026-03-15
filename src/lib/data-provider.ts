/**
 * Abstract DataProvider interface with Demo and DUAL implementations
 */

import {
  Action,
  ActionRequest,
  ActionResult,
  DashboardStats,
  FilterOptions,
  MintPropertyRequest,
  MintPropertyResponse,
  Organization,
  Property,
  Template,
} from '@/types';
import { dualClient, DualApiError } from './dual-client';
import { isDualConfigured } from './env';
import * as db from './db';
import { generateMockWallet } from './wallet';

/**
 * DataProvider Interface
 */
export interface DataProvider {
  // Properties
  listProperties(filters: FilterOptions): Promise<{ properties: Property[]; total: number }>;
  getProperty(id: string): Promise<Property | null>;
  mintProperty(data: MintPropertyRequest): Promise<MintPropertyResponse>;

  // Actions
  executeAction(data: ActionRequest): Promise<ActionResult>;
  getPropertyActions(objectId: string): Promise<Action[]>;

  // Templates
  getTemplate(id: string): Promise<Template | null>;
  listTemplates(): Promise<Template[]>;

  // Organizations
  getOrganization(id: string): Promise<Organization | null>;

  // Stats
  getDashboardStats(): Promise<DashboardStats>;
}

/**
 * Demo Data Provider - uses mock data
 */
export class DemoDataProvider implements DataProvider {
  private demoData: {
    properties: Property[];
    actions: Action[];
    templates: Template[];
    organizations: Organization[];
  };

  constructor() {
    // Import demo data - will be populated by the app
    this.demoData = {
      properties: [],
      actions: [],
      templates: [],
      organizations: [],
    };
  }

  async listProperties(filters: FilterOptions): Promise<{ properties: Property[]; total: number }> {
    let filtered = [...this.demoData.properties];

    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyData.propertyType === filters.propertyType);
    }
    if (filters.city) {
      filtered = filtered.filter(p => p.propertyData.city === filters.city);
    }
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      properties: filtered.slice(start, end),
      total: filtered.length,
    };
  }

  async getProperty(id: string): Promise<Property | null> {
    return this.demoData.properties.find(p => p.id === id) || null;
  }

  async mintProperty(data: MintPropertyRequest): Promise<MintPropertyResponse> {
    const id = `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const property: Property = {
      id,
      templateId: data.templateId,
      orgId: 'demo-org',
      ownerWallet: data.ownerWallet,
      propertyData: data.propertyData,
      data: { ...data.propertyData } as Record<string, unknown>,
      status: 'draft',
      onChainStatus: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      faces: data.faces || [],
    };

    this.demoData.properties.push(property);

    return {
      id,
      objectId: id,
      status: 'draft',
    };
  }

  async executeAction(data: ActionRequest): Promise<ActionResult> {
    const action: Action = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      objectId: data.objectId,
      type: data.type as any,
      actor: data.actor,
      parameters: data.parameters,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.demoData.actions.push(action);

    return {
      id: action.id,
      status: 'pending',
    };
  }

  async getPropertyActions(objectId: string): Promise<Action[]> {
    return this.demoData.actions.filter(a => a.objectId === objectId);
  }

  async getTemplate(id: string): Promise<Template | null> {
    return this.demoData.templates.find(t => t.id === id) || null;
  }

  async listTemplates(): Promise<Template[]> {
    return this.demoData.templates;
  }

  async getOrganization(id: string): Promise<Organization | null> {
    return this.demoData.organizations.find(o => o.id === id) || null;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return {
      totalProperties: this.demoData.properties.length,
      totalActions: this.demoData.actions.length,
      anchoredCount: this.demoData.properties.filter(p => p.status === 'anchored').length,
      failedCount: this.demoData.properties.filter(p => p.status === 'failed').length,
      pendingCount: this.demoData.properties.filter(p => p.status === 'draft').length,
      organizations: this.demoData.organizations.length,
      templates: this.demoData.templates.length,
    };
  }
}

/**
 * DUAL Data Provider - uses DUAL API with fallback to demo
 */
export class DualDataProvider implements DataProvider {
  private demoProvider: DemoDataProvider;

  constructor() {
    this.demoProvider = new DemoDataProvider();
  }

  async listProperties(filters: FilterOptions): Promise<{ properties: Property[]; total: number }> {
    try {
      const objects = await dualClient.listProperties({
        templateId: filters.templateId,
        orgId: filters.orgId,
        status: filters.status,
      });

      // Convert DualObjects to Properties
      let properties = objects.map(obj => ({
        ...obj,
        propertyData: obj.data as any,
      })) as Property[];

      // Apply local filters
      if (filters.city) {
        properties = properties.filter(p => p.propertyData.city === filters.city);
      }
      if (filters.propertyType) {
        properties = properties.filter(p => p.propertyData.propertyType === filters.propertyType);
      }

      const page = filters.page || 1;
      const pageSize = filters.pageSize || 20;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        properties: properties.slice(start, end),
        total: properties.length,
      };
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, falling back to demo data');
        return this.demoProvider.listProperties(filters);
      }
      throw error;
    }
  }

  async getProperty(id: string): Promise<Property | null> {
    try {
      const obj = await dualClient.getProperty(id);
      return {
        ...obj,
        propertyData: obj.data as any,
      } as Property;
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, checking local DB');
        const dbProp = db.getProperty(id);
        if (dbProp) {
          return {
            id: dbProp.id,
            templateId: dbProp.template_id,
            orgId: dbProp.org_id,
            ownerWallet: dbProp.owner_wallet,
            propertyData: JSON.parse(dbProp.property_data) as any,
            data: JSON.parse(dbProp.property_data),
            status: 'draft' as any,
            onChainStatus: dbProp.on_chain_status as any,
            createdAt: dbProp.created_at,
            updatedAt: dbProp.updated_at,
            faces: [],
          };
        }
      }
      return null;
    }
  }

  async mintProperty(data: MintPropertyRequest): Promise<MintPropertyResponse> {
    try {
      const payload = { ...data.propertyData } as Record<string, unknown>;
      const obj = await dualClient.mintProperty(data.templateId, data.ownerWallet, payload);

      // Also save to local DB
      db.saveProperty(obj.id, data.templateId, 'org-id', data.ownerWallet, payload);

      return {
        id: obj.id,
        objectId: obj.id,
        status: obj.status as any,
      };
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, saving locally');

        const id = `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        db.saveProperty(id, data.templateId, 'demo-org', data.ownerWallet, { ...data.propertyData } as Record<string, unknown>);

        return {
          id,
          objectId: id,
          status: 'draft',
        };
      }
      throw error;
    }
  }

  async executeAction(data: ActionRequest): Promise<ActionResult> {
    try {
      const action = await dualClient.executeAction(
        data.objectId,
        data.type,
        data.actor,
        data.parameters
      );

      db.saveAction(action.id, data.objectId, data.type, data.actor, data.parameters, action.status);

      return {
        id: action.id,
        status: action.status,
      };
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, saving action locally');

        const id = `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        db.saveAction(id, data.objectId, data.type, data.actor, data.parameters, 'pending');

        return {
          id,
          status: 'pending',
        };
      }
      throw error;
    }
  }

  async getPropertyActions(objectId: string): Promise<Action[]> {
    try {
      return await dualClient.getPropertyActions(objectId);
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, checking local DB');
        const dbActions = db.getActions(objectId);
        return dbActions.map(a => ({
          id: a.id,
          objectId: a.object_id,
          type: a.action_type as any,
          actor: a.actor,
          parameters: JSON.parse(a.parameters),
          status: a.status as any,
          result: a.result ? JSON.parse(a.result) : undefined,
          createdAt: a.created_at,
          updatedAt: a.created_at,
        }));
      }
      return [];
    }
  }

  async getTemplate(id: string): Promise<Template | null> {
    try {
      return await dualClient.getTemplate(id);
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, template not available');
      }
      return null;
    }
  }

  async listTemplates(): Promise<Template[]> {
    try {
      return await dualClient.listTemplates();
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, no templates available');
      }
      return [];
    }
  }

  async getOrganization(id: string): Promise<Organization | null> {
    try {
      return await dualClient.getOrganization(id);
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, org not available');
      }
      return null;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const properties = await dualClient.listProperties();

      return {
        totalProperties: properties.length,
        totalActions: 0,
        anchoredCount: properties.filter(p => p.status === 'anchored').length,
        failedCount: properties.filter(p => p.status === 'failed').length,
        pendingCount: properties.filter(p => p.status === 'draft').length,
        organizations: 1,
        templates: (await dualClient.listTemplates()).length,
      };
    } catch (error) {
      if (error instanceof DualApiError) {
        console.log('DUAL API not configured, using local stats');
        return this.demoProvider.getDashboardStats();
      }
      throw error;
    }
  }
}

/**
 * Get appropriate data provider based on configuration
 */
export function getDataProvider(): DataProvider {
  if (isDualConfigured()) {
    return new DualDataProvider();
  }
  return new DemoDataProvider();
}
