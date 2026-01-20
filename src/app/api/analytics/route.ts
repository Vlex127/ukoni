import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const analyticsSchema = z.object({
  event: z.string(),
  postId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get('event')
    const postId = searchParams.get('postId')

    const where: any = {}

    if (eventType) where.event = eventType
    if (postId) where.postId = postId

    // Calculate date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    // Fetch analytics for today and yesterday
    const analytics = await prisma.analytics.findMany({
      where: {
        createdAt: {
          gte: startOfYesterday,
        },
        ...where
      },
      select: {
        id: true,
        event: true,
        ipAddress: true,
        createdAt: true
      }
    });

    // Helper to count unique IPs
    const countUniqueVisitors = (logs: typeof analytics) => {
      const uniqueIPs = new Set(logs.map(log => log.ipAddress).filter(Boolean));
      return uniqueIPs.size;
    };

    const todayLogs = analytics.filter(a => a.createdAt >= startOfToday);
    const yesterdayLogs = analytics.filter(a => a.createdAt >= startOfYesterday && a.createdAt < startOfToday);

    const data = {
      current_period: {
        total_visitors: countUniqueVisitors(todayLogs),
        page_visitors: countUniqueVisitors(todayLogs.filter(a => a.event === 'page_view')),
        comment_visitors: countUniqueVisitors(todayLogs.filter(a => a.event === 'comment'))
      },
      previous_period: {
        total_visitors: countUniqueVisitors(yesterdayLogs),
        page_visitors: countUniqueVisitors(yesterdayLogs.filter(a => a.event === 'page_view')),
        comment_visitors: countUniqueVisitors(yesterdayLogs.filter(a => a.event === 'comment'))
      },
      top_pages: calculateTopPages(todayLogs),
      avg_session: calculateAvgSession(todayLogs),
      traffic_sources: calculateTrafficSources(todayLogs)
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// Helper to calculate top pages
function calculateTopPages(logs: any[]) {
  const pageViews: Record<string, number> = {};

  logs.forEach(log => {
    if (log.event === 'page_view' && log.metadata && typeof log.metadata === 'object' && 'path' in log.metadata) {
      const path = (log.metadata as any).path;
      pageViews[path] = (pageViews[path] || 0) + 1;
    }
  });

  const sortedPages = Object.entries(pageViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([page, views]) => ({
      page,
      views,
      percentage: Math.round((views / logs.filter(l => l.event === 'page_view').length) * 100) || 0
    }));

  return sortedPages;
}

// Helper to calculate average session duration (in seconds)
function calculateAvgSession(logs: any[]) {
  // Group logs by IP address
  const sessions: Record<string, Date[]> = {};

  logs.forEach(log => {
    if (!sessions[log.ipAddress]) sessions[log.ipAddress] = [];
    sessions[log.ipAddress].push(new Date(log.createdAt));
  });

  let totalDuration = 0;
  let sessionCount = 0;

  Object.values(sessions).forEach(timestamps => {
    if (timestamps.length > 1) {
      // Sort timestamps to find first and last event
      timestamps.sort((a, b) => a.getTime() - b.getTime());
      const first = timestamps[0];
      const last = timestamps[timestamps.length - 1];
      const duration = (last.getTime() - first.getTime()) / 1000; // in seconds

      // Only count meaningful sessions (> 0 seconds)
      if (duration > 0) {
        totalDuration += duration;
        sessionCount++;
      }
    }
  });

  const avgSeconds = sessionCount > 0 ? Math.round(totalDuration / sessionCount) : 0;

  // Format as MM:SS
  const minutes = Math.floor(avgSeconds / 60);
  const seconds = avgSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper to calculate traffic sources
function calculateTrafficSources(logs: any[]) {
  const sources: Record<string, number> = {};

  logs.forEach(log => {
    // Check for referrer in metadata
    let source = 'Direct';

    if (log.metadata && typeof log.metadata === 'object' && 'referrer' in log.metadata) {
      const referrer = (log.metadata as any).referrer;

      if (referrer && referrer !== 'direct' && referrer !== '') {
        try {
          const url = new URL(referrer);
          source = url.hostname.replace('www.', '');

          // Categorize common sources
          if (source.includes('google')) source = 'Search Engines';
          else if (source.includes('facebook') || source.includes('twitter') || source.includes('instagram') || source.includes('linkedin') || source.includes('t.co')) source = 'Social Media';
        } catch (e) {
          source = referrer; // Fallback
        }
      }
    }

    sources[source] = (sources[source] || 0) + 1;
  });

  const total = logs.length;

  return Object.entries(sources)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([source, visitors]) => ({
      source,
      visitors,
      percentage: Math.round((visitors / total) * 100) || 0
    }));
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = analyticsSchema.parse(body)

    const analytics = await prisma.analytics.create({
      data: {
        ...validatedData,
        ipAddress: request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          '127.0.0.1',
        userAgent: request.headers.get('user-agent') || '',
        metadata: validatedData.metadata || {},
      }
    })

    return NextResponse.json(analytics, { status: 201 })
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create analytics event' },
      { status: 500 }
    )
  }
}
