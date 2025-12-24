import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { emails } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET - Retrieve all emails
export async function GET() {
  try {
    const emailList = await db
      .select()
      .from(emails)
      .orderBy(desc(emails.createdAt));
    
    return NextResponse.json(emailList);
  } catch (error) {
    console.error('Failed to fetch emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

// POST - Save new email
export async function POST(request: NextRequest) {
  try {
    const { subject, content, audience, status } = await request.json();

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
    }

    const newEmail = await db
      .insert(emails)
      .values({
        subject,
        content,
        audience: audience || 'all',
        status: status || 'draft'
      })
      .returning();

    return NextResponse.json(newEmail[0]);
  } catch (error) {
    console.error('Failed to save email:', error);
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
  }
}

// PUT - Update existing email
export async function PUT(request: NextRequest) {
  try {
    const { id, subject, content, audience, status, stats } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Email ID is required' }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (subject !== undefined) updateData.subject = subject;
    if (content !== undefined) updateData.content = content;
    if (audience !== undefined) updateData.audience = audience;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'sent') {
        updateData.sentAt = new Date();
      }
    }
    if (stats !== undefined) updateData.stats = stats;

    const updatedEmail = await db
      .update(emails)
      .set(updateData)
      .where(eq(emails.id, id))
      .returning();

    if (updatedEmail.length === 0) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEmail[0]);
  } catch (error) {
    console.error('Failed to update email:', error);
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
  }
}
