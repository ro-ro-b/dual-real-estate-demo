/**
 * Webhook event receiving and processing endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '@/lib/env';
import { WebhookEvent, ApiResponse } from '@/types';
import { processWebhookEvent } from '@/lib/webhook-handlers';
import { sseManager } from '@/lib/realtime';
import * as db from '@/lib/db';

import crypto from 'crypto';

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    db.initDb();

    const config = getConfig();
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');

    // Verify signature if configured
    if (config.isDualConfigured && signature) {
      try {
        if (!verifyWebhookSignature(rawBody, signature, config.dualWebhookSecret)) {
          return NextResponse.json<ApiResponse<WebhookEvent>>(
            {
              success: false,
              error: 'Invalid webhook signature',
            },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('Signature verification error:', error);
      }
    }

    const event = JSON.parse(rawBody) as WebhookEvent;

    // Validate event
    if (!event.id || !event.type || !event.objectId) {
      return NextResponse.json<ApiResponse<WebhookEvent>>(
        {
          success: false,
          error: 'Invalid webhook event: missing required fields',
        },
        { status: 400 }
      );
    }

    // Save to DB
    db.saveWebhookEvent(event.id, event.type, event.objectId, event.data, false);

    // Process event
    await processWebhookEvent(event);

    // Broadcast to connected SSE clients
    sseManager.broadcast('webhook-event', {
      type: event.type,
      objectId: event.objectId,
    });

    return NextResponse.json<ApiResponse<WebhookEvent>>({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json<ApiResponse<WebhookEvent>>(
      {
        success: false,
        error: 'Failed to process webhook',
      },
      { status: 500 }
    );
  }
}
