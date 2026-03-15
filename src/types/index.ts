export interface PropertyData {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  imageUrl?: string;
  status: 'available' | 'reserved' | 'sold';
  onChainStatus: 'anchored' | 'pending' | 'failed';
  tokenizationProgress: number;
}

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  reservedProperties: number;
  totalValue: number;
}

export interface FilterOptions {
  status: 'all' | 'available' | 'reserved' | 'sold';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
}
