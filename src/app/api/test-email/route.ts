import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/app/actions/sendEmail';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to: email,
      subject: 'Test Email from Ukoni',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Test Email</h2>
          <p>This is a test email from your Ukoni application!</p>
          <p>If you received this, your email service is working correctly.</p>
          <br>
          <p>Best regards,<br>Ukoni Team</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result
    });

  } catch (error) {
    console.error('Test email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to send test email', details: errorMessage },
      { status: 500 }
    );
  }
}