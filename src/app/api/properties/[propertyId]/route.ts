export const dynamic = 'force-dynamic';

/**
 * Get specific property by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
import { Property, ApiResponse } from '@/types';
import * as db from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { propertyId: string } }
): Promise<Response> {
  try {
    db.initDb();

    const { propertyId } = params;

    if (!propertyId) {
      return NextResponse.json<ApiResponse<Property>>(
        {
          success: false,
          error: 'propertyId is required',
        },
        { status: 400 }
      );
    }

    const provider = getDataProvider();
    const property = await provider.getProperty(propertyId);

    if (!property) {
      return NextResponse.json<ApiResponse<Property>>(
        {
          success: false,
          error: 'Property not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Property>>({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Failed to get property:', error);
    return NextResponse.json<ApiResponse<Property>>(
      {
        success: false,
        error: 'Failed to get property',
      },
      { status: 500 }
    );
  }
}
