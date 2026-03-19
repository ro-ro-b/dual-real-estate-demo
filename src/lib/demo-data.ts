// Type definitions for DUAL network data
// Demo data has been removed - all data comes from DUAL gateway only

export interface PropertyData {
  address: string;
  city: string;
  country: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  latitude: number;
  longitude: number;
  listingDate: string;
  status: 'available' | 'reserved' | 'sold';
}

export interface Face {
  id: string;
  type: string;
  url: string;
}

export interface DualObject {
  id: string;
  templateId: string;
  templateName: string;
  organizationId: string;
  ownerWallet: string;
  faces: Face[];
  createdAt: string;
  updatedAt: string;
  onChainStatus: 'pending' | 'anchored' | 'failed';
}

export interface Property extends DualObject {
  propertyData: PropertyData;
}

export interface Action {
  id: string;
  objectId: string;
  type: string;
  actor: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export interface Template {
  id: string;
  name: string;
  version: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
  createdAt: string;
}
