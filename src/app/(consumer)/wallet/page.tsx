'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Property } from '@/types';

type FilterStatus = 'all' | 'available' | 'reserved' | 'sold';

export default function PropertiesPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');
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
    if (filter === 'all') return true;
    return property.propertyData.status.toLowerCase() === filter;
  });

  const statusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-gold-50 text-gold-700';
      case 'reserved':
        return 'bg-amber-100 text-amber-700';
      case 'sold':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-gold-500';
      case 'reserved':
        return 'bg-amber-500';
      case 'sold':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Properties</h1>
        <p className="text-sm text-slate-500 mt-1">
          {filteredProperties.length} propert{filteredProperties.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'available', 'reserved', 'sold'] as FilterStatus[]).map((status: any) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? 'wine-gradient text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Property Cards */}
      <div className="space-y-4 pb-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property: any) => (
            <Link
              key={property.id}
              href={`/wallet/${property.id}`}
              className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-slate-200 overflow-hidden">
                <img
                  src={property.propertyData?.imageUrl || '/placeholder-property.svg'}
                  alt={property.propertyData.address}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${getStatusDot(property.propertyData.status)}`}
                  />
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadgeColor(property.propertyData.status)}`}>
                    {property.propertyData.status}
                  </span>
                </div>
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
                <div className="flex gap-4 text-sm text-slate-600 pb-3 border-t border-slate-100 pt-3">
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