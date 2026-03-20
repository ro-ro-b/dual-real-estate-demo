'use client';

import { useState, useEffect } from 'react';
import type { Template } from '@/types';

type AuthState = 'checking' | 'unauthenticated' | 'otp_sent' | 'authenticated';

export default function MintPropertyPage() {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    country: 'Australia',
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
  const [mintResult, setMintResult] = useState<{ actionId: string; objectIds: string[] } | null>(null);
  const [mintError, setMintError] = useState('');

  // Check auth status on mount
  useEffect(() => {
    fetch('/api/auth/status').then(r => r.json()).then(d => {
      setAuthState(d.authenticated ? 'authenticated' : 'unauthenticated');
    }).catch(() => setAuthState('unauthenticated'));
  }, []);

  // Fetch template once authenticated
  useEffect(() => {
    if (authState !== 'authenticated') return;
    const fetchTemplate = async () => {
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        const templates = Array.isArray(data) ? data : data.templates || [];
        if (templates.length > 0) setTemplate(templates[0]);
      } catch (err) {
        console.error('Failed to fetch template:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [authState]);

  const handleSendOtp = async () => {
    if (!email) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setAuthState('otp_sent');
      else setAuthError(data.error || 'Failed to send OTP');
    } catch {
      setAuthError('Network error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) setAuthState('authenticated');
      else setAuthError(data.error || 'Login failed');
    } catch {
      setAuthError('Network error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.city || formData.price <= 0) return;

    setIsSubmitting(true);
    setMintError('');
    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setMintResult({ actionId: result.actionId, objectIds: result.objectIds });
      } else {
        setMintError(result.error || 'Mint failed');
        if (response.status === 401) setAuthState('unauthenticated');
      }
    } catch (error: any) {
      setMintError(error.message || 'Error minting property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !!(formData.address && formData.city && formData.price > 0);

  const inputClass = "w-full rounded-lg border border-slate-200 bg-[#f6f8f8] focus:ring-2 focus:ring-primary-consumer focus:border-primary-consumer p-3";

  // ── Auth Gate ──
  if (authState === 'checking') {
    return <div className="text-center text-slate-500 py-24">Checking authentication...</div>;
  }

  if (authState === 'unauthenticated' || authState === 'otp_sent') {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="w-16 h-16 rounded-full bg-wine-50 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary-consumer text-3xl">lock</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 text-center mb-2">DUAL Network Auth</h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            {authState === 'unauthenticated'
              ? 'Enter your email to receive a one-time code for minting tokens.'
              : `Enter the OTP code sent to ${email}`}
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{authError}</div>
          )}

          {authState === 'unauthenticated' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="admin@example.com"
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={authLoading || !email}
                className="w-full bg-gradient-to-r from-primary-consumer to-wine-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
                {authLoading ? 'Sending...' : 'Send OTP Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className={`${inputClass} text-center tracking-[0.3em] font-mono text-lg`}
                  placeholder="Enter code"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={authLoading || !otp}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                {authLoading ? 'Authenticating...' : 'Verify & Login'}
              </button>
              <button
                onClick={() => { setAuthState('unauthenticated'); setOtp(''); setAuthError(''); }}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-2"
              >
                Back to email
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Mint Success ──
  if (mintResult) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Property Minted!</h2>
          <p className="text-sm text-slate-500 mb-4">Token created on the DUAL network</p>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-xs font-mono text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Action ID</span>
              <span className="text-slate-700 truncate ml-4">{mintResult.actionId}</span>
            </div>
            {mintResult.objectIds.map((id, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-slate-400">Object {i + 1}</span>
                <span className="text-slate-700 truncate ml-4">{id}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { setMintResult(null); setFormData({ ...formData, address: '', city: '', price: 0, description: '' }); }}
              className="flex-1 bg-gradient-to-r from-primary-consumer to-wine-700 text-white font-bold py-3 px-6 rounded-xl"
            >
              Mint Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Mint Form ──
  return (
    <div>
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Mint New Property</h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Authenticated
          </span>
        </div>
        <p className="text-slate-500 text-lg">Create and register a new tokenised real estate property on DUAL</p>
      </div>

      {mintError && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm max-w-4xl">{mintError}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
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
                  <input className={inputClass} placeholder="123 Blockchain Way, Genesis City" type="text" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input className={inputClass} placeholder="Sydney" type="text" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input className={inputClass} placeholder="Australia" type="text" value={formData.country} onChange={(e) => handleChange('country', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input className={`${inputClass} pl-8`} placeholder="500,000" type="number" value={formData.price || ''} onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area (Sqm)</label>
                    <input className={inputClass} placeholder="120" type="number" value={formData.squareMeters || ''} onChange={(e) => handleChange('squareMeters', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <input className={inputClass} placeholder="3" type="number" value={formData.bedrooms || ''} onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <input className={inputClass} placeholder="2" type="number" value={formData.bathrooms || ''} onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Latitude</label>
                    <input className={inputClass} placeholder="-33.8688" type="text" value={formData.latitude || ''} onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Longitude</label>
                    <input className={inputClass} placeholder="151.2093" type="text" value={formData.longitude || ''} onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea rows={3} className={inputClass} placeholder="Property description..." value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input className={inputClass} placeholder="https://images.unsplash.com/photo-..." type="url" value={formData.imageUrl} onChange={(e) => handleChange('imageUrl', e.target.value)} />
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
              </div>
            </section>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-gradient-to-r from-primary-consumer to-wine-700 hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary-consumer/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Minting on DUAL...' : 'Mint Property Token'}</span>
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

            <div className="mt-8 bg-wine-50 border border-wine-100 rounded-xl p-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary-consumer">help</span>
                <div>
                  <h4 className="font-bold text-primary-consumer mb-1">Need assistance?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Minting a property creates a unique token on the DUAL network representing the asset. Each token is anchored on-chain via <code className="text-xs">/ebus/execute</code>.
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
