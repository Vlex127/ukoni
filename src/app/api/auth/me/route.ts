import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get session token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('session_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No session token provided' },
        { status: 401 }
      );
    }

    // Validate session
    const sessionData = await validateSession(token);
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
        picture: sessionData.user.picture,
        emailVerified: sessionData.user.emailVerified,
        about: sessionData.user.about,
        phone: sessionData.user.phone,
        location: sessionData.user.location,
        website: sessionData.user.website,
        twitter: sessionData.user.twitter,
        linkedin: sessionData.user.linkedin,
        facebook: sessionData.user.facebook
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
