import { NextRequest, NextResponse } from 'next/server';
import { demoProperties, PropertyData } from '@/lib/demo-data';
import { v4 as uuidv4 } from 'uuid';

interface MintPropertyRequest extends PropertyData {
  imageUrl: string;
}

interface MintPropertyResponse {
  objectId: string;
  templateId: string;
  status: string;
  message: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let filtered = [...demoProperties];

    // Filter by status
    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.propertyData.status === status);
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

    // Mock object ID
    const objectId = uuidv4();
    const templateId = 'template-001';

    // In a real implementation, this would:
    // 1. Call DUAL API to create the object
    // 2. Store property metadata in database
    // 3. Queue anchoring to blockchain
    // 4. Return on-chain transaction details

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
