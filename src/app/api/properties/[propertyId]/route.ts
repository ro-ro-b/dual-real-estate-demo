export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';

export async function GET(
  _req: NextRequest,
  { params }: { params: { propertyId: string } }
): Promise<Response> {
  try {
    const { propertyId } = params;
    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    const property = await dualClient.getProperty(propertyId);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error: any) {
    console.error('Failed to get property:', error);
    return NextResponse.json({ error: 'Failed to get property' }, { status: 500 });
  }
}
