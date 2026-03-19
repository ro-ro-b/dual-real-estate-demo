export const dynamic = 'force-dynamic';

/**
 * Organizations API endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { Organization, ApiResponse } from '@/types';

export async function GET(): Promise<Response> {
  try {
    const orgs = await dualClient.listOrganizations();
    return NextResponse.json<ApiResponse<Organization[]>>({
      success: true,
      data: orgs,
    });
  } catch (error) {
    console.error('Failed to list organizations:', error);
    return NextResponse.json<ApiResponse<Organization[]>>(
      {
        success: false,
        error: 'Failed to list organizations',
        data: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = (await req.json()) as { name: string };

    if (!body.name) {
      return NextResponse.json<ApiResponse<Organization>>(
        {
          success: false,
          error: 'Organization name is required',
        },
        { status: 400 }
      );
    }

    const org = await dualClient.createOrganization(body.name);
    return NextResponse.json<ApiResponse<Organization>>({
      success: true,
      data: org,
    });
  } catch (error) {
    console.error('Failed to create organization:', error);
    return NextResponse.json<ApiResponse<Organization>>(
      {
        success: false,
        error: 'Failed to create organization',
      },
      { status: 500 }
    );
  }
}
