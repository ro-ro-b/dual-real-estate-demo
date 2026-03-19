export const dynamic = 'force-dynamic';

/**
 * Get specific action status
 */

import { NextRequest, NextResponse } from 'next/server';
import { Action, ApiResponse } from '@/types';
import { dualClient } from '@/lib/dual-client';
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

    // Query the DUAL data provider for the action
    const action = await dualClient.getAction(actionId);

    if (!action) {
      return NextResponse.json<ApiResponse<Action>>(
        {
          success: false,
          error: 'Action not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Action>>({
      success: true,
      data: action,
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
