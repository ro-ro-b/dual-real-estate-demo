'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { DashboardStats, Action, Property } from '@/types';

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actionsRes, propertiesRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/actions'),
          fetch('/api/properties'),
        ]);
        const statsData = await statsRes.json();
        const actionsData = await actionsRes.json();
        const propertiesData = await propertiesRes.json();

        setStats(statsData);
        setActions(Array.isArray(actionsData) ? actionsData : actionsData.actions || []);
        setProperties(Array.isArray(propertiesData) ? propertiesData : propertiesData.properties || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentActions = [...actions].sort((a: any, b: any) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5);

  const actionIcons: Record<string, { icon: string; color: string }> = {
    PROPERTY_CREATED: { icon: 'token', color: 'text-primary-consumer' },
    PROPERTY_ANCHORED: { icon: 'verified', color: 'text-blue-500' },
    PROPERTY_RESERVED: { icon: 'update', color: 'text-amber-500' },
    PROPERTY_ANCHORING: { icon: 'local_offer', color: 'text-gold-600' },
  };

  const demoStats = stats || { anchored: 0, totalProperties: 1, available: 0, totalValue: 0, totalValueChange: '+0%' };
  const anchoredCount = demoStats.anchored || 0;
  const totalCount = demoStats.totalProperties;
  const anchoredPercent = Math.round((anchoredCount / totalCount) * 100);

  return (
    <div>
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-wine-50 rounded-xl text-primary-consumer">
            <span className="material-symbols-outlined text-3xl">bar_chart</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Overview of platform health and property management activities.</p>
          </div>
        </div>
        <Link href="/admin/mint" className="bg-gradient-to-r from-primary-consumer to-wine-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary-consumer/20">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          New Property
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Properties', value: String(demoStats.totalProperties), icon: 'domain', trend: '+12%', up: true },
          { title: 'Active Listings', value: String(demoStats.available), icon: 'list_alt', trend: '+5%', up: true },
          { title: 'Total Volume', value: `$${(demoStats.totalValue / 1000000).toFixed(1)}M`, icon: 'payments', trend: demoStats.totalValueChange, up: true },
          { title: 'Avg. Price', value: `$${(demoStats.totalValue / demoStats.totalProperties / 1000).toFixed(1)}K`, icon: 'equalizer', trend: '+8%', up: true },
        ].map((card: any) => (
          <div key={card.title} className="bg-white rounded-xl p-6 border border-wine-100 shadow-sm hover:border-wine-300 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 text-sm font-medium">{card.title}</p>
              <span className="material-symbols-outlined text-gold-600 bg-gold-50 p-1.5 rounded-lg">{card.icon}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
              <p className={`${card.up ? 'text-emerald-500' : 'text-rose-500'} text-xs font-bold flex items-center mb-1`}>
                <span className="material-symbols-outlined text-xs">{card.up ? 'arrow_upward' : 'arrow_downward'}</span>
                {card.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Recent Activity */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-wine-100 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-wine-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">Recent Activity</h3>
              <button className="text-primary-consumer text-xs font-bold hover:underline">View All Activity</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f6f8f8] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-5 py-4">Time</th>
                    <th className="px-5 py-4">Action</th>
                    <th className="px-5 py-4">Property</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wine-100/50">
                  {recentActions.map((action: any) => {
                    const ai = actionIcons[action.type] || { icon: 'circle', color: 'text-slate-400' };
                    const property = properties.find((p: any) => p.id === action.objectId);
                    const timeDiff = Date.now() - new Date(action.timestamp).getTime();
                    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

                    return (
                      <tr key={action.id} className="hover:bg-wine-50/50 transition-colors">
                        <td className="px-5 py-4 text-sm text-slate-500">{timeLabel}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined ${ai.color} text-[18px]`}>{ai.icon}</span>
                            <span className="text-sm font-medium text-slate-900">{action.type.replace('PROPERTY_', '').replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {property ? property.propertyData.address.split(',')[0] : action.objectId.substring(0, 8) + '...'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            action.status === 'completed'
                              ? 'bg-gold-100 text-gold-800'
                              : action.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {action.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions + Security */}
        <div className="lg:col-span-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Mint Property', icon: 'add_box', href: '/admin/mint' },
              { title: 'Manage Templates', icon: 'auto_awesome_motion', href: '#' },
              { title: 'Configure Webhooks', icon: 'settings_ethernet', href: '#' },
              { title: 'Sequencer Status', icon: 'lan', href: '#' },
            ].map((item: any) => (
              <Link key={item.title} href={item.href}>
                <div className="bg-white p-5 rounded-xl border border-wine-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center">
                  <div className="bg-gold-50 p-3 rounded-full mb-3 group-hover:bg-primary-consumer group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                </div>
              </Link>
            ))}
          </div>
          {/* Security Card */}
          <div className="mt-6 bg-slate-900 rounded-xl p-5 text-white overflow-hidden relative border border-slate-800">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]">security</span>
            </div>
            <div className="relative z-10">
              <h4 className="font-bold mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-400 text-[18px]">verified_user</span>
                Security Check
              </h4>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">No unauthorized access attempts detected in the last 24 hours. Your admin key is currently active.</p>
              <button className="w-full bg-slate-800 text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">Audit Logs</button>
            </div>
          </div>
        </div>
      </div>

      {/* On-Chain Status */}
      <div className="bg-white rounded-xl border border-wine-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-600">link</span>
              On-Chain Sync Status
            </h3>
            <p className="text-slate-500 text-sm">Real-time status of asset anchoring and L2 batch commitment.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-100 text-gold-700 rounded-lg">
              <span className="size-2 bg-gold-500 rounded-full"></span>
              <span className="text-xs font-bold uppercase tracking-tight">Healthy</span>
            </div>
            <div className="text-xs font-mono text-slate-400">Latency: 12ms</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600 font-medium">Anchoring Process ({anchoredCount} of {totalCount} anchored)</span>
            <span className="text-gold-600 font-bold">{anchoredPercent}%</span>
          </div>
          <div className="w-full h-3 bg-[#f6f8f8] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-consumer to-gold-500 rounded-full" style={{ width: `${anchoredPercent}%` }}></div>
          </div>
          <div className="grid grid-cols-8 gap-2 mt-4">
            {properties.map((p: any, i: number) => (
              <div key={i} className={`h-1 rounded-full ${p.onChainStatus === 'anchored' ? 'bg-gold-500' : 'bg-slate-200'}`}></div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2">
            <p className="text-[10px] text-slate-400">Last Block: #19,482,102</p>
            <p className="text-[10px] text-slate-400">Est. completion: 4m 12s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
