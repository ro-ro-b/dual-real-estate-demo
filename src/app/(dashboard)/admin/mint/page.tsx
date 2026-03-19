'use client';

import { useState, useEffect } from 'react';
import type { Template } from '@/types';

export default function MintPropertyPage() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    country: 'USA',
    description: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    latitude: 0,
    longitude: 0,
    imageUrl: '',
    status: 'available' as const,
  });

  const [template, setTemplate] = useState<Template | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        const templates = Array.isArray(data) ? data : data.templates || [];
        if (templates.length > 0) {
          setTemplate(templates[0]);
        }
      } catch (err) {
        console.error('Failed to fetch template:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.city || formData.price <= 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const result = await response.json();
        alert('Property minted successfully! Object ID: ' + result.objectId);
        setFormData({
          address: '', city: '', country: 'USA', description: '',
          price: 0, bedrooms: 0, bathrooms: 0, squareMeters: 0,
          latitude: 0, longitude: 0, imageUrl: '', status: 'available',
        });
      }
    } catch (error) {
      console.error('Error minting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !!(formData.address && formData.city && formData.price > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Mint New Property</h1>
        <p className="text-slate-500 text-lg">Create and register a new tokenised real estate property on DUAL</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <form onSubmit={handleSubmit}>
            <section className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-600">info</span>
                Property Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Address</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                    placeholder="123 Blockchain Way, Genesis City"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                      placeholder="New York"
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                      placeholder="USA"
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input
                        className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3 pl-8"
                        placeholder="500,000"
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area (Sqm)</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                      placeholder="120"
                      type="number"
                      value={formData.squareMeters || ''}
                      onChange={(e) => handleChange('squareMeters', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                      placeholder="3"
                      type="number"
                      value={formData.bedrooms || ''}
                      onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                      placeholder="2"
                      type="number"
                      value={formData.bathrooms || ''}
                      onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Latitude</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                      placeholder="-33.8688"
                      type="text"
                      value={formData.latitude || ''}
                      onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Longitude</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                      placeholder="151.2093"
                      type="text"
                      value={formData.longitude || ''}
                      onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3"
                    placeholder="https://images.unsplash.com/photo-..."
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm opacity-80 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-600">description</span>
                Template Settings
              </h2>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-500">Template</span>
                  <span className="px-2 py-1 text-xs font-bold rounded bg-gold-100 text-gold-800">{template?.version || '1.0.0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Name</span>
                  <span className="text-sm font-medium font-mono">{template?.name || 'Loading...'}</span>
                </div>
                <p className="mt-4 text-xs text-slate-400 italic">Template fields are locked by administrator policy for this property type.</p>
              </div>
            </section>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-gradient-to-r from-primary-consumer to-wine-700 hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary-consumer/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Minting...' : 'Mint Property NFT'}</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-600">visibility</span>
              Live Preview
            </h2>

            {/* Property Card Preview */}
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xl group">
              <div className="relative h-64 w-full">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: formData.imageUrl
                      ? `url('${formData.imageUrl}')`
                      : 'linear-gradient(135deg, #791b3a, #a80e4e)',
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-consumer text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">New Listing</span>
                </div>
                {formData.price > 0 && (
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                    <span className="text-primary-consumer">$</span>{formData.price.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 truncate">
                  {formData.address || '123 Blockchain Way, Genesis City'}
                </h3>
                <div className="flex items-center gap-2 text-slate-500 mb-6">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="text-sm">{formData.city || 'City'}, {formData.country || 'Country'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-gold-600">bed</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">{formData.bedrooms || 0} Beds</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-gold-600">bathtub</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">{formData.bathrooms || 0} Baths</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-gold-600">square_foot</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">{formData.squareMeters || 0} Sqm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="mt-8 bg-wine-50 border border-wine-100 rounded-xl p-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary-consumer">help</span>
                <div>
                  <h4 className="font-bold text-primary-consumer mb-1">Need assistance?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Minting a property creates a unique NFT on the blockchain representing ownership. Ensure all legal documentation matches the address provided.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
