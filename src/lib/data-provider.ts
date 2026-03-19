/**
 * DataProvider interface for DUAL Platform API
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
import { isDualConfigured } from './env'
import * as db from './db';
import { generateWallet } from './wallet';

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
 * DUAL Data Provider - uses DUAL API only
 */
export class DualDataProvider implements DataProvider {
  async listProperties(filters: FilterOptions): Promise<{ properties: Property[]; total: number }> {
    const objects = await dualClient.listProperties({
      templateId: filters.templateId,
      orgId: filters.orgId,
      status: filters.status,
    });

    // Convert DualObjects to Properties
    let properties = objects.map((obj: Record<string, unknown>) => ({
      ...obj,
      propertyData: obj.data as any,
    })) as Property[];

    // Apply local filters
    if (filters.city) {
      properties = properties.filter((p: any) => p.propertyData.city === filters.city);
    }
    if (filters.propertyType) {
      properties = properties.filter((p: any) => p.propertyData.propertyType === filters.propertyType);
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      properties: properties.slice(start, end),
      total: properties.length,
    };
  }

  async getProperty(id: string): Promise<Property | null> {
    try {
      const obj = await dualClient.getProperty(id);
      return {
        ...obj,
        propertyData: obj.data as any,
      } as Property;
    } catch (error) {
      console.log('Failed to get property:', error);
      return null;
    }
  }

  async mintProperty(data: MintPropertyRequest): Promise<MintPropertyResponse> {
    const payload = { ...data.propertyData } as Record<string, unknown>;
    const obj = await dualClient.mintProperty(data.templateId, data.ownerWallet, payload);

    db.saveProperty(obj.id, data.templateId, 'org-id', data.ownerWallet, payload);

    return {
      id: obj.id,
      objectId: obj.id,
      status: obj.status as any,
    };
  }

  async executeAction(data: ActionRequest): Promise<ActionResult> {
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
  }

  async getPropertyActions(objectId: string): Promise<Action[]> {
    try {
      return await dualClient.getPropertyActions(objectId);
    } catch (error) {
      console.log('Failed to get property actions:', error);
      return [];
    }
  }

  async getTemplate(id: string): Promise<Template | null> {
    try {
      return await dualClient.getTemplate(id);
    } catch (error) {
      console.log('Failed to get template:', error);
      return null;
    }
  }

  async listTemplates(): Promise<Template[]> {
    try {
      return await dualClient.listTemplates();
    } catch (error) {
      console.log('Failed to list templates:', error);
      return [];
    }
  }

  async getOrganization(id: string): Promise<Organization | null> {
    try {
      return await dualClient.getOrganization(id);
    } catch (error) {
      console.log('Failed to get organization:', error);
      return null;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const properties = (await dualClient.listProperties()) as Property[];
      const templates = await dualClient.listTemplates();

      return {
        totalProperties: properties.length,
        totalActions: 0,
        anchoredCount: properties.filter((p: any) => p.status === 'anchored').length,
        failedCount: properties.filter((p: any) => p.status === 'failed').length,
        pendingCount: properties.filter((p: any) => p.status === 'draft').length,
        organizations: 1,
        templates: templates.length,
        available: 0,
        reserved: 0,
        sold: 0,
        totalValue: 0,
        totalValueChange: '0%',
      };
    } catch (error) {
      console.log('Failed to get dashboard stats:', error);
      throw error;
    }
  }
}

/**
 * Get data provider - always returns DualDataProvider
 */
export function getDataProvider(): DataProvider {
  return new DualDataProvider();
}
