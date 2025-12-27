import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 100, // max requests per window
}

// Security headers configuration
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    })
    return true
  }

  if (record.count >= RATE_LIMIT.maxAttempts) {
    return false
  }

  record.count++
  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const clientId = getClientIdentifier(request)

  // Apply rate limiting to admin routes
  if (pathname.startsWith('/admin')) {
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': '900', // 15 minutes
            ...securityHeaders,
          }
        }
      )
    }
  }

  // Check if the path is an admin route
  if (pathname.startsWith('/admin')) {
    const session = await auth()
    
    // If no session, redirect to login
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      
      const response = NextResponse.redirect(loginUrl)
      // Add security headers to redirect response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    }

    // Admin access control
    try {
      const user = await db
        .select({ admin: users.admin })
        .from(users)
        .where(eq(users.id, session.user?.id as string))
        .limit(1)

      const isAdmin = user[0]?.admin

      // Check if user has admin privileges
      if (!isAdmin) {
        // Redirect to unauthorized page or home
        const unauthorizedUrl = new URL('/unauthorized', request.url)
        return NextResponse.redirect(unauthorizedUrl)
      }

      // Add admin status to headers for downstream use
      const response = NextResponse.next()
      response.headers.set('x-user-admin', isAdmin.toString())
      
      // Add security headers
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response

    } catch (error) {
      console.error('Database error in middleware:', error)
      // Fail securely - redirect to login if we can't verify admin status
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Apply security headers to all responses
  const response = NextResponse.next()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ['/admin/:path*']
}
