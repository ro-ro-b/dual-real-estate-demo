/**
 * Hook for tracking action completion with polling
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ActionStatus } from '@/types';

interface UseActionStatusResult {
  status: ActionStatus;
  result: Record<string, unknown> | null;
  error: string | null;
  isPolling: boolean;
}

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_RETRIES = 30; // 60 seconds max

export function useActionStatus(actionId: string | null): UseActionStatusResult {
  const [status, setStatus] = useState<ActionStatus>('pending');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkStatus = useCallback(async () => {
    if (!actionId) return;

    try {
      const response = await fetch(`/api/actions/${actionId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch action status: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        success: boolean;
        data?: { status: ActionStatus; result?: Record<string, unknown> };
      };

      if (data.success && data.data) {
        setStatus(data.data.status);
        if (data.data.result) {
          setResult(data.data.result);
        }

        // Stop polling when done
        if (data.data.status === 'completed' || data.data.status === 'failed') {
          setIsPolling(false);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);

      // Stop polling on error
      setIsPolling(false);
    }
  }, [actionId]);

  useEffect(() => {
    if (!actionId) return;

    setIsPolling(true);
    setStatus('pending');
    setResult(null);
    setError(null);
    setRetryCount(0);

    // Initial check
    checkStatus();

    // Set up polling interval
    const interval = setInterval(() => {
      setRetryCount(prev => {
        const next = prev + 1;
        if (next >= MAX_RETRIES) {
          setIsPolling(false);
          return next;
        }
        checkStatus();
        return next;
      });
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [actionId, checkStatus]);

  return {
    status,
    result,
    error,
    isPolling,
  };
}
