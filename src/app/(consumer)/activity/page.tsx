'use client';

import { useState } from 'react';
import { demoActions, demoProperties } from '@/lib/demo-data';

type FilterActivityType = 'all' | 'purchases' | 'transfers' | 'verifications';

export default function ActivityPage() {
  const [filter, setFilter] = useState<FilterActivityType>('all');

  const getPropertyAddressByObjectId = (objectId: string) => {
    const property = demoProperties.find((p) => p.id === objectId);
    return property?.propertyData.address || 'Unknown property';
  };

  const filteredActions = demoActions.filter((action) => {
    if (filter === 'all') return true;
    if (filter === 'purchases') return action.type.toLowerCase() === 'listing';
    if (filter === 'transfers') return action.type.toLowerCase() === 'transfer';
    if (filter === 'verifications') return action.type.toLowerCase() === 'verified';
    return true;
  });

  const sortedActions = [...filteredActions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'verified':
        return 'verified_user';
      case 'transfer':
        return 'send';
      case 'listing':
        return 'home';
      case 'reserve':
        return 'event_available';
      default:
        return 'info';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'verified':
        return 'bg-emerald-100 text-emerald-600';
      case 'transfer':
        return 'bg-blue-100 text-blue-600';
      case 'listing':
        return 'bg-teal-100 text-teal-600';
      case 'reserve':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Activity</h1>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'purchases', 'transfers', 'verifications'] as FilterActivityType[]).map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Activity Items */}
      <div className="space-y-3 pb-6">
        {sortedActions.length > 0 ? (
          sortedActions.map((action, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(action.type)}`}>
                  <span className="material-symbols-outlined text-base">
                    {getActivityIcon(action.type)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {action.description}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${getStatusBadge(
                        action.status
                      )}`}
                    >
                      {action.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">
                      {new Date(action.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {getPropertyAddressByObjectId(action.objectId)}
                    </p>
                  </div>
                </div>

                {/* Chevron */}
                <span className="flex-shrink-0 text-slate-300 material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No activity found</p>
          </div>
        )}
      </div>
    </div>
  );
}
