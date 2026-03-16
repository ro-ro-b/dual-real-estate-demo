'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { demoProperties } from '@/lib/demo-data';

export default function BrowsePropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const property = demoProperties.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="text-slate-500">Property not found</p>
        <Link href="/browse" className="text-teal-500 text-sm mt-4 inline-block">
          Back to Browse
        </Link>
      </div>
    );
  }

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
        className="flex items-center gap-2 text-teal-500 hover:text-teal-600 px-4 mb-4 text-sm font-medium"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back
      </button>

      {/* Hero Image */}
      <div className="w-full h-64 bg-slate-200 overflow-hidden">
        <img
          src={property.faces[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9b274b3057b7?w=1000&h=667&fit=crop'}
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
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
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
        <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg border border-teal-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-teal-600">verified_user</span>
            <h3 className="text-sm font-semibold text-teal-900">DUAL Network Property</h3>
          </div>
          <p className="text-xs text-teal-700">
            This property is verified and anchored on-chain via the DUAL Real Estate protocol.
          </p>
        </div>

        {/* On-Chain Status */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-500">verified</span>
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
              <span className="font-semibold text-emerald-600">{generateConfirmations()} confirmed</span>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Owner</p>
          <p className="font-mono text-sm text-slate-900">{truncateWallet(property.ownerWallet)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 text-white font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">event_available</span>
            Reserve
          </button>
          <button className="flex-1 py-3 rounded-lg border-2 border-teal-500 text-teal-500 font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">local_offer</span>
            Make Offer
          </button>
        </div>
      </div>
    </div>
  );
}
