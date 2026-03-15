/**
 * Actions API endpoint - uses DataProvider and validates with action-types
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
import { validateAction, getAvailableActions } from '@/lib/action-types';
import { ActionRequest, Action, ApiResponse } from '@/types';
import { sseManager } from '@/lib/realtime';
import * as db from '@/lib/db';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    db.initDb();

    const { searchParams } = new URL(req.url);
    const objectId = searchParams.get('objectId');

    if (!objectId) {
      return NextResponse.json<ApiResponse<Action[]>>(
        {
          success: false,
          error: 'objectId is required',
        },
        { status: 400 }
      );
    }

    const provider = getDataProvider();
    const actions = await provider.getPropertyActions(objectId);

    return NextResponse.json<ApiResponse<Action[]>>({
      success: true,
      data: actions,
    });
  } catch (error) {
    console.error('Failed to get actions:', error);
    return NextResponse.json<ApiResponse<Action[]>>(
      {
        success: false,
        error: 'Failed to get actions',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    db.initDb();

    const body = (await req.json()) as ActionRequest;

    // Validate required fields
    if (!body.objectId || !body.type || !body.actor) {
      return NextResponse.json<ApiResponse<Action>>(
        {
          success: false,
          error: 'objectId, type, and actor are required',
        },
        { status: 400 }
      );
    }

    // Validate action parameters
    const validation = validateAction(body.type, body.parameters || {});
    if (!validation.valid) {
      return NextResponse.json<ApiResponse<Action>>(
        {
          success: false,
          error: validation.errors.join('; '),
        },
        { status: 400 }
      );
    }

    // Check if action is available for property state
    const provider = getDataProvider();
    const property = await provider.getProperty(body.objectId);

    if (!property) {
      return NextResponse.json<ApiResponse<Action>>(
        {
          success: false,
          error: 'Property not found',
        },
        { status: 404 }
      );
    }

    const availableActions = getAvailableActions(property);
    if (!availableActions.includes(body.type as any)) {
      return NextResponse.json<ApiResponse<Action>>(
        {
          success: false,
          error: `Action ${body.type} is not available for property status ${property.status}`,
        },
        { status: 400 }
      );
    }

    // Execute action
    const result = await provider.executeAction(body);

    // Broadcast via SSE
    sseManager.broadcast('action-created', {
      objectId: body.objectId,
      actionId: result.id,
      type: body.type,
    });

    return NextResponse.json<ApiResponse<{ id: string }>>(
      {
        success: true,
        data: { id: result.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to execute action:', error);
    return NextResponse.json<ApiResponse<Action>>(
      {
        success: false,
        error: 'Failed to execute action',
      },
      { status: 500 }
    );
  }
}
