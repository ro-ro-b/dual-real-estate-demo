'use client';

import Link from 'next/link';
import { useState } from 'react';
import { demoProperties } from '@/lib/demo-data';

export default function AdminPropertiesPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('all');
  const [onChainFilter, setOnChainFilter] = useState<'all' | 'anchored' | 'pending' | 'failed'>('all');

  const filteredProperties = demoProperties.filter((property) => {
    const statusMatch = statusFilter === 'all' || property.propertyData.status === statusFilter;
    const onChainMatch = onChainFilter === 'all' || property.onChainStatus === onChainFilter;
    return statusMatch && onChainMatch;
  });

  const getStatusColor = (status: 'available' | 'reserved' | 'sold') => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700';
      case 'reserved':
        return 'bg-amber-100 text-amber-700';
      case 'sold':
        return 'bg-rose-100 text-rose-700';
    }
  };

  const getOnChainColor = (status: 'pending' | 'anchored' | 'failed') => {
    switch (status) {
      case 'anchored':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'failed':
        return 'bg-rose-100 text-rose-700';
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#14b8a7]/20 rounded-xl text-[#14b8a7]">
            <span className="material-symbols-outlined text-3xl">domain</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Properties</h1>
            <p className="text-slate-500 text-sm">Manage all real estate listings and on-chain status.</p>
          </div>
        </div>
        <Link
          href="/admin/mint"
          className="bg-[#14b8a7] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#14b8a7]/90 transition-colors shadow-lg shadow-[#14b8a7]/20"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          New Property
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-widest">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-[#14b8a7]/20 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-[#14b8a7]"
          >
            <option value="all">All Properties</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-widest">On-Chain</label>
          <select
            value={onChainFilter}
            onChange={(e) => setOnChainFilter(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-[#14b8a7]/20 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-[#14b8a7]"
          >
            <option value="all">All States</option>
            <option value="anchored">Anchored</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl border border-[#14b8a7]/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f6f8f8] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-5 py-4">Image</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">City</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">On-Chain</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14b8a7]/5">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-[#14b8a7]/5 transition-colors">
                  <td className="px-5 py-4">
                    <img
                      src={property.faces[0]?.url}
                      alt={property.propertyData.address}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">
                    {property.propertyData.address.split(',')[0]}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{property.propertyData.city}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                    ${(property.propertyData.price / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(
                        property.propertyData.status
                      )}`}
                    >
                      {property.propertyData.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getOnChainColor(
                        property.onChainStatus
                      )}`}
                    >
                      {property.onChainStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-[#14b8a7] hover:text-[#14b8a7]/80 text-xs font-bold transition-colors"
                      >
                        View
                      </Link>
                      <button className="text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProperties.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-sm">No properties match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
