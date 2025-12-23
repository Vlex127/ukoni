import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { emails } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// This endpoint can be called by a cron job service like Vercel Cron Jobs
export async function GET() {
  try {
    console.log('Running scheduled email check...');
    
    // Get all scheduled emails whose time has passed
    const scheduledEmails = await db
      .select()
      .from(emails)
      .where(eq(emails.status, 'scheduled'));

    const now = new Date();
    const emailsToSend = scheduledEmails.filter(email => 
      email.scheduledAt && new Date(email.scheduledAt) <= now
    );

    if (emailsToSend.length === 0) {
      return NextResponse.json({ message: 'No scheduled emails to send' });
    }

    const results = [];

    for (const email of emailsToSend) {
      try {
        // Send the email using the existing send-email logic
        const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: email.subject,
            content: email.content,
            audience: email.audience || 'all',
            updateOnly: true, // Don't create a new email record
          }),
        });

        if (sendResponse.ok) {
          const sendData = await sendResponse.json();
          
          // Update the email status to 'sent' with stats
          await db
            .update(emails)
            .set({
              status: 'sent',
              sentAt: new Date(),
              stats: sendData.stats,
              updatedAt: new Date(),
            })
            .where(eq(emails.id, email.id));

          results.push({
            id: email.id,
            subject: email.subject,
            status: 'sent',
            stats: sendData.stats,
          });
        } else {
          results.push({
            id: email.id,
            subject: email.subject,
            status: 'failed',
            error: 'Failed to send email',
          });
        }
      } catch (error) {
        console.error(`Failed to send scheduled email ${email.id}:`, error);
        results.push({
          id: email.id,
          subject: email.subject,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${emailsToSend.length} scheduled emails`,
      results,
    });
  } catch (error) {
    console.error('Failed to process scheduled emails:', error);
    return NextResponse.json({ error: 'Failed to process scheduled emails' }, { status: 500 });
  }
}
