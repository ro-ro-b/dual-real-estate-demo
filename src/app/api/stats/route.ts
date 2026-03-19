export const dynamic = 'force-dynamic';

/**
 * Dashboard stats endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
import { DashboardStats, ApiResponse } from '@/types';

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const provider = getDataProvider();
    const baseStats = await provider.getDashboardStats();

    // Ensure all required fields exist with defaults
    const stats: DashboardStats = {
      totalProperties: baseStats.totalProperties || 0,
      totalActions: baseStats.totalActions || 0,
      anchoredCount: baseStats.anchoredCount || 0,
      failedCount: baseStats.failedCount || 0,
      pendingCount: baseStats.pendingCount || 0,
      organizations: baseStats.organizations || 0,
      templates: baseStats.templates || 0,
      available: 0,
      reserved: 0,
      sold: 0,
      totalValue: 0,
      totalValueChange: '0%',
    };

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
