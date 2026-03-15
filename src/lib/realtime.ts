/**
 * Server-Sent Events (SSE) real-time update manager
 */

import { EventEmitter } from 'events';

interface ClientStream {
  controller: ReadableStreamDefaultController<Uint8Array>;
  clientId: string;
}

export class SSEManager extends EventEmitter {
  private clients: Map<string, ClientStream> = new Map();

  addClient(clientId: string, controller: ReadableStreamDefaultController<Uint8Array>): void {
    this.clients.set(clientId, { clientId, controller });
    console.log(`SSE client connected: ${clientId}. Total clients: ${this.clients.size}`);
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
    console.log(`SSE client disconnected: ${clientId}. Total clients: ${this.clients.size}`);
  }

  broadcast(event: string, data: unknown): void {
    const message = this.formatSSEMessage(event, data);
    const clients = Array.from(this.clients.values());

    console.log(`Broadcasting event "${event}" to ${clients.length} clients`);

    for (const client of clients) {
      this.sendToController(client.controller, message);
    }
  }

  sendToClient(clientId: string, event: string, data: unknown): void {
    const client = this.clients.get(clientId);
    if (!client) {
      console.warn(`Client not found: ${clientId}`);
      return;
    }

    const message = this.formatSSEMessage(event, data);
    this.sendToController(client.controller, message);
  }

  private formatSSEMessage(event: string, data: unknown): string {
    const jsonData = JSON.stringify(data);
    return `event: ${event}\ndata: ${jsonData}\n\n`;
  }

  private sendToController(
    controller: ReadableStreamDefaultController<Uint8Array>,
    message: string
  ): void {
    try {
      const encoded = new TextEncoder().encode(message);
      controller.enqueue(encoded);
    } catch (error) {
      console.error('Error sending SSE message:', error);
    }
  }

  sendKeepAlive(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const encoded = new TextEncoder().encode(': keepalive\n\n');
      client.controller.enqueue(encoded);
    } catch (error) {
      console.error('Error sending keepalive:', error);
      this.removeClient(clientId);
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

// Export singleton instance
export const sseManager = new SSEManager();
