export const dynamic = 'force-dynamic';

/**
 * Templates API endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { isDualConfigured } from '@/lib/env';
import { Template, ApiResponse } from '@/types';
import { propertyToTemplatePayload } from '@/lib/template-schema';

export async function GET(): Promise<Response> {
  try {
    const templates = await dualClient.listTemplates();
    return NextResponse.json<ApiResponse<Template[]>>({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Failed to list templates:', error);
    return NextResponse.json<ApiResponse<Template[]>>(
      {
        success: false,
        error: 'Failed to list templates',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = (await req.json()) as { name: string; schema: Record<string, unknown> };

    if (!body.name || !body.schema) {
      return NextResponse.json<ApiResponse<Template>>(
        {
          success: false,
          error: 'Template name and schema are required',
        },
        { status: 400 }
      );
    }

    const template = await dualClient.createTemplate(body.name, '1.0.0', body.schema);
    return NextResponse.json<ApiResponse<Template>>({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Failed to create template:', error);
    return NextResponse.json<ApiResponse<Template>>(
      {
        success: false,
        error: 'Failed to create template',
      },
      { status: 500 }
    );
  }
}
