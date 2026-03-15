'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { demoProperties, demoStats } from '@/lib/demo-data';
import { StatsCards } from '@/components/properties/StatsCards';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { PropertyCard } from '@/components/properties/PropertyCard';

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'oldest';
type StatusFilter = 'all' | 'available' | 'reserved' | 'sold';

export default function PropertiesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [bedroomsFilter, setBedroomsFilter] = useState<number | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000000]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = demoProperties.filter((property) => {
      if (statusFilter !== 'all' && property.propertyData.status !== statusFilter) return false;
      if (bedroomsFilter !== 'all' && property.propertyData.bedrooms < bedroomsFilter) return false;
      const { price } = property.propertyData;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      const priceA = a.propertyData.price;
      const priceB = b.propertyData.price;
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      switch (sortBy) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'oldest': return dateA - dateB;
        case 'newest':
        default: return dateB - dateA;
      }
    });
  }, [statusFilter, bedroomsFilter, priceRange, sortBy]);

  return (
    <>
      {/* Stats Row */}
      <StatsCards stats={demoStats} />

      {/* Filters */}
      <PropertyFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        bedroomsFilter={bedroomsFilter}
        onBedroomsChange={setBedroomsFilter}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAndSortedProperties.length > 0 ? (
          filteredAndSortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
            <p className="text-slate-500">No properties found matching your criteria</p>
          </div>
        )}
      </div>
    </>
  );
}
