import { NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Set admin status
    await db
      .update(users)
      .set({ admin: true })
      .where(eq(users.email, email));

    return NextResponse.json({ message: 'Admin status set successfully' });
  } catch (error) {
    console.error('Error setting admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
