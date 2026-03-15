import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface WebhookEvent {
  id: string;
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
}

interface WebhookPayload {
  event: WebhookEvent;
  signature: string;
}

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'demo-secret-key';

function validateSignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(payload);
  const computed = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(signature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: WebhookPayload = await request.json();
    const payload = JSON.stringify(body.event);

    // In production, validate the signature
    // if (!validateSignature(payload, body.signature)) {
    //   return NextResponse.json(
    //     { error: 'Invalid signature' },
    //     { status: 401 }
    //   );
    // }

    // Log webhook event
    console.log('Webhook received:', {
      id: body.event.id,
      type: body.event.type,
      timestamp: body.event.timestamp,
      data: body.event.data,
    });

    // Handle different event types
    switch (body.event.type) {
      case 'property.anchored':
        handlePropertyAnchored(body.event);
        break;
      case 'property.anchoring_failed':
        handleAnchoringFailed(body.event);
        break;
      case 'action.completed':
        handleActionCompleted(body.event);
        break;
      case 'action.failed':
        handleActionFailed(body.event);
        break;
      default:
        console.log('Unknown event type:', body.event.type);
    }

    return NextResponse.json({
      received: true,
      eventId: body.event.id,
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

function handlePropertyAnchored(event: WebhookEvent) {
  console.log('Property anchored:', event.data);
  // Update database with on-chain status
  // Send notification to user
  // Update UI in real-time
}

function handleAnchoringFailed(event: WebhookEvent) {
  console.log('Property anchoring failed:', event.data);
  // Update database with failed status
  // Notify user of failure
  // Queue retry
}

function handleActionCompleted(event: WebhookEvent) {
  console.log('Action completed:', event.data);
  // Update database with action result
  // Update property state
}

function handleActionFailed(event: WebhookEvent) {
  console.log('Action failed:', event.data);
  // Update database with failure
  // Notify user
  // Queue retry
}
