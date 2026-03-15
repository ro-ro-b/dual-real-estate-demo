export const dynamic = 'force-dynamic';

/**
 * Properties API endpoint - uses DataProvider
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
import { validatePropertyData } from '@/lib/template-schema';
import { Property, MintPropertyRequest, ApiResponse, FilterOptions } from '@/types';
import * as db from '@/lib/db';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    db.initDb();

    const { searchParams } = new URL(req.url);

    const filters: FilterOptions = {
      propertyType: searchParams.get('propertyType') || undefined,
      status: searchParams.get('status') || undefined,
      orgId: searchParams.get('orgId') || undefined,
      templateId: searchParams.get('templateId') || undefined,
      city: searchParams.get('city') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : undefined,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!, 10) : undefined,
    };

    const provider = getDataProvider();
    const result = await provider.listProperties(filters);

    return NextResponse.json<ApiResponse<Property[]>>({
      success: true,
      data: result.properties,
    });
  } catch (error) {
    console.error('Failed to list properties:', error);
    return NextResponse.json<ApiResponse<Property[]>>(
      {
        success: false,
        error: 'Failed to list properties',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    db.initDb();

    const body = (await req.json()) as MintPropertyRequest;

    // Validate
    const validation = validatePropertyData(body);
    if (!validation.valid) {
      return NextResponse.json<ApiResponse<Property>>(
        {
          success: false,
          error: validation.errors.join('; '),
        },
        { status: 400 }
      );
    }

    const provider = getDataProvider();
    const result = await provider.mintProperty(body);

    return NextResponse.json<ApiResponse<{ id: string }>>(
      {
        success: true,
        data: { id: result.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to mint property:', error);
    return NextResponse.json<ApiResponse<Property>>(
      {
        success: false,
        error: 'Failed to mint property',
      },
      { status: 500 }
    );
  }
}
