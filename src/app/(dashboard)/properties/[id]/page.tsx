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
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  useEffect(() => {
    // Fetch property data — don't let actions failure block the page
    fetch(`/api/properties/${params.id}`)
      .then((r: any) => r.ok ? r.json() : null)
      .then((data: any) => { if (data && !data.error) setProperty(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
    // Fetch actions separately — non-blocking
    fetch(`/api/actions?objectId=${params.id}`)
      .then((r: any) => r.ok ? r.json() : [])
      .then((data: any) => setPropertyActions(Array.isArray(data) ? data : data?.actions || []))
      .catch(() => {});
  }, [params.id]);

  if (!property) {
    return (
      <div className="space-y-4">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Properties
        </Link>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-100">Token Not Found</h2>
          <p className="text-slate-500 mt-2">The property token you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const { propertyData, faces, onChainStatus, ownerWallet, templateName } = property;
  const imageUrl = faces.length > 0 ? faces[0].url : 'https://dual-docs-gray.vercel.app/assets/products/property-token.svg';

  const statusConfig: Record<string, { bg: string; textColor: string; label: string }> = {
    available: { bg: 'bg-emerald-950', textColor: 'text-emerald-300', label: 'Available' },
    reserved: { bg: 'bg-amber-950', textColor: 'text-amber-300', label: 'Reserved' },
    sold: { bg: 'bg-red-950', textColor: 'text-red-300', label: 'Sold' },
  };
  const sc = statusConfig[propertyData.status] || statusConfig.available;

  const activityIcons: Record<string, { icon: string; color: string }> = {
    PROPERTY_CREATED: { icon: 'check_circle', color: 'bg-emerald-500' },
    PROPERTY_ANCHORED: { icon: 'link', color: 'bg-emerald-500' },
    PROPERTY_RESERVED: { icon: 'edit', color: 'bg-amber-500' },
    PROPERTY_ANCHORING: { icon: 'sync_alt', color: 'bg-blue-500' },
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Properties
      </Link>

      {/* Token Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Token Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-700/50">
            <img
              src={imageUrl}
              alt={propertyData.address}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>

          {/* Token Metadata */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">Property Token</p>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">{propertyData.address}</h1>
              <p className="text-slate-400 font-mono text-sm">{propertyData.city}, {propertyData.country}</p>
            </div>

            {/* Token ID */}
            <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Token ID</p>
              <p className="font-mono text-sm text-slate-300 break-all">{property.id}</p>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`${sc.bg} border border-slate-700/50 rounded-xl p-4`}>
                <p className={`${sc.textColor} text-xs font-mono uppercase tracking-widest mb-1`}>Status</p>
                <p className={`${sc.textColor} font-bold text-lg`}>{sc.label}</p>
              </div>
              <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-1">On-Chain</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-emerald-300 font-bold text-sm uppercase">{onChainStatus}</p>
                </div>
              </div>
            </div>

            {/* Current Value */}
            <div className="bg-gradient-to-br from-emerald-950 to-slate-950 border border-emerald-500/30 rounded-xl p-6">
              <p className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-2">Current Value</p>
              <p className="text-emerald-100 text-3xl font-bold">${propertyData.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Details */}
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-400">info</span> Property Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Bedrooms</p>
                <p className="text-2xl font-bold text-slate-100">{propertyData.bedrooms}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Bathrooms</p>
                <p className="text-2xl font-bold text-slate-100">{propertyData.bathrooms}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Area (m²)</p>
                <p className="text-2xl font-bold text-slate-100">{propertyData.squareMeters.toLocaleString()}</p>
              </div>
              <div className="col-span-full pt-4 border-t border-slate-700/50 space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Coordinates</p>
                <code className="block bg-slate-950/50 border border-slate-700/50 rounded-lg p-3 text-emerald-400 font-mono text-sm">
                  Lat: {propertyData.latitude}, Lon: {propertyData.longitude}
                </code>
              </div>
            </div>
          </section>

          {/* Blockchain Verification Section */}
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-400">verified</span> Blockchain Verification
            </h2>
            <div className="space-y-4">
              {property.contentHash && (
                <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Content Hash</p>
                    <button
                      onClick={(e: any) => copyToClipboard(property.contentHash || '', 'content')}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {copiedHash === 'content' ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                  <code className="block font-mono text-emerald-300 text-xs break-all bg-slate-950 p-3 rounded-lg border border-slate-700/50">
                    {property.contentHash}
                  </code>
                  {property.explorerLinks?.contentHash && (
                    <a
                      href={property.explorerLinks.contentHash}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 rounded-lg text-xs font-bold text-emerald-300"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      View on Blockscout
                    </a>
                  )}
                </div>
              )}

              {property.integrityHash && (
                <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Integrity Hash</p>
                    <button
                      onClick={(e: any) => copyToClipboard(property.integrityHash || '', 'integrity')}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {copiedHash === 'integrity' ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                  <code className="block font-mono text-emerald-300 text-xs break-all bg-slate-950 p-3 rounded-lg border border-slate-700/50">
                    {property.integrityHash}
                  </code>
                  {property.explorerLinks?.integrityHash && (
                    <a
                      href={property.explorerLinks.integrityHash}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 rounded-lg text-xs font-bold text-emerald-300"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      View on Blockscout
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Activity History */}
          {propertyActions.length > 0 && (
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-400">history</span> Provenance & Activity
              </h2>
              <div className="space-y-4">
                {propertyActions.map((action: any) => {
                  const ai = activityIcons[action.type] || { icon: 'circle', color: 'bg-slate-600' };
                  return (
                    <div key={action.id} className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 flex items-start gap-4">
                      <div className={`${ai.color} rounded-lg p-2 mt-1 flex-shrink-0`}>
                        <span className="material-symbols-outlined text-white text-lg">{ai.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-100">{action.description}</p>
                        <p className="text-slate-400 text-xs font-mono mt-1">
                          {new Date(action.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          •{' '}
                          <span className={action.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>
                            {action.status.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Metadata Cards */}
        <div className="space-y-6">
          {/* Owner Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Owner</p>
            <div className="space-y-3">
              <code className="block font-mono text-emerald-400 text-xs break-all bg-slate-950 p-3 rounded-lg border border-slate-700/50">
                {property.ownerWallet}
              </code>
              {property.explorerLinks?.owner && (
                <a
                  href={property.explorerLinks.owner}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 rounded-lg text-xs font-bold text-cyan-300 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View Owner
                </a>
              )}
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">Template</p>
            <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-3">
              <p className="font-mono text-sm text-slate-300 break-all">{templateName}</p>
            </div>
          </div>

          {/* Created / Updated */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Created</p>
                <p className="text-slate-300 text-sm font-mono">
                  {new Date(property.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Updated</p>
                <p className="text-slate-300 text-sm font-mono">
                  {new Date(property.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Asset Faces */}
          {faces.length > 0 && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Asset Faces</p>
              <div className="space-y-2">
                {faces.map((face: any) => (
                  <div key={face.id} className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-3">
                    <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">{face.type}</p>
                    <p className="text-xs text-slate-400 font-mono truncate">{face.url.substring(0, 40)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
