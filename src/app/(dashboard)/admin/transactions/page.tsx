'use client';

import { useState } from 'react';
import { demoActions, demoProperties } from '@/lib/demo-data';

export default function TransactionsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const filteredActions = demoActions.filter((action) => {
    if (statusFilter === 'all') return true;
    return action.status === statusFilter;
  });

  const sortedActions = [...filteredActions].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'PROPERTY_CREATED':
        return 'token';
      case 'PROPERTY_ANCHORED':
        return 'verified';
      case 'PROPERTY_RESERVED':
        return 'update';
      case 'PROPERTY_ANCHORING':
        return 'local_offer';
      default:
        return 'circle';
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'PROPERTY_CREATED':
        return 'text-[#14b8a7]';
      case 'PROPERTY_ANCHORED':
        return 'text-blue-500';
      case 'PROPERTY_RESERVED':
        return 'text-amber-500';
      case 'PROPERTY_ANCHORING':
        return 'text-[#14b8a7]';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusColor = (status: 'completed' | 'pending' | 'failed') => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'failed':
        return 'bg-rose-100 text-rose-700';
    }
  };

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  return (
    <div>
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#14b8a7]/20 rounded-xl text-[#14b8a7]">
            <span className="material-symbols-outlined text-3xl">receipt_long</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transactions & Activity</h1>
            <p className="text-slate-500 text-sm">All property actions and on-chain transactions.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {(['all', 'completed', 'pending', 'failed'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              statusFilter === filter
                ? 'bg-[#14b8a7] text-white shadow-lg shadow-[#14b8a7]/20'
                : 'bg-white border border-[#14b8a7]/20 text-slate-900 hover:border-[#14b8a7]/40'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-[#14b8a7]/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f6f8f8] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Property</th>
                <th className="px-5 py-4">Actor</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14b8a7]/5">
              {sortedActions.map((action) => {
                const property = demoProperties.find((p) => p.id === action.objectId);
                const actionDate = new Date(action.timestamp);
                const now = new Date();
                const timeDiff = now.getTime() - actionDate.getTime();
                const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutesAgo = Math.floor(timeDiff / (1000 * 60));

                let timeLabel = '';
                if (minutesAgo < 60) {
                  timeLabel = minutesAgo === 0 ? 'just now' : `${minutesAgo}m ago`;
                } else if (hoursAgo < 24) {
                  timeLabel = `${hoursAgo}h ago`;
                } else if (daysAgo === 0) {
                  timeLabel = 'Today';
                } else if (daysAgo === 1) {
                  timeLabel = 'Yesterday';
                } else {
                  timeLabel = `${daysAgo}d ago`;
                }

                return (
                  <tr key={action.id} className="hover:bg-[#14b8a7]/5 transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-500 font-mono">{timeLabel}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined ${getActionColor(action.type)} text-[18px]`}>
                          {getActionIcon(action.type)}
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {action.type.replace('PROPERTY_', '').replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {property ? property.propertyData.address.split(',')[0] : 'N/A'}
                    </td>
                    <td className="px-5 py-4 text-sm font-mono text-slate-500">
                      {action.actor === 'system' ? (
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">System</span>
                      ) : (
                        truncateWallet(action.actor)
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(
                          action.status
                        )}`}
                      >
                        {action.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sortedActions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-sm">No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
