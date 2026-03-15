import { v4 as uuidv4 } from 'uuid';

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

const generatePropertyId = () => uuidv4();
const generateWallet = () => `0x${Math.random().toString(16).substr(2, 40)}`;
const generateDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const demoTemplate: Template = {
  id: 'template-001',
  name: 'real-estate::property::v1',
  version: '1.0.0',
  fields: [
    { name: 'address', type: 'string', required: true },
    { name: 'city', type: 'string', required: true },
    { name: 'country', type: 'string', required: true },
    { name: 'description', type: 'string', required: true },
    { name: 'price', type: 'number', required: true },
    { name: 'bedrooms', type: 'number', required: true },
    { name: 'bathrooms', type: 'number', required: true },
    { name: 'squareMeters', type: 'number', required: true },
    { name: 'latitude', type: 'number', required: true },
    { name: 'longitude', type: 'number', required: true },
    { name: 'listingDate', type: 'string', required: true },
    { name: 'status', type: 'enum', required: true },
  ],
  createdAt: '2024-01-15T10:00:00Z',
};

export const demoProperties: Property[] = [
  {
    id: generatePropertyId(),
    templateId: 'template-001',
    templateName: 'real-estate::property::v1',
    organizationId: 'org-luxury-homes',
    ownerWallet: '0x742d35Cc6634C0532925a3b844Bc026e6f7D30f0',
    propertyData: {
      address: '123 Park Avenue, Manhattan',
      city: 'New York',
      country: 'USA',
      description: 'Luxury penthouse with panoramic Central Park views. Features floor-to-ceiling windows, marble finishes, private terrace, and smart home automation.',
      price: 8500000,
      bedrooms: 4,
      bathrooms: 3,
      squareMeters: 500,
      latitude: 40.7128,
      longitude: -74.0060,
      listingDate: '2024-01-10',
      status: 'available',
    },
    faces: [
      {
        id: 'face-001',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1512917774080-9b274b3057b7?w=1000&h=667&fit=crop',
      },
    ],
    createdAt: generateDate(30),
    updatedAt: generateDate(5),
    onChainStatus: 'anchored',
  },
  {
    id: generatePropertyId(),
    templateId: 'template-001',
    templateName: 'real-estate::property::v1',
    organizationId: 'org-luxury-homes',
    ownerWallet: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    propertyData: {
      address: '456 Pacific Coast Highway, Malibu',
      city: 'Malibu',
      country: 'USA',
      description: 'Stunning beachfront estate with direct ocean access. Modern architecture, infinity pool, home theater, chef\'s kitchen, and guest house.',
      price: 12200000,
      bedrooms: 5,
      bathrooms: 4,
      squareMeters: 650,
      latitude: 34.0195,
      longitude: -118.6789,
      listingDate: '2023-12-20',
      status: 'reserved',
    },
    faces: [
      {
        id: 'face-002',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad6aa9?w=1000&h=667&fit=crop',
      },
    ],
    createdAt: generateDate(45),
    updatedAt: generateDate(10),
    onChainStatus: 'anchored',
  },
  {
    id: generatePropertyId(),
    templateId: 'template-001',
    templateName: 'real-estate::property::v1',
    organizationId: 'org-urban-living',
    ownerWallet: '0x1234567890123456789012345678901234567890',
    propertyData: {
      address: '789 Fulton Street, Brooklyn',
      city: 'Brooklyn',
      country: 'USA',
      description: 'Renovated townhouse in historic DUMBO. Original hardwood floors, exposed brick, private garden, and skylight throughout.',
      price: 2100000,
      bedrooms: 3,
      bathrooms: 2,
      squareMeters: 220,
      latitude: 40.7061,
      longitude: -73.9969,
      listingDate: '2024-01-05',
      status: 'available',
    },
    faces: [
      {
        id: 'face-003',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&h=667&fit=crop',
      },
    ],
    createdAt: generateDate(20),
    updatedAt: generateDate(3),
    onChainStatus: 'anchored',
  },
  {
    id: generatePropertyId(),
    templateId: 'template-001',
    templateName: 'real-estate::property::v1',
    organizationId: 'org-luxury-homes',
    ownerWallet: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    propertyData: {
      address: '321 Ocean Drive, Miami Beach',
      city: 'Miami Beach',
      country: 'USA',
      description: 'Architectural masterpiece on exclusive Miami Beach. Oceanfront villa with resort-style amenities, wine cellar, spa, and boat dock.',
      price: 6800000,
      bedrooms: 6,
      bathrooms: 5,
      squareMeters: 800,
      latitude: 25.7907,
      longitude: -80.1300,
      listingDate: '2023-11-15',
      status: 'sold',
    },
    faces: [
      {
        id: 'face-004',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=1000&h=667&fit=crop',
      },
    ],
    createdAt: generateDate(60),
    updatedAt: generateDate(2),
    onChainStatus: 'anchored',
  },
  {
    id: generatePropertyId(),
    templateId: 'template-001',
    templateName: 'real-estate::property::v1',
    organizationId: 'org-urban-living',
    ownerWallet: '0x9876543210987654321098765432109876543210',
    propertyData: {
      address: '555 Broadway, SoHo',
      city: 'New York',
      country: 'USA',
      description: 'Industrial loft in iconic SoHo building. High ceilings, cast iron columns, exposed brick, and private terrace overlooking Broadway.',
      price: 3400000,
      bedrooms: 2,
      bathrooms: 2,
      squareMeters: 180,
      latitude: 40.7219,
      longitude: -74.0021,
      listingDate: '2024-01-08',
      status: 'available',
    },
    faces: [
      {
        id: 'face-005',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1577959375944-97733ae31358?w=1000&h=667&fit=crop',
      },
    ],
    createdAt: generateDate(25),
    updatedAt: generateDate(8),
    onChainStatus: 'anchored',
  },
  {
    id: generatePropertyId(),
    templateId: 'template-001',
    templateName: 'real-estate::property::v1',
    organizationId: 'org-celebrity-homes',
    ownerWallet: '0xfedcbafedcbafedcbafedcbafedcbafedcbafedcb',
    propertyData: {
      address: '987 Mulholland Drive, Beverly Hills',
      city: 'Beverly Hills',
      country: 'USA',
      description: 'Iconic Beverly Hills estate with panoramic views. Grand foyer, marble staircases, infinity pool, tennis court, and private cinema.',
      price: 22000000,
      bedrooms: 8,
      bathrooms: 10,
      squareMeters: 1500,
      latitude: 34.1122,
      longitude: -118.4065,
      listingDate: '2023-10-01',
      status: 'available',
    },
    faces: [
      {
        id: 'face-006',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&h=667&fit=crop',
      },
    ],
    createdAt: generateDate(90),
    updatedAt: generateDate(15),
    onChainStatus: 'anchored',
  },
  {
    id: generatePropertyId(),
    templateId: 'template-001',
    templateName: 'real-estate::property::v1',
    organizationId: 'org-tech-valley',
    ownerWallet: '0x1111111111111111111111111111111111111111',
    propertyData: {
      address: '234 Market Street, San Francisco',
      city: 'San Francisco',
      country: 'USA',
      description: 'Modern condo in SOMA district. Floor-to-ceiling windows, open floor plan, parking, and building amenities including gym and lounge.',
      price: 1800000,
      bedrooms: 2,
      bathrooms: 1,
      squareMeters: 120,
      latitude: 37.7749,
      longitude: -122.4194,
      listingDate: '2023-12-15',
      status: 'reserved',
    },
    faces: [
      {
        id: 'face-007',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1545974860-b8476fdbad00?w=1000&h=667&fit=crop',
      },
    ],
    createdAt: generateDate(35),
    updatedAt: generateDate(7),
    onChainStatus: 'pending',
  },
  {
    id: generatePropertyId(),
    templateId: 'template-001',
    templateName: 'real-estate::property::v1',
    organizationId: 'org-texas-estates',
    ownerWallet: '0x2222222222222222222222222222222222222222',
    propertyData: {
      address: '2000 Hill Country Ranch Road, Austin',
      city: 'Austin',
      country: 'USA',
      description: 'Sprawling ranch property on rolling Hill Country terrain. Modern farmhouse, stables, guest quarters, and private lake access.',
      price: 4500000,
      bedrooms: 5,
      bathrooms: 4,
      squareMeters: 2000,
      latitude: 30.2672,
      longitude: -97.7431,
      listingDate: '2024-01-12',
      status: 'available',
    },
    faces: [
      {
        id: 'face-008',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600210691573-df519b2b896f?w=1000&h=667&fit=crop',
      },
    ],
    createdAt: generateDate(15),
    updatedAt: generateDate(1),
    onChainStatus: 'anchored',
  },
];

