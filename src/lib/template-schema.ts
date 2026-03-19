/**
 * Property to DUAL Template mapping
 */

import { DualObject, Face, MintPropertyRequest, Property, PropertyData, Template, TemplateSchema } from '@/types';

export const PROPERTY_TEMPLATE_NAME = 'real-estate::property::v1';

/**
 * Default property template schema mapping
 */
export const DEFAULT_PROPERTY_SCHEMA: TemplateSchema = {
  address: {
    dualField: 'location.address',
    type: 'string',
  },
  city: {
    dualField: 'location.city',
    type: 'string',
  },
  state: {
    dualField: 'location.state',
    type: 'string',
  },
  zipCode: {
    dualField: 'location.zipCode',
    type: 'string',
  },
  country: {
    dualField: 'location.country',
    type: 'string',
  },
  latitude: {
    dualField: 'location.latitude',
    type: 'number',
  },
  longitude: {
    dualField: 'location.longitude',
    type: 'number',
  },
  squareFeet: {
    dualField: 'details.squareFeet',
    type: 'number',
  },
  bedrooms: {
    dualField: 'details.bedrooms',
    type: 'number',
  },
  bathrooms: {
    dualField: 'details.bathrooms',
    type: 'number',
  },
  yearBuilt: {
    dualField: 'details.yearBuilt',
    type: 'number',
  },
  propertyType: {
    dualField: 'details.propertyType',
    type: 'string',
  },
  marketValue: {
    dualField: 'valuation.marketValue',
    type: 'number',
  },
  taxAssessedValue: {
    dualField: 'valuation.taxAssessedValue',
    type: 'number',
  },
  ownerName: {
    dualField: 'owner.name',
    type: 'string',
  },
  ownerEmail: {
    dualField: 'owner.email',
    type: 'string',
  },
  ownerPhone: {
    dualField: 'owner.phone',
    type: 'string',
  },
  features: {
    dualField: 'details.features',
    type: 'array',
  },
  description: {
    dualField: 'description',
    type: 'string',
  },
};

/**
 * Convert property request to DUAL template payload
 */
export function propertyToTemplatePayload(data: MintPropertyRequest): Record<string, unknown> {
  const { propertyData } = data;

  return {
    name: PROPERTY_TEMPLATE_NAME,
    version: '1.0.0',
    schema: {
      location: {
        type: 'object',
        properties: {
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          zipCode: { type: 'string' },
          country: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
        },
      },
      details: {
        type: 'object',
        properties: {
          squareFeet: { type: 'number' },
          bedrooms: { type: 'number' },
          bathrooms: { type: 'number' },
          yearBuilt: { type: 'number' },
          propertyType: { type: 'string' },
          features: { type: 'array' },
        },
      },
      valuation: {
        type: 'object',
        properties: {
          marketValue: { type: 'number' },
          taxAssessedValue: { type: 'number' },
        },
      },
      owner: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      description: { type: 'string' },
    },
    sampleData: propertyData,
  };
}

/**
 * Convert property request to DUAL object payload for minting
 */
export function propertyToObjectPayload(
  templateId: string,
  data: MintPropertyRequest,
  ownerWallet: string
): Record<string, unknown> {
  const { propertyData, faces = [] } = data;

  const payload: Record<string, unknown> = {
    templateId,
    ownerWallet,
    data: flattenPropertyData(propertyData),
    status: 'draft',
    faces: faces.map(face => ({
      type: face.type,
      url: face.url,
      metadata: face.metadata || {},
    })),
  };

  return payload;
}

/**
 * Flatten PropertyData to DUAL nested format
 */
function flattenPropertyData(data: PropertyData): Record<string, unknown> {
  return {
    location: {
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
    },
    details: {
      squareFeet: data.squareFeet,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      yearBuilt: data.yearBuilt,
      propertyType: data.propertyType,
      features: data.features,
    },
    valuation: {
      marketValue: data.marketValue,
      taxAssessedValue: data.taxAssessedValue,
    },
    owner: {
      name: data.ownerName,
      email: data.ownerEmail,
      phone: data.ownerPhone,
    },
    description: data.description,
  };
}

/**
 * Convert DUAL object back to Property type
 */
export function objectToProperty(obj: DualObject, template: Template): Property {
  const data = obj.data as Record<string, unknown>;
  const location = data.location as Record<string, unknown>;
  const details = data.details as Record<string, unknown>;
  const valuation = data.valuation as Record<string, unknown>;
  const owner = data.owner as Record<string, unknown>;

  const propertyData: PropertyData = {
    address: (location?.address as string) || '',
    city: (location?.city as string) || '',
    state: (location?.state as string) || '',
    zipCode: (location?.zipCode as string) || '',
    country: (location?.country as string) || '',
    latitude: (location?.latitude as number) || 0,
    longitude: (location?.longitude as number) || 0,
    squareFeet: (details?.squareFeet as number) || 0,
    squareMeters: (details?.squareMeters as number) || 0,
    bedrooms: (details?.bedrooms as number) || 0,
    bathrooms: (details?.bathrooms as number) || 0,
    yearBuilt: (details?.yearBuilt as number) || 0,
    propertyType: ((details?.propertyType as string) || 'residential') as 'residential' | 'commercial' | 'industrial' | 'land' | 'Token',
    price: (data?.price as number) || 0,
    marketValue: (valuation?.marketValue as number) || 0,
    taxAssessedValue: (valuation?.taxAssessedValue as number) || 0,
    ownerName: (owner?.name as string) || '',
    ownerEmail: (owner?.email as string) || '',
    ownerPhone: (owner?.phone as string) || '',
    features: (details?.features as string[]) || [],
    description: (data.description as string) || '',
    status: 'available',
    imageUrl: '',
  };

  return {
    ...obj,
    propertyData,
  };
}

/**
 * Validate PropertyData
 */
export function validatePropertyData(
  data: Partial<MintPropertyRequest>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.propertyData) {
    errors.push('propertyData is required');
    return { valid: false, errors };
  }

  const pd = data.propertyData;

  // Required fields
  if (!pd.address) errors.push('Property address is required');
  if (!pd.city) errors.push('City is required');
  if (!pd.state) errors.push('State is required');
  if (!pd.zipCode) errors.push('Zip code is required');
  if (!pd.country) errors.push('Country is required');
  if (!pd.ownerName) errors.push('Owner name is required');
  if (!pd.propertyType) errors.push('Property type is required');

  // Validate property type
  if (pd.propertyType && !['residential', 'commercial', 'industrial', 'land'].includes(pd.propertyType)) {
    errors.push('Invalid property type');
  }

  // Optional numeric validations
  if (pd.latitude !== undefined && (typeof pd.latitude !== 'number' || pd.latitude < -90 || pd.latitude > 90)) {
    errors.push('Latitude must be between -90 and 90');
  }

  if (pd.longitude !== undefined && (typeof pd.longitude !== 'number' || pd.longitude < -180 || pd.longitude > 180)) {
    errors.push('Longitude must be between -180 and 180');
  }

  if (pd.marketValue !== undefined && (typeof pd.marketValue !== 'number' || pd.marketValue < 0)) {
    errors.push('Market value must be a positive number');
  }

  if (!data.ownerWallet) {
    errors.push('ownerWallet is required');
  } else if (!/^0x[a-fA-F0-9]{40}$/.test(data.ownerWallet)) {
    errors.push('ownerWallet must be a valid Ethereum address');
  }

  if (!data.templateId) {
    errors.push('templateId is required');
  }

  return { valid: errors.length === 0, errors };
}
