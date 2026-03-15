/**
 * React hook for DataProvider access with state management
 */

'use client';

import { useState, useCallback } from 'react';
import {
  Property,
  FilterOptions,
  MintPropertyRequest,
  ActionRequest,
  DashboardStats,
} from '@/types';

interface UseDataProviderResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  stats: DashboardStats | null;
  fetchProperties: (filters: FilterOptions) => Promise<void>;
  mintProperty: (data: MintPropertyRequest) => Promise<string | null>;
  executeAction: (data: ActionRequest) => Promise<string | null>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export function useDataProvider(): UseDataProviderResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProperties = useCallback(async (filters: FilterOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties?' + new URLSearchParams(
        Object.entries(filters)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ));

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      const data = (await response.json()) as { success: boolean; data: Property[] };
      if (data.success) {
        setProperties(data.data);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const mintProperty = useCallback(async (data: MintPropertyRequest): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to mint property: ${response.statusText}`);
      }

      const result = (await response.json()) as {
        success: boolean;
        data?: { id: string };
      };
      if (result.success && result.data) {
        return result.data.id;
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeAction = useCallback(async (data: ActionRequest): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to execute action: ${response.statusText}`);
      }

      const result = (await response.json()) as {
        success: boolean;
        data?: { id: string };
      };
      if (result.success && result.data) {
        return result.data.id;
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stats');

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        success: boolean;
        data: DashboardStats;
      };
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    properties,
    loading,
    error,
    stats,
    fetchProperties,
    mintProperty,
    executeAction,
    fetchStats,
    clearError,
  };
}
