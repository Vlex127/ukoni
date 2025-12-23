import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
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

    // Get update data from request body
    const body = await request.json();
    const { name, about, phone, location, website, twitter, linkedin, facebook } = body;

    // Update user profile
    const updatedUser = await db
      .update(users)
      .set({
        name: name || sessionData.user.name,
        about: about || sessionData.user.about,
        phone: phone || sessionData.user.phone,
        location: location || sessionData.user.location,
        website: website || sessionData.user.website,
        twitter: twitter || sessionData.user.twitter,
        linkedin: linkedin || sessionData.user.linkedin,
        facebook: facebook || sessionData.user.facebook,
        updatedAt: new Date()
      })
      .where(eq(users.id, sessionData.user.id))
      .returning();

    return NextResponse.json({
      user: {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        name: updatedUser[0].name,
        picture: updatedUser[0].picture,
        emailVerified: updatedUser[0].emailVerified,
        about: updatedUser[0].about,
        phone: updatedUser[0].phone,
        location: updatedUser[0].location,
        website: updatedUser[0].website,
        twitter: updatedUser[0].twitter,
        linkedin: updatedUser[0].linkedin,
        facebook: updatedUser[0].facebook
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
