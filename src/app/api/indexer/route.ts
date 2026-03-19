export const dynamic = 'force-dynamic';

/**
 * Public indexer endpoint - no auth required
 * Queries DUAL indexer or falls back to demo data
 */

import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';
import { isDualConfigured } from '@/lib/env';
import { PaginatedResponse, DualObject } from '@/types';
import { indexerCache } from '@/lib/indexer-cache';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get('template_id') || '';
    const orgId = searchParams.get('org_id') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('page_size') || '20', 10);

    // Check cache
    const cacheKey = indexerCache.getCacheKey({ templateId, orgId, status, page, pageSize });
    const cached = indexerCache.get<PaginatedResponse<DualObject>>(cacheKey);

    if (cached) {
      return NextResponse.json(cached);
    }

    const filters: Record<string, unknown> = {};
    if (templateId) filters.templateId = templateId;
    if (orgId) filters.orgId = orgId;
    if (status) filters.status = status;

    const objects: DualObject[] = await dualClient.listProperties(filters);

    const total = objects.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = objects.slice(start, end);

    const response: PaginatedResponse<DualObject> = {
      success: true,
      data: paginated,
      total,
      page,
      pageSize,
      hasMore: end < total,
    };

    // Cache result
    indexerCache.set(cacheKey, response, 60);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Indexer error:', error);
    return NextResponse.json<PaginatedResponse<DualObject>>(
      {
        success: false,
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
        hasMore: false,
        error: 'Failed to query indexer',
      } as any,
      { status: 500 }
    );
  }
}
