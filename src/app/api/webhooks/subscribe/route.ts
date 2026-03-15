export const dynamic = 'force-dynamic';

/**
 * Webhook subscription API
 */

import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { isDualConfigured } from '@/lib/env';
import { Webhook, WebhookEventType, ApiResponse } from '@/types';

// Mock webhooks for demo
const demoWebhooks: Webhook[] = [];

export async function GET(): Promise<Response> {
  try {
    if (isDualConfigured()) {
      const webhooks = await dualClient.listWebhooks();
      return NextResponse.json<ApiResponse<Webhook[]>>({
        success: true,
        data: webhooks,
      });
    } else {
      return NextResponse.json<ApiResponse<Webhook[]>>({
        success: true,
        data: demoWebhooks,
      });
    }
  } catch (error) {
    console.error('Failed to list webhooks:', error);
    return NextResponse.json<ApiResponse<Webhook[]>>(
      {
        success: true,
        data: demoWebhooks,
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = (await req.json()) as {
      url: string;
      events: WebhookEventType[];
    };

    if (!body.url || !body.events || body.events.length === 0) {
      return NextResponse.json<ApiResponse<Webhook>>(
        {
          success: false,
          error: 'URL and events array are required',
        },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json<ApiResponse<Webhook>>(
        {
          success: false,
          error: 'Invalid webhook URL',
        },
        { status: 400 }
      );
    }

    if (isDualConfigured()) {
      const webhook = await dualClient.subscribeWebhook(body.url, body.events);
      return NextResponse.json<ApiResponse<Webhook>>({
        success: true,
        data: webhook,
      });
    } else {
      const newWebhook: Webhook = {
        id: `webhook-${Date.now()}`,
        url: body.url,
        events: body.events,
        orgId: 'demo-org',
        active: true,
        createdAt: new Date().toISOString(),
      };
      demoWebhooks.push(newWebhook);

      return NextResponse.json<ApiResponse<Webhook>>({
        success: true,
        data: newWebhook,
      });
    }
  } catch (error) {
    console.error('Failed to subscribe webhook:', error);
    return NextResponse.json<ApiResponse<Webhook>>(
      {
        success: false,
        error: 'Failed to subscribe webhook',
      },
      { status: 500 }
    );
  }
}
