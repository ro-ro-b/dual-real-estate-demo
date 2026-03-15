export const dynamic = 'force-dynamic';

/**
 * Server-Sent Events (SSE) endpoint for real-time updates
 */

import { sseManager } from '@/lib/realtime';

export function GET(): Response {
  const clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const stream = new ReadableStream({
    start(controller) {
      // Register client
      sseManager.addClient(clientId, controller);

      // Send initial connection message
      const initialMessage = `data: {"status": "connected", "clientId": "${clientId}"}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialMessage));

      // Set up keepalive interval
      const keepaliveInterval = setInterval(() => {
        sseManager.sendKeepAlive(clientId);
      }, 30000); // 30 seconds

      // Cleanup on close
      const cleanup = () => {
        clearInterval(keepaliveInterval);
        sseManager.removeClient(clientId);
      };

      // Listen for stream close
      (controller as any).signal?.addEventListener('abort', cleanup);

      // Fallback cleanup after connection timeout
      setTimeout(() => {
        cleanup();
      }, 24 * 60 * 60 * 1000); // 24 hours
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
