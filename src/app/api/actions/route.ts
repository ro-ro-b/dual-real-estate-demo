import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';

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

export async function POST(request: NextRequest): Promise<NextResponse<ActionResult>> {
  try {
    const body: ActionRequest = await request.json();

    if (!body.objectId || !body.action) {
      return NextResponse.json(
        { error: 'Missing required fields: objectId, action' } as any,
        { status: 400 }
      );
    }

    const result = await dualClient.executeAction(
      body.objectId,
      body.action,
      '',
      body.parameters || {}
    );

    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    console.error('Action execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute action' } as any,
      { status: 500 }
    );
  }
}
