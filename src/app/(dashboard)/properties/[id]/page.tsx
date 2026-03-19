'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Property, Action } from '@/types';

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyActions, setPropertyActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, actionsRes] = await Promise.all([
          fetch(`/api/properties/${params.id}`),
          fetch(`/api/actions?objectId=${params.id}`),
        ]);
        if (propertyRes.ok) {
          const propertyData = await propertyRes.json();
          setProperty(propertyData);
        }
        if (actionsRes.ok) {
          const actionsData = await actionsRes.json();
          setPropertyActions(Array.isArray(actionsData) ? actionsData : actionsData.actions || []);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (!property) {
    return (
      <div className="space-y-4">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#14b8a7] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Properties
        </Link>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Property Not Found</h2>
          <p className="text-slate-500 mt-2">The property you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const { propertyData, faces, onChainStatus, ownerWallet, templateName } = property;
  const imageUrl = faces.length > 0 ? faces[0].url : undefined;

  const statusConfig: Record<string, { bg: string; textColor: string; label: string }> = {
    available: { bg: 'bg-emerald-50', textColor: 'text-emerald-800', label: 'Available' },
    reserved: { bg: 'bg-amber-50', textColor: 'text-amber-800', label: 'Reserved' },
    sold: { bg: 'bg-red-50', textColor: 'text-red-800', label: 'Sold' },
  };
  const sc = statusConfig[propertyData.status] || statusConfig.available;

  const activityIcons: Record<string, { icon: string; color: string }> = {
    PROPERTY_CREATED: { icon: 'check_circle', color: 'bg-emerald-500' },
    PROPERTY_ANCHORED: { icon: 'link', color: 'bg-[#14b8a7]' },
    PROPERTY_RESERVED: { icon: 'edit', color: 'bg-amber-500' },
    PROPERTY_ANCHORING: { icon: 'sync_alt', color: 'bg-blue-500' },
  };

  return (
    <div className="-m-8">
      {/* Hero Section */}
      <div className="w-full aspect-[16/10] max-h-[480px] relative rounded-none overflow-hidden shadow-2xl">
        {imageUrl ? (
          <img className="w-full h-full object-cover" src={imageUrl} alt={propertyData.address} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#14b8a7] to-[#0f766e]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Link href="/properties" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Properties
              </Link>
              <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight">{propertyData.address}</h1>
              <p className="text-slate-300 text-lg md:text-xl">{propertyData.city}, {propertyData.country}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-right">
              <p className="text-slate-300 text-sm uppercase tracking-widest font-semibold">Current Value</p>
              <p className="text-white text-2xl md:text-4xl font-bold">${propertyData.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Property Details */}
            <section className="bg-white border border-[#14b8a7]/10 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#14b8a7]">info</span> Property Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Bedrooms</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#14b8a7]/60">bed</span>
                    <p className="font-semibold">{propertyData.bedrooms} Beds</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Bathrooms</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#14b8a7]/60">bathtub</span>
                    <p className="font-semibold">{propertyData.bathrooms} Baths</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Area</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#14b8a7]/60">square_foot</span>
                    <p className="font-semibold">{propertyData.squareMeters.toLocaleString()} m²</p>
                  </div>
                </div>
                <div className="col-span-full pt-4 border-t border-[#14b8a7]/5">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Blockchain Coordinates</p>
                  <code className="font-mono text-[#14b8a7] bg-[#14b8a7]/5 p-3 rounded-lg block text-sm">
                    Lat: {propertyData.latitude}, Lon: {propertyData.longitude} | HASH: {property.id.substring(0, 8)}...
                  </code>
                </div>
              </div>
            </section>

            {/* Management Actions */}
            <section className="bg-white border border-[#14b8a7]/10 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#14b8a7]">bolt</span> Management Actions
              </h3>
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#14b8a7] hover:bg-[#14b8a7]/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">book_online</span> Reserve Property
                </button>
                <button className="w-full bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">move_up</span> Transfer Ownership
                </button>
                <button className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">link</span> View On-Chain Transaction
                </button>
              </div>
            </section>

            {/* Activity History */}
            <section className="bg-white border border-[#14b8a7]/10 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#14b8a7]">history</span> Activity History
              </h3>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-[#14b8a7]/10">
                {propertyActions.length > 0 ? (
                  propertyActions.map((action: any) => {
                    const ai = activityIcons[action.type] || { icon: 'circle', color: 'bg-slate-400' };
                    return (
                      <div key={action.id} className="relative flex items-center gap-6">
                        <div className={`h-10 w-10 rounded-full ${ai.color} flex items-center justify-center text-white z-10 shrink-0`}>
                          <span className="material-symbols-outlined text-lg">{ai.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{action.description}</p>
                          <p className="text-slate-500 text-sm">
                            {new Date(action.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {' • '}
                            <span className={action.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}>
                              {action.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 text-sm ml-16">No activity recorded yet.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`${sc.bg} border ${propertyData.status === 'available' ? 'border-emerald-200' : propertyData.status === 'reserved' ? 'border-amber-200' : 'border-red-200'} rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${sc.textColor} font-bold uppercase text-xs tracking-widest`}>Status</span>
                {onChainStatus === 'anchored' && (
                  <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">anchor</span> ANCHORED
                  </div>
                )}
                {onChainStatus === 'pending' && (
                  <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                    <span className="material-symbols-outlined text-[12px]">hourglass_empty</span> PENDING
                  </div>
                )}
              </div>
              <p className={`text-3xl font-bold ${sc.textColor}`}>{sc.label}</p>
              <p className={`${propertyData.status === 'available' ? 'text-emerald-600' : propertyData.status === 'reserved' ? 'text-amber-600' : 'text-red-600'} text-sm mt-1`}>
                {propertyData.status === 'available' ? 'Direct Purchase Enabled' : propertyData.status === 'reserved' ? 'Under Contract' : 'Transaction Complete'}
              </p>
            </div>

            {/* Owner Card */}
            <div className="bg-white border border-[#14b8a7]/10 rounded-xl p-5 shadow-sm">
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-3">Current Owner</p>
              <div className="flex items-center justify-between bg-[#14b8a7]/5 p-3 rounded-lg">
                <span className="font-mono text-sm truncate">{ownerWallet.substring(0, 6)}...{ownerWallet.substring(ownerWallet.length - 4)}</span>
                <button className="text-[#14b8a7] hover:text-[#14b8a7]/70">
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
              </div>
            </div>

            {/* Template Card */}
            <div className="bg-white border border-[#14b8a7]/10 rounded-xl p-5 shadow-sm">
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Asset Template</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#14b8a7]">terminal</span>
                <span className="font-mono text-sm font-medium">{templateName}</span>
              </div>
            </div>

            {/* Blockchain Verification Card */}
            {property.explorerLinks && (
              <div className="bg-white border border-[#14b8a7]/10 rounded-xl p-5 shadow-sm">
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-4">Blockchain Verification</p>
                <div className="space-y-3">
                  {property.explorerLinks.owner && (
                    <a
                      href={property.explorerLinks.owner}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#14b8a7]/5 transition-colors"
                    >
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full shrink-0"></span>
                      <span className="text-xs text-blue-500 hover:text-blue-700 font-medium">View Owner</span>
                      <span className="material-symbols-outlined text-sm text-slate-400 ml-auto">open_in_new</span>
                    </a>
                  )}
                  {property.explorerLinks.contentHash && (
                    <div className="space-y-1">
                      <a
                        href={property.explorerLinks.contentHash}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#14b8a7]/5 transition-colors"
                      >
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full shrink-0"></span>
                        <span className="text-xs text-blue-500 hover:text-blue-700 font-medium">Content Hash</span>
                        <span className="material-symbols-outlined text-sm text-slate-400 ml-auto">open_in_new</span>
                      </a>
                      <p className="text-[11px] text-slate-500 font-mono ml-4 break-all">{property.contentHash}</p>
                    </div>
                  )}
                  {property.explorerLinks.integrityHash && (
                    <div className="space-y-1">
                      <a
                        href={property.explorerLinks.integrityHash}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#14b8a7]/5 transition-colors"
                      >
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full shrink-0"></span>
                        <span className="text-xs text-blue-500 hover:text-blue-700 font-medium">Integrity Hash</span>
                        <span className="material-symbols-outlined text-sm text-slate-400 ml-auto">open_in_new</span>
                      </a>
                      <p className="text-[11px] text-slate-500 font-mono ml-4 break-all">{property.integrityHash}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Faces Card */}
            {faces.length > 0 && (
              <div className="bg-white border border-[#14b8a7]/10 rounded-xl p-5 shadow-sm">
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-4">Asset Faces</p>
                <div className="space-y-3">
                  {faces.map((face: any) => (
                    <div key={face.id} className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${face.type === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {face.type}
                      </span>
                      <span className="text-sm text-slate-600 truncate">{face.url.substring(0, 40)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
