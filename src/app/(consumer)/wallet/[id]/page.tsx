'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { demoProperties, demoActions } from '@/lib/demo-data';

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const property = demoProperties.find((p) => p.id === propertyId);
  const actions = demoActions.filter((a) => a.objectId === propertyId).slice(0, 5);

  if (!property) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="text-slate-500">Property not found</p>
        <Link href="/wallet" className="text-teal-500 text-sm mt-4 inline-block">
          Back to Properties
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

  const getActionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'verified':
        return 'verified_user';
      case 'transfer':
        return 'send';
      case 'listing':
        return 'home';
      case 'reserve':
        return 'event_available';
      default:
        return 'info';
    }
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

        {/* Owner Info */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Owner</p>
          <p className="font-mono text-sm text-slate-900">{truncateWallet(property.ownerWallet)}</p>
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

        {/* Activity Timeline */}
        {actions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Activity</h2>
            <div className="space-y-3">
              {actions.map((action, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-base text-teal-600">
                      {getActionIcon(action.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{action.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(action.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs font-medium text-emerald-600">
                    {action.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">send</span>
            Transfer
          </button>
          <button className="flex-1 py-3 rounded-lg border-2 border-teal-500 text-teal-500 font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">share</span>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
