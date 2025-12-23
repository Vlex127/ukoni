import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { emails } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Email ID is required' }, { status: 400 });
    }

    const deletedEmail = await db
      .delete(emails)
      .where(eq(emails.id, id))
      .returning();

    if (deletedEmail.length === 0) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Email deleted successfully' });
  } catch (error) {
    console.error('Failed to delete email:', error);
    return NextResponse.json({ error: 'Failed to delete email' }, { status: 500 });
  }
}
