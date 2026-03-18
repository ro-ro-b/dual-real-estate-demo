'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Data loaded from DUAL gateway via API

export default function PortfolioPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    fetch('/api/properties').then(r => r.json()).then(d => {
      setProperties(d.properties || d || []);
    }).catch(() => {});
    fetch('/api/stats').then(r => r.json()).then(d => setStats(d)).catch(() => {});
  }, []);

  const demoWallet = '0x742d35Cc6634C0532925a3b844Bc026e6f7D30f0';

  const ownedProperties = properties.filter(
    (property) => property.ownerWallet === demoWallet
  );

  const portfolioValue = ownedProperties.reduce((sum, prop) => sum + prop.propertyData.price, 0);
  const valueChange = 12.4; // percentage

  const propertyStatuses = {
    available: ownedProperties.filter((p) => p.propertyData.status.toLowerCase() === 'available').length,
    reserved: ownedProperties.filter((p) => p.propertyData.status.toLowerCase() === 'reserved').length,
    sold: ownedProperties.filter((p) => p.propertyData.status.toLowerCase() === 'sold').length,
  };

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

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-emerald-500';
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
        <h1 className="text-2xl font-bold text-slate-900">Portfolio</h1>
      </div>

      {/* Portfolio Value Card */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90">Total Portfolio Value</p>
        <p className="text-3xl font-bold mt-2">${portfolioValue.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="material-symbols-outlined text-lg">trending_up</span>
          <p className="text-sm font-semibold">+{valueChange}% this month</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Properties by Status</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">
              Available
            </p>
            <p className="text-2xl font-bold text-emerald-600">{propertyStatuses.available}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">
              Reserved
            </p>
            <p className="text-2xl font-bold text-amber-600">{propertyStatuses.reserved}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">
              Sold
            </p>
            <p className="text-2xl font-bold text-slate-600">{propertyStatuses.sold}</p>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Properties</h2>
        {ownedProperties.length > 0 ? (
          <div className="space-y-3 pb-6">
            {ownedProperties.map((property) => (
              <Link
                key={property.id}
                href={`/wallet/${property.id}`}
                className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={property.faces[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9b274b3057b7?w=1000&h=667&fit=crop'}
                      alt={property.propertyData.address}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {property.propertyData.address}
                      </h3>
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${getStatusDot(property.propertyData.status)}`}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{property.propertyData.city}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-slate-900">
                        ${property.propertyData.price.toLocaleString()}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${statusBadgeColor(
                          property.propertyData.status
                        )}`}
                      >
                        {property.propertyData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No properties in your portfolio</p>
            <Link
              href="/browse"
              className="text-teal-500 text-sm mt-2 inline-block font-medium"
            >
              Browse properties
            </Link>
          </div>
        )}
      </div>

      {/* On-Chain Status Summary */}
      <div className="p-4 bg-slate-50 rounded-lg mb-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-emerald-500">verified</span>
          On-Chain Anchoring
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Total Properties:</span>
            <span className="font-semibold text-slate-900">{ownedProperties.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Verified On-Chain:</span>
            <span className="font-semibold text-emerald-600">{ownedProperties.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Network:</span>
            <span className="font-semibold text-slate-900">Ethereum Sepolia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
