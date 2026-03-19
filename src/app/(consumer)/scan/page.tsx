'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Property } from '@/types';

type ScanState = 'scanning' | 'verifying' | 'result';
type ResultStatus = 'verified' | 'unverified' | 'unknown';

interface VerificationStep {
  label: string;
  status: 'done' | 'active' | 'pending';
}

const ScanPage = () => {
  const [state, setState] = useState<ScanState>('scanning');
  const [resultStatus, setResultStatus] = useState<ResultStatus>('unknown');
  const [scannedProperty, setScannedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { label: 'QR code decoded', status: 'done' },
    { label: 'Querying DUAL blockchain', status: 'pending' },
    { label: 'Validating title deed', status: 'pending' },
    { label: 'Confirming ownership chain', status: 'pending' },
  ]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const qrScannerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [Html5Qrcode, setHtml5Qrcode] = useState<any>(null);

  // Dynamically import Html5Qrcode to avoid SSR issues
  useEffect(() => {
    import('html5-qrcode').then((module) => {
      setHtml5Qrcode(() => module.Html5Qrcode);
    });
  }, []);

  // Fetch properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : data.properties || []);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      }
    };
    fetchProperties();
  }, []);

  // Initialize scanner
  useEffect(() => {
    if (!Html5Qrcode || state !== 'scanning') return;

    const initScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        qrScannerRef.current = scanner;
        setCameraError(null);

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText: string) => {
            handleQrDecode(decodedText);
            scanner.stop();
          },
          (errorMessage: string) => {
            // Ignore continuous scanning errors
          }
        );
      } catch (err: any) {
        setCameraError(err.message || 'Failed to access camera. Please check permissions.');
      }
    };

    initScanner();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(() => {});
      }
    };
  }, [Html5Qrcode, state]);

  const handleQrDecode = (decodedText: string) => {
    setState('verifying');
    simulateVerification(decodedText);
  };

  const simulateVerification = (decodedText: string) => {
    // Try to match against property IDs, otherwise pick a random available property
    let matchedProperty = properties.find((p: any) => p.id === decodedText);

    if (!matchedProperty) {
      const availableProperties = properties.filter((p: any) => p.propertyData.status === 'available');
      matchedProperty = availableProperties[Math.floor(Math.random() * availableProperties.length)];
    }

    // Animate verification steps
    setTimeout(() => {
      setVerificationSteps((prev) => [
        prev[0],
        { ...prev[1], status: 'active' },
        prev[2],
        prev[3],
      ]);
    }, 500);

    setTimeout(() => {
      setVerificationSteps((prev) => [
        prev[0],
        { ...prev[1], status: 'done' },
        { ...prev[2], status: 'active' },
        prev[3],
      ]);
    }, 1500);

    setTimeout(() => {
      setVerificationSteps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'done' },
        { ...prev[3], status: 'active' },
      ]);
    }, 2500);

    setTimeout(() => {
      setVerificationSteps((prev) => [prev[0], prev[1], prev[2], { ...prev[3], status: 'done' }]);
      setScannedProperty(matchedProperty!);
      setResultStatus('verified');
      setState('result');
    }, 3500);
  };

  const handleDemoScan = () => {
    setState('verifying');
    const randomProperty = properties[Math.floor(Math.random() * properties.length)];
    setVerificationSteps([
      { label: 'QR code decoded', status: 'done' },
      { label: 'Querying DUAL blockchain', status: 'pending' },
      { label: 'Validating title deed', status: 'pending' },
      { label: 'Confirming ownership chain', status: 'pending' },
    ]);
    simulateVerification(randomProperty.id);
  };

  const handleRetry = () => {
    setState('scanning');
    setScannedProperty(null);
    setResultStatus('unknown');
    setCameraError(null);
    setVerificationSteps([
      { label: 'QR code decoded', status: 'done' },
      { label: 'Querying DUAL blockchain', status: 'pending' },
      { label: 'Validating title deed', status: 'pending' },
      { label: 'Confirming ownership chain', status: 'pending' },
    ]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const truncateAddress = (addr: string) => {
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  const generateChainHash = () => {
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const generateConfirmations = () => {
    return Math.floor(Math.random() * 49) + 12;
  };

  return (
    <div className="h-screen w-screen bg-slate-950 overflow-hidden">
      {state === 'scanning' && (
        <div className="relative h-full w-full">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-slate-950 to-transparent">
            <Link
              href="/wallet"
              className="text-white hover:text-teal-400 transition-colors"
              aria-label="Close scanner"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Verify Property</h1>
            <div className="w-6"></div>
          </div>

          {/* Camera/QR Reader */}
          <div className="h-full w-full">
            {cameraError ? (
              <div className="h-full flex items-center justify-center px-4">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">videocam_off</span>
                  <p className="text-white text-lg mb-4">{cameraError}</p>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div id="qr-reader" className="w-full h-full" />
            )}
          </div>

          {/* Scan Frame Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <svg
              className="w-64 h-64"
              viewBox="0 0 256 256"
              fill="none"
              stroke="#14b8a7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Top-left corner */}
              <path d="M 20 40 L 20 20 L 40 20" />
              {/* Top-right corner */}
              <path d="M 236 20 L 216 20 L 216 40" />
              {/* Bottom-right corner */}
              <path d="M 216 236 L 216 216 L 236 216" />
              {/* Bottom-left corner */}
              <path d="M 40 216 L 20 216 L 20 236" />
            </svg>

            {/* Animated scanning line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-64 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse"
                style={{
                  animation: 'scanLine 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Bottom Instructions */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-6 z-20">
            <p className="text-center text-teal-300 mb-6">Point camera at property title deed QR code</p>
            <button
              onClick={handleDemoScan}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all"
            >
              Demo: Simulate Scan
            </button>
          </div>

          {/* CSS for scanning animation */}
          <style jsx>{`
            @keyframes scanLine {
              0% {
                transform: translateY(-128px);
              }
              50% {
                transform: translateY(128px);
              }
              100% {
                transform: translateY(-128px);
              }
            }
          `}</style>
        </div>
      )}

      {state === 'verifying' && (
        <div className="h-full w-full bg-slate-100 flex items-center justify-center px-4">
          <div className="text-center">
            {/* Verification animation */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-teal-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" style={{ animationDirection: 'reverse' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-teal-600">real_estate_agent</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Property</h2>
            <p className="text-slate-600 mb-8">Checking DUAL Network for title deed...</p>

            {/* Verification steps */}
            <div className="space-y-3 max-w-md">
              {verificationSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="flex-shrink-0">
                    {step.status === 'done' && (
                      <span className="material-symbols-outlined text-xl text-emerald-500">check_circle</span>
                    )}
                    {step.status === 'active' && (
                      <span className="material-symbols-outlined text-xl text-teal-500 animate-spin">
                        progress_activity
                      </span>
                    )}
                    {step.status === 'pending' && (
                      <span className="material-symbols-outlined text-xl text-slate-400">radio_button_unchecked</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step.status === 'done'
                        ? 'text-slate-700'
                        : step.status === 'active'
                          ? 'text-teal-600'
                          : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {state === 'result' && scannedProperty && (
        <div className="h-full w-full bg-white overflow-y-auto">
          {/* Status Banner */}
          <div
            className={`px-6 py-4 flex items-center gap-3 ${
              resultStatus === 'verified'
                ? 'bg-emerald-50 border-b-2 border-emerald-400'
                : resultStatus === 'unverified'
                  ? 'bg-red-50 border-b-2 border-red-400'
                  : 'bg-amber-50 border-b-2 border-amber-400'
            }`}
          >
            {resultStatus === 'verified' && (
              <>
                <span className="material-symbols-outlined text-emerald-600">verified</span>
                <span className="font-semibold text-emerald-900">VERIFIED</span>
              </>
            )}
            {resultStatus === 'unverified' && (
              <>
                <span className="material-symbols-outlined text-red-600">gpp_bad</span>
                <span className="font-semibold text-red-900">UNVERIFIED</span>
              </>
            )}
            {resultStatus === 'unknown' && (
              <>
                <span className="material-symbols-outlined text-amber-600">help</span>
                <span className="font-semibold text-amber-900">UNKNOWN</span>
              </>
            )}
          </div>

          <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Property Image */}
            {scannedProperty.faces.length > 0 && (
              <img
                src={scannedProperty.faces[0].url}
                alt={scannedProperty.propertyData.address}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}

            {/* Property Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{scannedProperty.propertyData.address}</h2>
              <p className="text-slate-600">{scannedProperty.propertyData.city}, {scannedProperty.propertyData.country}</p>
              <p className="text-2xl font-bold text-teal-600 mt-2">{formatCurrency(scannedProperty.propertyData.price)}</p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-teal-600">{scannedProperty.propertyData.bedrooms}</p>
                <p className="text-sm text-slate-600 mt-1">Bedrooms</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-teal-600">{scannedProperty.propertyData.bathrooms}</p>
                <p className="text-sm text-slate-600 mt-1">Bathrooms</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-teal-600">{scannedProperty.propertyData.squareMeters}</p>
                <p className="text-sm text-slate-600 mt-1">m²</p>
              </div>
            </div>

            {/* Owner Wallet */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Owner Wallet</p>
              <p className="font-mono text-sm text-slate-900">{truncateAddress(scannedProperty.ownerWallet)}</p>
            </div>

            {/* On-Chain Verification Panel */}
            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
              <p className="font-semibold text-slate-900 mb-3">On-Chain Verification</p>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-sm text-slate-600">Chain Hash</span>
                <span className="font-mono text-xs text-slate-900">{generateChainHash().slice(0, 16)}...</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-sm text-slate-600">Block Confirmations</span>
                <span className="font-semibold text-teal-600">{generateConfirmations()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600">Verified At</span>
                <span className="text-sm text-slate-900">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="mt-3 inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">
                On-Chain: Anchored
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-slate-600 mb-2">Description</p>
              <p className="text-slate-700 line-clamp-3">{scannedProperty.propertyData.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Link
                href={`/wallet/${scannedProperty.id}`}
                className="block w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-semibold text-center hover:from-teal-600 hover:to-emerald-600 transition-all"
              >
                View Full Property
              </Link>
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 border-2 border-teal-500 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-all"
              >
                Scan Another Property
              </button>
              <Link
                href="/wallet"
                className="block w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold text-center hover:bg-slate-200 transition-all"
              >
                Back to Properties
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
