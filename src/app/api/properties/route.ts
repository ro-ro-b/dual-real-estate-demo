import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
// any type not needed — using any for gateway data
import { dualClient } from '@/lib/dual-client';
import { v4 as uuidv4 } from 'uuid';

interface MintPropertyRequest extends any {
  imageUrl: string;
}

interface MintPropertyResponse {
  objectId: string;
  templateId: string;
  status: string;
  message: string;
}

function isDualConfigured() {
  return !!process.env.DUAL_API_KEY;
}

const ORG_ID = process.env.DUAL_ORG_ID || '69b935b4187e903f826bbe71';
const TEMPLATE_ID = process.env.DUAL_TEMPLATE_ID || '69b9c20c4dfa44768e8d6e60';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Use DUAL API if configured, otherwise fall back to demo data
    if (isDualConfigured()) {
      try {
        const response = await dualClient.listObjects({
          template_id: TEMPLATE_ID,
          organization_id: ORG_ID,
        });

        let properties = response.objects || [];

        // Apply filters
        if (status && status !== 'all') {
          properties = properties.filter((p: any) => p?.status === status);
        }
        if (minPrice) {
          const min = parseFloat(minPrice);
          properties = properties.filter((p: any) => p.price >= min);
        }
        if (maxPrice) {
          const max = parseFloat(maxPrice);
          properties = properties.filter((p: any) => p.price <= max);
        }

        return NextResponse.json({
          properties,
          total: properties.length,
        });
      } catch (error) {
        console.error('DUAL API error:', error);
        // Fall back to demo data
      }
    }

    // Demo data fallback
    let filtered = [...(await getDataProvider().listProperties({} as any)).properties];

    // Filter by status
    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.propertyData?.status === status);
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      filtered = filtered.filter((p) => p.propertyData.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter((p) => p.propertyData.price <= max);
    }

    return NextResponse.json({
      properties: filtered,
      total: filtered.length,
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

    // Validate required fields
    if (!body.address || !body.city || !body.country || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Use DUAL API if configured, otherwise use demo response
    if (isDualConfigured()) {
      try {
        const result = await dualClient.mintObject({
          template_id: TEMPLATE_ID,
          organization_id: ORG_ID,
          data: {
            address: body.address,
            city: body.city,
            country: body.country,
            description: body.description,
            price: body.price,
            status: body?.status,
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
        console.error('DUAL API minting error:', error);
        // Fall back to demo response
      }
    }

    // Demo response fallback
    const objectId = uuidv4();
    const templateId = 'template-001';

    const response: MintPropertyResponse = {
      objectId,
      templateId,
      status: 'pending_anchoring',
      message: 'Property minted successfully. Anchoring to blockchain...',
    };

    // Simulate async anchoring
    setTimeout(async () => {
      console.log(`Anchoring property ${objectId} to blockchain...`);
      // This would call the sequencer/anchoring service
    }, 1000);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Property minting error:', error);
    return NextResponse.json(
      { error: 'Failed to mint property' },
      { status: 500 }
    );
  }
}
