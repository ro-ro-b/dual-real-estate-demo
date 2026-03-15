/**
 * Action type definitions and validation
 */

import { Property } from '@/types';

export enum ActionType {
  RESERVE = 'RESERVE',
  TRANSFER = 'TRANSFER',
  UPDATE_STATUS = 'UPDATE_STATUS',
  BURN = 'BURN',
  VIEW_ON_CHAIN = 'VIEW_ON_CHAIN',
  MINT = 'MINT',
}

export interface ActionSchema {
  type: ActionType;
  requiredParameters: string[];
  parameterRules: Record<string, unknown>;
  validStates: string[];
  description: string;
}

const ACTION_SCHEMAS: Record<ActionType, ActionSchema> = {
  [ActionType.MINT]: {
    type: ActionType.MINT,
    requiredParameters: ['templateId', 'ownerWallet'],
    parameterRules: {
      templateId: { type: 'string' },
      ownerWallet: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' },
    },
    validStates: ['draft'],
    description: 'Create and anchor a property on-chain',
  },
  [ActionType.RESERVE]: {
    type: ActionType.RESERVE,
    requiredParameters: ['reservedFor'],
    parameterRules: {
      reservedFor: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' },
    },
    validStates: ['anchored'],
    description: 'Reserve a property for a specific wallet',
  },
  [ActionType.TRANSFER]: {
    type: ActionType.TRANSFER,
    requiredParameters: ['toWallet'],
    parameterRules: {
      toWallet: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' },
    },
    validStates: ['anchored'],
    description: 'Transfer property ownership to another wallet',
  },
  [ActionType.UPDATE_STATUS]: {
    type: ActionType.UPDATE_STATUS,
    requiredParameters: ['newStatus'],
    parameterRules: {
      newStatus: { type: 'string', enum: ['available', 'sold', 'delisted'] },
    },
    validStates: ['anchored'],
    description: 'Update the listing status of a property',
  },
  [ActionType.BURN]: {
    type: ActionType.BURN,
    requiredParameters: [],
    parameterRules: {},
    validStates: ['anchored'],
    description: 'Burn/remove a property from the ledger',
  },
  [ActionType.VIEW_ON_CHAIN]: {
    type: ActionType.VIEW_ON_CHAIN,
    requiredParameters: [],
    parameterRules: {},
    validStates: ['anchored'],
    description: 'View property details on-chain',
  },
};

export function validateAction(
  type: string,
  params: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const schema = ACTION_SCHEMAS[type as ActionType];
  if (!schema) {
    errors.push(`Unknown action type: ${type}`);
    return { valid: false, errors };
  }

  // Check required parameters
  for (const required of schema.requiredParameters) {
    if (params[required] === undefined || params[required] === null) {
      errors.push(`Missing required parameter: ${required}`);
    }
  }

  // Validate parameter types
  for (const [paramName, rules] of Object.entries(schema.parameterRules)) {
    if (params[paramName] === undefined) continue;

    const rules2 = rules as Record<string, unknown>;
    const paramType = typeof params[paramName];

    if (rules2.type && rules2.type !== paramType) {
      errors.push(
        `Parameter ${paramName} must be of type ${String(rules2.type)}, got ${paramType}`
      );
    }

    if (rules2.pattern && typeof params[paramName] === 'string') {
      const regex = new RegExp(rules2.pattern as string);
      if (!regex.test(params[paramName] as string)) {
        errors.push(`Parameter ${paramName} does not match required pattern`);
      }
    }

    if (rules2.enum && Array.isArray(rules2.enum)) {
      if (!rules2.enum.includes(params[paramName])) {
        errors.push(`Parameter ${paramName} must be one of: ${String(rules2.enum)}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function getAvailableActions(property: Property): ActionType[] {
  const available: ActionType[] = [];
  const state = property.status;

  for (const [type, schema] of Object.entries(ACTION_SCHEMAS)) {
    if (schema.validStates.includes(state)) {
      available.push(type as ActionType);
    }
  }

  return available;
}

export function getActionSchema(type: ActionType): ActionSchema | null {
  return ACTION_SCHEMAS[type] || null;
}
