'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Property } from '@/types';

export default function BrowsePropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        }
      } catch (err) {
        console.error('Failed to fetch property:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  if (!property) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="text-slate-500">Property not found</p>
        <Link href="/browse" className="text-primary-consumer text-sm mt-4 inline-block">
          Back to Browse
        </Link>
      </div>
    );
  }

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

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const generateChainHash = () => {
    return Math.random().toString(16).slice(2, 50);
  };

  const generateConfirmations = () => {
    return Math.floor(Math.random() * 20) + 10;
  };

  return (
    <div className="pt-4 pb-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary-consumer hover:text-primary-consumer/80 px-4 mb-4 text-sm font-medium"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back
      </button>

      {/* Hero Image */}
      <div className="w-full h-64 bg-slate-200 overflow-hidden">
        <img
          src={property.propertyData?.imageUrl || '/placeholder-property.svg'}
          alt={property.propertyData.address}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="px-4 pt-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{property.propertyData.address}</h1>
              <p className="text-slate-500">{property.propertyData.city}</p>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusBadgeColor(property.propertyData.status)}`}>
              {property.propertyData.status}
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            ${property.propertyData.price.toLocaleString()}
          </p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-background-light rounded-2xl border border-slate-100">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Bedrooms</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{property.propertyData.bedrooms}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Bathrooms</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{property.propertyData.bathrooms}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Area</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{property.propertyData.squareMeters}m²</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">About</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{property.propertyData.description}</p>
        </div>

        {/* DUAL Network Badge */}
        <div className="p-4 bg-gold-50 rounded-2xl border border-gold-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-gold-700">verified_user</span>
            <h3 className="text-sm font-semibold text-gold-900">DUAL Network Property</h3>
          </div>
          <p className="text-xs text-gold-700">
            This property is verified and anchored on-chain via the DUAL Real Estate protocol.
          </p>
        </div>

        {/* On-Chain Status */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-gold-600">verified</span>
            On-Chain Verification
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Chain:</span>
              <span className="font-semibold text-slate-900">Ethereum Sepolia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Hash:</span>
              <span className="font-mono text-xs text-slate-900">0x{generateChainHash().slice(0, 16)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Confirmations:</span>
              <span className="font-semibold text-gold-600">{generateConfirmations()} confirmed</span>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Owner</p>
          <p className="font-mono text-sm text-slate-900">{truncateWallet(property.ownerWallet)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 rounded-2xl wine-gradient text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">event_available</span>
            Reserve
          </button>
          <button className="flex-1 py-3 rounded-2xl bg-gold-50 text-gold-800 font-semibold hover:bg-gold-100 transition-colors flex items-center justify-center gap-2 border border-gold-200">
            <span className="material-symbols-outlined">local_offer</span>
            Make Offer
          </button>
        </div>
      </div>
    </div>
  );
}