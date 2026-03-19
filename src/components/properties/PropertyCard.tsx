'use client';

import Link from 'next/link';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { id, propertyData, faces, onChainStatus, templateName } = property;
  const imageUrl = faces.length > 0 ? faces[0].url : 'https://dual-docs-gray.vercel.app/assets/products/property-token.svg';

  const truncateHash = (hash: string | undefined, length: number = 6) => {
    if (!hash) return '';
    return hash.substring(0, length) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/properties/${id}`}>
      <div className="group h-full cursor-pointer">
        {/* Premium Token Card with glass-morphism */}
        <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col">
          {/* Token Image Header */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
            <img
              src={imageUrl}
              alt={propertyData.address}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Token ID Badge */}
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1.5 bg-indigo-600/90 backdrop-blur-md border border-indigo-400/50 rounded-lg font-mono text-xs font-bold text-indigo-100 tracking-wider">
                #{truncateHash(id, 5)}
              </div>
            </div>

            {/* Anchored Status Badge with Glow */}
            {onChainStatus === 'anchored' && (
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1.5 bg-emerald-600/90 backdrop-blur-md border border-emerald-400/50 rounded-lg flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-100 animate-pulse shadow-lg shadow-emerald-500/50">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                  ANCHORED
                </div>
              </div>
            )}
            {onChainStatus === 'pending' && (
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1.5 bg-amber-600/90 backdrop-blur-md border border-amber-400/50 rounded-lg flex items-center gap-1.5 font-mono text-xs font-bold text-amber-100 animate-pulse">
                  <span className="material-symbols-outlined text-xs">hourglass_empty</span>
                  PENDING
                </div>
              </div>
            )}
          </div>

          {/* Token Info Section */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            {/* Template Name */}
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
                {templateName || 'Property Token'}
              </p>
              <h3 className="text-lg font-bold text-slate-100 mb-3 line-clamp-2">{propertyData.address}</h3>

              {/* Content Hash Preview */}
              {property.contentHash && (
                <div className="mb-4">
                  <p className="text-xs font-mono text-slate-500 mb-1">Content Hash</p>
                  <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg px-2.5 py-1.5">
                    <code className="text-[11px] font-mono text-emerald-400">
                      {truncateHash(property.contentHash, 14)}
                    </code>
                  </div>
                </div>
              )}
            </div>

            {/* Owner & Created Date */}
            <div className="space-y-3 border-t border-slate-700/50 pt-4">
              {property.ownerWallet && (
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Owner</p>
                  <a
                    href={property.explorerLinks?.owner || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e: any) => e.stopPropagation()}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors truncate max-w-[120px]"
                  >
                    {property.ownerWallet.substring(0, 6)}...{property.ownerWallet.substring(property.ownerWallet.length - 4)}
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Created</p>
                <p className="text-xs text-slate-400">{formatDate(property.createdAt)}</p>
              </div>

              {/* View on Chain Button */}
              {property.explorerLinks?.contentHash && (
                <a
                  href={property.explorerLinks.contentHash}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e: any) => e.stopPropagation()}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 hover:border-emerald-400 rounded-lg text-xs font-bold text-emerald-300 hover:text-emerald-100 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View on Chain
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
