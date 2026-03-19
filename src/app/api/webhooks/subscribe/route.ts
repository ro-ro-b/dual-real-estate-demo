export const dynamic = 'force-dynamic';

/**
 * Webhook subscription API
 */

import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { Webhook, WebhookEventType, ApiResponse } from '@/types';

export async function GET(): Promise<Response> {
  try {
    const webhooks = await dualClient.listWebhooks();
    return NextResponse.json<ApiResponse<Webhook[]>>({
      success: true,
      data: webhooks,
    });
  } catch (error) {
    console.error('Failed to list webhooks:', error);
    return NextResponse.json<ApiResponse<Webhook[]>>(
      {
        success: false,
        error: 'Failed to list webhooks',
        data: [],
      },
      { status: 500 }
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

    const webhook = await dualClient.subscribeWebhook(body.url, body.events);
    return NextResponse.json<ApiResponse<Webhook>>({
      success: true,
      data: webhook,
    });
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
