export const dynamic = 'force-dynamic';

/**
 * Authentication API - session-based auth with wallet generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthSession, ApiResponse } from '@/types';
import { generateWallet } from '@/lib/wallet';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!body.email || !body.password) {
      return NextResponse.json<ApiResponse<AuthSession>>(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Accept credentials and generate session wallet
    const wallet = generateWallet();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const session: AuthSession = {
      id: `session-${Date.now()}`,
      email: body.email,
      wallet,
      orgId: 'org-1',
      orgName: 'DUAL Real Estate',
      role: 'admin',
      token: Buffer.from(`${body.email}:${wallet}`).toString('base64'),
      expiresAt: expiresAt.toISOString(),
    };

    return NextResponse.json<ApiResponse<AuthSession>>({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json<ApiResponse<AuthSession>>(
      {
        success: false,
        error: 'Authentication failed',
      },
      { status: 500 }
    );
  }
}
