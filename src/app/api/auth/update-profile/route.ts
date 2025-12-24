import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get update data from request body
    const body = await request.json();
    const { name, about, phone, location, website, twitter, linkedin, facebook } = body;

    // Update user profile
    const updatedUser = await db
      .update(users)
      .set({
        name,
        about,
        phone,
        location,
        website,
        twitter,
        linkedin,
        facebook,
        updatedAt: new Date()
      })
      .where(eq(users.id, session.user.id))
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
