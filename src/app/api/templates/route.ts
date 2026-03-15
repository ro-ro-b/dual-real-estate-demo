export const dynamic = 'force-dynamic';

/**
 * Templates API endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { isDualConfigured } from '@/lib/env';
import { Template, ApiResponse } from '@/types';
import { propertyToTemplatePayload } from '@/lib/template-schema';

// Mock templates for demo
const demoTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'real-estate::property::v1',
    version: '1.0.0',
    orgId: 'org-1',
    schema: {},
    properties: [
      { name: 'address', type: 'string', required: true },
      { name: 'city', type: 'string', required: true },
      { name: 'propertyType', type: 'string', required: true },
    ],
    actions: [
      { name: 'RESERVE', description: 'Reserve property', parameters: {}, validStates: ['anchored'] },
      { name: 'TRANSFER', description: 'Transfer ownership', parameters: {}, validStates: ['anchored'] },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(): Promise<Response> {
  try {
    if (isDualConfigured()) {
      const templates = await dualClient.listTemplates();
      return NextResponse.json<ApiResponse<Template[]>>({
        success: true,
        data: templates,
      });
    } else {
      return NextResponse.json<ApiResponse<Template[]>>({
        success: true,
        data: demoTemplates,
      });
    }
  } catch (error) {
    console.error('Failed to list templates:', error);
    return NextResponse.json<ApiResponse<Template[]>>(
      {
        success: true,
        data: demoTemplates,
      },
      { status: 200 }
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

    if (isDualConfigured()) {
      const template = await dualClient.createTemplate(body.name, '1.0.0', body.schema);
      return NextResponse.json<ApiResponse<Template>>({
        success: true,
        data: template,
      });
    } else {
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: body.name,
        version: '1.0.0',
        orgId: 'demo-org',
        schema: body.schema,
        properties: [],
        actions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoTemplates.push(newTemplate);

      return NextResponse.json<ApiResponse<Template>>({
        success: true,
        data: newTemplate,
      });
    }
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
