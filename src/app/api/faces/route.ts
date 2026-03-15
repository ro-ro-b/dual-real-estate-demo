export const dynamic = 'force-dynamic';

/**
 * Faces API endpoint for adding faces to templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { Face, ApiResponse } from '@/types';

interface FaceRequest {
  templateId: string;
  face: Face;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = (await req.json()) as FaceRequest;

    if (!body.templateId || !body.face) {
      return NextResponse.json<ApiResponse<Face>>(
        {
          success: false,
          error: 'templateId and face are required',
        },
        { status: 400 }
      );
    }

    const { templateId, face } = body;

    // Validate face URL
    try {
      new URL(face.url);
    } catch {
      return NextResponse.json<ApiResponse<Face>>(
        {
          success: false,
          error: 'Invalid face URL',
        },
        { status: 400 }
      );
    }

    // Validate face type
    if (!['image', '3d', 'web'].includes(face.type)) {
      return NextResponse.json<ApiResponse<Face>>(
        {
          success: false,
          error: 'Invalid face type. Must be "image", "3d", or "web"',
        },
        { status: 400 }
      );
    }

    // In a real implementation, would save to DUAL or database
    console.log(`Face added to template ${templateId}:`, face);

    return NextResponse.json<ApiResponse<Face>>({
      success: true,
      data: face,
    });
  } catch (error) {
    console.error('Failed to add face:', error);
    return NextResponse.json<ApiResponse<Face>>(
      {
        success: false,
        error: 'Failed to add face',
      },
      { status: 500 }
    );
  }
}
