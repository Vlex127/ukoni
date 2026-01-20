import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { emailService } from '@/lib/email'

const subscriberSchema = z.object({
  email: z.string().email(),
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

    const subscribers = await prisma.subscriber.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`API: Found ${subscribers.length} active subscribers`);

    return NextResponse.json(subscribers)
  } catch (error) {
    console.error('Subscribers GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = subscriberSchema.parse(body)

    console.log('Subscription request for email:', validatedData.email)

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: {
        email: validatedData.email
      }
    })

    // Create or update subscriber
    const subscriber = await prisma.subscriber.upsert({
      where: {
        email: validatedData.email
      },
      update: {
        isActive: true
      },
      create: {
        email: validatedData.email,
        isActive: true
      }
    })

    console.log('Subscriber saved successfully:', subscriber.email)

    // Send welcome email only for new subscribers (try-catch to prevent API failure)
    if (!existingSubscriber) {
      console.log('Attempting to send welcome email to new subscriber:', validatedData.email)
      try {
        const emailSent = await emailService.sendWelcomeEmail(validatedData.email)

        if (emailSent) {
          console.log('Welcome email sent successfully to:', validatedData.email)
        } else {
          console.error('Failed to send welcome email, but subscriber was saved')
        }
      } catch (emailError) {
        console.error('Email service error:', emailError)
        // Don't fail the subscription if email fails
      }
    } else {
      console.log('Subscriber already exists, skipping welcome email:', validatedData.email)
    }

    return NextResponse.json({
      message: existingSubscriber ? 'Welcome back! You are already subscribed.' : 'Thank you for subscribing! Check your email for a welcome message.',
      subscriber
    }, { status: 201 })
  } catch (error) {
    console.error('Subscribers POST error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
