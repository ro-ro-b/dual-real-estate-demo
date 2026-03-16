'use client';

import { useState, useEffect } from 'react';

interface WebhookEvent {
  id: string;
  timestamp: string;
  eventType: string;
  payload: Record<string, any>;
}

export default function WebhooksPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [isLive, setIsLive] = useState(true);

  const mockEvents = [
    {
      eventType: 'property.anchored',
      propertyId: '123e4567-e89b-12d3-a456-426614174000',
      txHash: '0x742d35cc6634c0532925a3b844bc026e6f7d30f0',
      blockNumber: 19482102,
    },
    {
      eventType: 'action.completed',
      actionId: 'action-001',
      type: 'PROPERTY_CREATED',
      actor: '0x742d35Cc6634C0532925a3b844Bc026e6f7D30f0',
      propertyId: '123e4567-e89b-12d3-a456-426614174001',
    },
    {
      eventType: 'property.anchoring_failed',
      propertyId: '123e4567-e89b-12d3-a456-426614174002',
      reason: 'insufficient_gas',
      retryCount: 2,
    },
  ];

  useEffect(() => {
    if (!isLive) return;

    let eventIndex = 0;
    const interval = setInterval(() => {
      if (eventIndex < mockEvents.length) {
        const mockEvent = mockEvents[eventIndex];
        const newEvent: WebhookEvent = {
          id: `${Date.now()}-${eventIndex}`,
          timestamp: new Date().toISOString(),
          eventType: mockEvent.eventType,
          payload: mockEvent,
        };
        setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
        eventIndex++;
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isLive]);

  const getEventColor = (eventType: string) => {
    if (eventType.includes('failed')) return 'text-rose-400';
    if (eventType.includes('anchored')) return 'text-emerald-400';
    if (eventType.includes('completed')) return 'text-[#14b8a7]';
    return 'text-slate-400';
  };

  const getEventBgColor = (eventType: string) => {
    if (eventType.includes('failed')) return 'bg-rose-900/20';
    if (eventType.includes('anchored')) return 'bg-emerald-900/20';
    if (eventType.includes('completed')) return 'bg-[#14b8a7]/20';
    return 'bg-slate-900/20';
  };

  return (
    <div>
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#14b8a7]/20 rounded-xl text-[#14b8a7]">
            <span className="material-symbols-outlined text-3xl">webhook</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Webhook Events</h1>
            <p className="text-slate-500 text-sm">Real-time event stream from DUAL Network.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-tight">Live</span>
        </div>
      </div>

      {/* Terminal Container */}
      <div className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-red-500"></div>
            <div className="size-2 rounded-full bg-amber-500"></div>
            <div className="size-2 rounded-full bg-emerald-500"></div>
          </div>
          <p className="text-xs text-slate-400 font-mono">webhook-stream.log</p>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-6 h-[600px] overflow-y-auto font-mono text-sm space-y-2 bg-[#0f172a]">
          {events.length === 0 ? (
            <div className="text-slate-500 h-full flex items-center justify-center text-center">
              <div>
                <p className="text-xs mb-2">Waiting for webhook events...</p>
                <p className="text-[10px] text-slate-600">Events will appear here in real-time</p>
              </div>
            </div>
          ) : (
            events.map((event) => {
              const time = new Date(event.timestamp).toLocaleTimeString();
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded border border-slate-800/50 ${getEventBgColor(event.eventType)}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-500">[{time}]</span>
                    <span className={`font-bold ${getEventColor(event.eventType)}`}>{event.eventType}</span>
                  </div>
                  <div className="pl-4 text-slate-400 text-[11px] space-y-1">
                    {Object.entries(event.payload).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-slate-500">{key}:</span>{' '}
                        <span className="text-slate-300">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Terminal Footer */}
        <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-800 flex items-center gap-2">
          <span className="text-slate-500">$</span>
          <span className="text-slate-400 text-xs">tail -f webhook-stream.log</span>
          <span className="ml-auto text-[10px] text-slate-500">{events.length} events</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#14b8a7]/10 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-[#14b8a7]">webhook</span>
            <h3 className="font-bold text-slate-900">Event Types</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-600">property.anchored</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#14b8a7]"></span>
              <span className="text-slate-600">action.completed</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-rose-400"></span>
              <span className="text-slate-600">property.anchoring_failed</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#14b8a7]/10 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-[#14b8a7]">settings</span>
            <h3 className="font-bold text-slate-900">Configuration</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">
              <span className="text-slate-500 font-medium">Endpoint:</span> /api/webhooks
            </p>
            <p className="text-slate-600">
              <span className="text-slate-500 font-medium">Retries:</span> 3
            </p>
            <p className="text-slate-600">
              <span className="text-slate-500 font-medium">Timeout:</span> 30s
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#14b8a7]/10 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-[#14b8a7]">equalizer</span>
            <h3 className="font-bold text-slate-900">Statistics</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">
              <span className="text-slate-500 font-medium">Total:</span> {events.length}
            </p>
            <p className="text-slate-600">
              <span className="text-slate-500 font-medium">Success Rate:</span> 98.2%
            </p>
            <p className="text-slate-600">
              <span className="text-slate-500 font-medium">Avg. Latency:</span> 152ms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
