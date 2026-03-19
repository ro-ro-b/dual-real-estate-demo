export const dynamic = 'force-dynamic';

/**
 * Get specific action status
 */

import { NextRequest, NextResponse } from 'next/server';
import { Action, ApiResponse } from '@/types';
import * as db from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { actionId: string } }
): Promise<Response> {
  try {
    db.initDb();

    const { actionId } = params;

    if (!actionId) {
      return NextResponse.json<ApiResponse<Action>>(
        {
          success: false,
          error: 'actionId is required',
        },
        { status: 400 }
      );
    }

    // For now, return stub - in real app would query action by ID from provider
    const mockAction: Action = {
      id: actionId,
      objectId: 'unknown',
      type: 'RESERVE',
      actor: '',
      parameters: {},
      status: 'pending',
      description: '',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<Action>>({
      success: true,
      data: mockAction,
    });
  } catch (error) {
    console.error('Failed to get action:', error);
    return NextResponse.json<ApiResponse<Action>>(
      {
        success: false,
        error: 'Failed to get action',
      },
      { status: 500 }
    );
  }
}
