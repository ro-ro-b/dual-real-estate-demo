import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  session: {
    userId: string;
    email: string;
    wallet: string;
    organizationId: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body: AuthRequest = await request.json();

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' } as any,
        { status: 400 }
      );
    }

    // Mock validation - accept any email/password combination
    const mockToken = Buffer.from(`${body.email}:${Date.now()}`).toString('base64');
    const mockUserId = uuidv4();
    const mockWallet = `0x${Math.random().toString(16).substr(2, 40)}`;

    const response: AuthResponse = {
      token: mockToken,
      session: {
        userId: mockUserId,
        email: body.email,
        wallet: mockWallet,
        organizationId: `org-${body.email.split('@')[0]}`,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as any,
      { status: 500 }
    );
  }
}
