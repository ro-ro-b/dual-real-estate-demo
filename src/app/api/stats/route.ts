/**
 * Dashboard stats endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
import { DashboardStats, ApiResponse } from '@/types';

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const provider = getDataProvider();
    const stats = await provider.getDashboardStats();

    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    return NextResponse.json<ApiResponse<DashboardStats>>(
      {
        success: false,
        error: 'Failed to get stats',
      },
      { status: 500 }
    );
  }
}
