import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/db';
import { emails } from '@/lib/db/schema';
import { subscribers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { subject, content, audience = 'all', updateOnly = false } = await request.json();

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Get subscribers based on audience
    let subscriberList;
    if (audience === 'all') {
      subscriberList = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.status, 'active'));
    } else {
      // For other audience types, you could add more filtering logic
      subscriberList = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.status, 'active'));
    }

    if (subscriberList.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 404 }
      );
    }

    // Configure email transporter (you'll need to set up SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send emails to all subscribers
    const emailPromises = subscriberList.map(async (subscriber) => {
      try {
        await transporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@ukoni.com',
          to: subscriber.email,
          subject,
          html: content,
        });
        return { success: true, email: subscriber.email };
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        return { success: false, email: subscriber.email, error };
      }
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    // Save email to database with stats (only if not updateOnly mode)
    const emailStats = {
      sent: successful,
      failed,
      open: 0, // You'll need to implement tracking for these
      click: 0,
    };

    if (!updateOnly) {
      await db.insert(emails).values({
        subject,
        content,
        audience,
        status: 'sent',
        sentAt: new Date(),
        stats: emailStats,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Email campaign completed`,
      stats: {
        total: subscriberList.length,
        successful,
        failed,
      },
    });

  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email campaign' },
      { status: 500 }
    );
  }
}
