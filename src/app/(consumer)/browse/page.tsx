'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Property } from '@/types';

type FilterCategory = 'all' | 'residential' | 'commercial' | 'land';

export default function BrowsePage() {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : data.properties || []);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property: any) => {
    const matchesCategory = filter === 'all';
    const matchesSearch =
      property.propertyData.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.propertyData.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const statusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700';
      case 'reserved':
        return 'bg-amber-100 text-amber-700';
      case 'sold':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Browse Properties</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search by address or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm"
        />
        <span className="absolute right-3 top-3.5 text-slate-400 material-symbols-outlined">
          search
        </span>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'residential', 'commercial', 'land'] as FilterCategory[]).map(
          (category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Property Grid */}
      <div className="space-y-4 pb-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property: any) => (
            <Link
              key={property.id}
              href={`/browse/${property.id}`}
              className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-slate-200 overflow-hidden">
                <img
                  src={property.faces[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9b274b3057b7?w=1000&h=667&fit=crop'}
                  alt={property.propertyData.address}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <span
                  className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${statusBadgeColor(
                    property.propertyData.status
                  )}`}
                >
                  {property.propertyData.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{property.propertyData.address}</h3>
                  <p className="text-sm text-slate-500">{property.propertyData.city}</p>
                </div>

                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900">
                    ${property.propertyData.price.toLocaleString()}
                  </span>
                </div>

                {/* Specs */}
                <div className="flex gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">bed</span>
                    <span>{property.propertyData.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">bathtub</span>
                    <span>{property.propertyData.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">square_foot</span>
                    <span>{property.propertyData.squareMeters}m²</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No properties found</p>
          </div>
        )}
      </div>
    </div>
  );
}
