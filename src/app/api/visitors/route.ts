import { NextResponse } from 'next/server';

// Helper function to get date range for the last 30 days
function getDateRange() {
  const today = new Date();
  const currentPeriodEnd = new Date(today);
  const currentPeriodStart = new Date(today);
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 29); // Last 30 days including today
  
  const previousPeriodEnd = new Date(currentPeriodStart);
  previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
  const previousPeriodStart = new Date(previousPeriodEnd);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 29);
  
  return { currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd };
}

// Helper function to generate date strings in YYYY-MM-DD format
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/v1/analytics/visitors`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error from backend:', error);
      throw new Error('Failed to fetch visitor data');
    }

    const data = await response.json();
    
    // Transform the data to match the expected format
    const transformData = (periodData: any[]) => {
      return periodData.map(item => ({
        date: item.date,
        count: item.count
      }));
    };

    return NextResponse.json({
      currentPeriod: transformData(data.current_period || []),
      previousPeriod: transformData(data.previous_period || [])
    });

  } catch (error) {
    console.error('Error in visitors API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { url, userAgent, ipAddress, referrer } = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await fetch(`${apiUrl}/api/v1/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        user_agent: userAgent,
        ip_address: ipAddress,
        referrer
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to track page view: ${error}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to track page view' },
      { status: 500 }
    );
  }
}