// src/app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getApiUrl } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

    const body = await request.json();
    
    const response = await fetch(getApiUrl('comments'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        ip_address: ip,
        user_agent: userAgent,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const parentId = searchParams.get('parent_id');
    
    let url = getApiUrl('comments');
    if (postId) {
      url += `?post_id=${postId}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }
    }

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}