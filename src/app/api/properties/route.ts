import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';

interface PropertyData {
  address: string;
  city: string;
  country: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  status: 'available' | 'reserved' | 'sold';
}

interface MintPropertyRequest extends PropertyData {}

interface MintPropertyResponse {
  objectId: string;
  templateId: string;
  status: string;
  message: string;
}

const ORG_ID = process.env.DUAL_ORG_ID || '69b935b4187e903f826bbe71';
const TEMPLATE_ID = process.env.DUAL_TEMPLATE_ID || '69b9c20c4dfa44768e8d6e60';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const response = await dualClient.listObjects({
      template_id: TEMPLATE_ID,
      organization_id: ORG_ID,
    });

    let properties = response.objects || [];

    if (status && status !== 'all') {
      properties = properties.filter((p: any) => p.status === status);
    }

    return NextResponse.json({
      properties,
      total: properties.length,
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MintPropertyRequest = await request.json();

    if (!body.address || !body.city || !body.country || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await dualClient.mintObject({
      template_id: TEMPLATE_ID,
      organization_id: ORG_ID,
      data: {
        address: body.address,
        city: body.city,
        country: body.country,
        description: body.description,
        price: body.price,
        status: body.status,
        imageUrl: body.imageUrl,
      },
    });

    const response: MintPropertyResponse = {
      objectId: result.objectId,
      templateId: result.templateId,
      status: 'pending_anchoring',
      message: 'Property minted successfully. Anchoring to blockchain...',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Property minting error:', error);
    return NextResponse.json(
      { error: 'Failed to mint property' },
      { status: 500 }
    );
  }
}
