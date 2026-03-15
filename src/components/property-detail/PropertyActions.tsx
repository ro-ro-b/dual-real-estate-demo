'use client';

import { useState } from 'react';
import { BookMarked, Send, Eye } from 'lucide-react';

interface PropertyActionsProps {
  propertyId: string;
}

export function PropertyActions({ propertyId }: PropertyActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectId: propertyId,
          action,
        }),
      });

      const result = await response.json();
      alert(`${action} action initiated. Result:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Error executing action:', error);
      alert('Error executing action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Actions</h2>

      <div className="grid gap-3">
        <button
          onClick={() => handleAction('RESERVE')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <BookMarked className="w-4 h-4" />
          Reserve Property
        </button>

        <button
          onClick={() => handleAction('TRANSFER')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          Transfer Ownership
        </button>

        <button
          onClick={() => handleAction('VIEW_ON_CHAIN')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          <Eye className="w-4 h-4" />
          View On-Chain
        </button>
      </div>
    </div>
  );
}
