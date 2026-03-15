/**
 * Organizations API endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { isDualConfigured } from '@/lib/env';
import { Organization, ApiResponse } from '@/types';

// Mock organizations for demo
const demoOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Acme Real Estate',
    createdAt: new Date().toISOString(),
    members: [
      { address: '0x1234567890123456789012345678901234567890', role: 'admin' },
    ],
  },
  {
    id: 'org-2',
    name: 'Global Properties LLC',
    createdAt: new Date().toISOString(),
    members: [
      { address: '0x0987654321098765432109876543210987654321', role: 'admin' },
    ],
  },
];

export async function GET(): Promise<Response> {
  try {
    if (isDualConfigured()) {
      const orgs = await dualClient.listOrganizations();
      return NextResponse.json<ApiResponse<Organization[]>>({
        success: true,
        data: orgs,
      });
    } else {
      return NextResponse.json<ApiResponse<Organization[]>>({
        success: true,
        data: demoOrganizations,
      });
    }
  } catch (error) {
    console.error('Failed to list organizations:', error);
    return NextResponse.json<ApiResponse<Organization[]>>(
      {
        success: true,
        data: demoOrganizations,
      },
      { status: 200 }
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

    if (isDualConfigured()) {
      const org = await dualClient.createOrganization(body.name);
      return NextResponse.json<ApiResponse<Organization>>({
        success: true,
        data: org,
      });
    } else {
      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        name: body.name,
        createdAt: new Date().toISOString(),
        members: [],
      };
      demoOrganizations.push(newOrg);

      return NextResponse.json<ApiResponse<Organization>>({
        success: true,
        data: newOrg,
      });
    }
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