export const demoActions: Action[] = [
  {
    id: uuidv4(),
    objectId: demoProperties[0].id,
    type: 'PROPERTY_CREATED',
    actor: '0x742d35Cc6634C0532925a3b844Bc026e6f7D30f0',
    timestamp: generateDate(30),
    status: 'completed',
    description: 'Property created and registered on DUAL',
  },
  {
    id: uuidv4(),
    objectId: demoProperties[0].id,
    type: 'PROPERTY_ANCHORED',
    actor: 'system',
    timestamp: generateDate(29),
    status: 'completed',
    description: 'Property anchored to blockchain',
  },
  {
    id: uuidv4(),
    objectId: demoProperties[1].id,
    type: 'PROPERTY_CREATED',
    actor: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    timestamp: generateDate(45),
    status: 'completed',
    description: 'Property created and registered on DUAL',
  },
  {
    id: uuidv4(),
    objectId: demoProperties[1].id,
    type: 'PROPERTY_RESERVED',
    actor: '0x3333333333333333333333333333333333333333',
    timestamp: generateDate(20),
    status: 'completed',
    description: 'Property reservation initiated',
  },
  {
    id: uuidv4(),
    objectId: demoProperties[2].id,
    type: 'PROPERTY_CREATED',
    actor: '0x1234567890123456789012345678901234567890',
    timestamp: generateDate(20),
    status: 'completed',
    description: 'Property created and registered on DUAL',
  },
  {
    id: uuidv4(),
    objectId: demoProperties[4].id,
    type: 'PROPERTY_CREATED',
    actor: '0x9876543210987654321098765432109876543210',
    timestamp: generateDate(25),
    status: 'completed',
    description: 'Property created and registered on DUAL',
  },
  {
    id: uuidv4(),
    objectId: demoProperties[6].id,
    type: 'PROPERTY_CREATED',
    actor: '0x1111111111111111111111111111111111111111',
    timestamp: generateDate(35),
    status: 'completed',
    description: 'Property created and registered on DUAL',
  },
  {
    id: uuidv4(),
    objectId: demoProperties[6].id,
    type: 'PROPERTY_ANCHORING',
    actor: 'system',
    timestamp: generateDate(5),
    status: 'pending',
    description: 'Anchoring property to blockchain',
  },
];

export const demoStats = {
  totalProperties: demoProperties.length,
  available: demoProperties.filter((p) => p.propertyData.status === 'available').length,
  reserved: demoProperties.filter((p) => p.propertyData.status === 'reserved').length,
  sold: demoProperties.filter((p) => p.propertyData.status === 'sold').length,
  totalValue: demoProperties.reduce((sum, p) => sum + p.propertyData.price, 0),
  totalValueChange: '+12.4%',
  anchored: demoProperties.filter((p) => p.onChainStatus === 'anchored').length,
  pending: demoProperties.filter((p) => p.onChainStatus === 'pending').length,
};
