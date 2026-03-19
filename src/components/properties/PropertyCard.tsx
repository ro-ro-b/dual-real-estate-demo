'use client';

import Link from 'next/link';
import { Property } from '@/lib/demo-data';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { id, propertyData, faces, onChainStatus } = property;
  const imageUrl = faces.length > 0 ? faces[0].url : undefined;

  const statusStyles: Record<string, { bg: string; text: string }> = {
    available: { bg: 'bg-[#14b8a7]', text: 'Available' },
    reserved: { bg: 'bg-amber-500', text: 'Reserved' },
    sold: { bg: 'bg-red-500', text: 'Sold' },
  };

  const status = statusStyles[propertyData.status] || statusStyles.available;

  return (
    <Link href={`/properties/${id}`}>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-[16/10] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundImage: imageUrl
                ? `url('${imageUrl}')`
                : 'linear-gradient(135deg, #14b8a7, #0f766e)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 ${status.bg} text-white text-[10px] font-bold uppercase tracking-wider rounded-full`}>
              {status.text}
            </span>
            {onChainStatus === 'anchored' && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 border border-white/30">
                <span className="material-symbols-outlined text-[12px]">link</span> Anchored
              </span>
            )}
            {onChainStatus === 'pending' && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 border border-white/30 animate-pulse">
                <span className="material-symbols-outlined text-[12px]">hourglass_empty</span> Pending
              </span>
            )}
          </div>

          {/* Address overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs font-medium text-white/80 uppercase tracking-widest">{propertyData.city}</p>
            <h4 className="font-bold text-lg truncate">{propertyData.address}</h4>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-2xl font-bold text-slate-800">
              ${propertyData.price.toLocaleString()}
            </h5>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-slate-500 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg text-slate-400">bed</span>
              <span>{propertyData.bedrooms} Bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg text-slate-400">bathtub</span>
              <span>{propertyData.bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg text-slate-400">square_foot</span>
              <span>{propertyData.squareMeters} sqm</span>
            </div>
          </div>

          {/* Blockchain Verification */}
          {property.explorerLinks && (
            <div className="mt-2 pt-2 border-t border-gray-200 flex flex-wrap gap-2">
              {property.explorerLinks.owner && (
                <a
                  href={property.explorerLinks.owner}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e: any) => e.stopPropagation()}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  Owner
                </a>
              )}
              {property.explorerLinks.contentHash && (
                <a
                  href={property.explorerLinks.contentHash}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e: any) => e.stopPropagation()}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  Content Hash
                </a>
              )}
              {property.explorerLinks.integrityHash && (
                <a
                  href={property.explorerLinks.integrityHash}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e: any) => e.stopPropagation()}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  Integrity
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
