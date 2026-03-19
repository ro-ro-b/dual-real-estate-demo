import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Use listProperties which applies mapGatewayToProperty
    let properties = await dualClient.listProperties();

    if (status && status !== 'all') {
      properties = properties.filter((p: any) => p.status === status);
    }

    return NextResponse.json({
      properties,
      total: properties.length,
    });
  } catch (error: any) {
    console.error('Properties fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties from DUAL network' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await dualClient.mintObject(body);
    return NextResponse.json({
      objectId: result?.objectId || '',
      templateId: result?.templateId || '',
      status: 'pending_anchoring',
      message: 'Property minted on DUAL network',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Property minting error:', error);
    return NextResponse.json(
      { error: 'Failed to mint property on DUAL network' },
      { status: 500 }
    );
  }
}
