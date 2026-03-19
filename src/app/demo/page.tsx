'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DemoPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.json())
      .then((d) => setProperties(d.data || d.properties || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background-light p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary-consumer">DUAL Real Estate Demo</h1>
          <p className="text-slate-500 mt-1">Scan any QR code to claim a property token to your session wallet</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading properties from DUAL network...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-slate-400">No properties found. Mint some properties via the admin dashboard first.</p>
            <Link href="/admin" className="inline-block mt-4 text-primary-consumer underline">
              Go to Admin →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop: any) => (
              <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="wine-gradient p-4 text-center">
                  <span className="text-2xl">🏠</span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {prop.propertyData?.address || 'DUAL Property'}
                  </h3>
                  {prop.propertyData?.city && (
                    <p className="text-wine-200 text-xs">{prop.propertyData.city}</p>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-center">
                    <img
                      src={`/api/qr/${prop.id}`}
                      alt={`QR for ${prop.id}`}
                      className="w-48 h-48"
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-center">
                    {prop.status === 'anchored' || prop.provenance?.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gold-500/10 border border-gold-500/30 text-gold-700 px-2.5 py-1 rounded-full">
                        ⛓ Anchored
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 text-center font-mono truncate">
                    {prop.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
