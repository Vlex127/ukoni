import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Call the send-scheduled endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-scheduled`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: 'Failed to trigger scheduled emails', details: error }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error triggering scheduled emails:', error);
    return NextResponse.json({ error: 'Failed to trigger scheduled emails' }, { status: 500 });
  }
}
