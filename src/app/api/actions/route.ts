import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { v4 as uuidv4 } from 'uuid';

interface ActionRequest {
  objectId: string;
  action: string;
  parameters?: Record<string, unknown>;
}

interface ActionResult {
  actionId: string;
  objectId: string;
  action: string;
  status: 'pending' | 'completed' | 'failed';
  result?: Record<string, unknown>;
  error?: string;
  timestamp: string;
}

function isDualConfigured() {
  return !!process.env.DUAL_API_KEY;
}

const ACTION_HANDLERS: Record<string, (params: Record<string, unknown>) => ActionResult> = {
  RESERVE: (params) => ({
    actionId: uuidv4(),
    objectId: params.objectId as string,
    action: 'RESERVE',
    status: 'pending',
    result: {
      reservedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      reservationId: uuidv4(),
    },
    timestamp: new Date().toISOString(),
  }),
  TRANSFER: (params) => ({
    actionId: uuidv4(),
    objectId: params.objectId as string,
    action: 'TRANSFER',
    status: 'pending',
    result: {
      from: params.from,
      to: params.to,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    },
    timestamp: new Date().toISOString(),
  }),
  VIEW_ON_CHAIN: (params) => ({
    actionId: uuidv4(),
    objectId: params.objectId as string,
    action: 'VIEW_ON_CHAIN',
    status: 'completed',
    result: {
      blockchainExplorer: 'https://example.com/object/' + params.objectId,
      status: 'anchored',
      blockNumber: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  }),
};

export async function POST(request: NextRequest): Promise<NextResponse<ActionResult>> {
  try {
    const body: ActionRequest = await request.json();

    // Validate input
    if (!body.objectId || !body.action) {
      return NextResponse.json(
        { error: 'Missing required fields: objectId, action' } as any,
        { status: 400 }
      );
    }

    // Use DUAL API if configured
    if (isDualConfigured()) {
      try {
        const result = await dualClient.executeAction({
          objectId: body.objectId,
          action: body.action,
          parameters: body.parameters,
        });

        return NextResponse.json(result, { status: 202 });
      } catch (error) {
        console.error('DUAL API action error:', error);
        // Fall back to demo action handler
      }
    }

    // Demo action handler fallback
    const handler = ACTION_HANDLERS[body.action];
    if (!handler) {
      return NextResponse.json(
        { error: `Unknown action: ${body.action}` } as any,
        { status: 400 }
      );
    }

    // Execute demo action
    const result = handler({
      objectId: body.objectId,
      ...body.parameters,
    });

    // Simulate async action completion
    setTimeout(() => {
      console.log(`Action ${result.actionId} completed:`, result);
      // This would trigger webhooks and update real-time UI
    }, 2000);

    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    console.error('Action execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute action' } as any,
      { status: 500 }
    );
  }
}
