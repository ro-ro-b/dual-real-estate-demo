import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { getAuthenticatedClient } from '@/lib/dual-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

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
    const client = await getAuthenticatedClient();
    if (!client) {
      return NextResponse.json(
        { error: 'Not authenticated. Login via admin to mint.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const templateId = process.env.DUAL_TEMPLATE_ID || '';

    // Structure into metadata + custom
    const mintData: Record<string, any> = {};
    if (body.address || body.description) {
      mintData.metadata = {
        ...(body.address ? { name: body.address } : {}),
        ...(body.description ? { description: body.description } : {}),
      };
    }
    const { description: _d, ...customFields } = body;
    if (Object.keys(customFields).length > 0) {
      mintData.custom = customFields;
    }

    const result = await client.ebus.execute({
      action: {
        mint: {
          template_id: templateId,
          num: 1,
          ...(Object.keys(mintData).length > 0 ? { data: mintData } : {}),
        },
      },
    });

    const objectIds = result.steps?.[0]?.output?.ids || [];

    return NextResponse.json({
      success: true,
      objectId: objectIds[0] || '',
      actionId: result.action_id,
      objectIds,
      templateId,
      status: 'pending_anchoring',
      message: 'Property minted on DUAL network',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Property minting error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to mint property on DUAL network' },
      { status: 500 }
    );
  }
}
