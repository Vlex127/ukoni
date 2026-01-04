#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database setup...')

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const user = await prisma.user.upsert({
      where: { email: 'admin@ukoni.com' },
      update: {},
      create: {
        email: 'admin@ukoni.com',
        username: 'admin',
        hashedPassword: hashedPassword,
        fullName: 'Admin User',
        isActive: true,
        isAdmin: true,
        bio: 'System administrator for UKONI platform'
      }
    })

    console.log('✅ Created admin user:', user.email)

    // Create account for NextAuth
    await prisma.account.upsert({
      where: { 
        provider_providerAccountId: {
          provider: 'credentials',
          providerAccountId: 'cred_admin_001'
        }
      },
      update: {},
      create: {
        userId: user.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: 'cred_admin_001',
      }
    })

    console.log('✅ Created NextAuth account')

    // Create sample posts
    const posts = [
      {
        title: 'Welcome to UKONI Platform',
        slug: 'welcome-to-ukoni-platform',
        content: `# Welcome to UKONI Platform

This is your first post on the UKONI platform. Built with Next.js, TypeScript, and modern web technologies.

## Features

- Modern UI with Tailwind CSS
- PostgreSQL database with Neon
- Authentication with NextAuth
- Media management with Cloudinary
- Comment system
- Analytics tracking

## Getting Started

Start exploring the platform and create amazing content!`,
        excerpt: 'Welcome to the UKONI platform - your modern blogging and content management system built with Next.js and cutting-edge web technologies.',
        status: 'published',
        authorId: user.id,
        category: 'Technology',
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        title: 'Getting Started with Next.js',
        slug: 'getting-started-with-nextjs',
        content: `# Getting Started with Next.js

Next.js is a powerful React framework that enables server-side rendering and generates static websites for web applications.

## Key Features

- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- API Routes
- Automatic Code Splitting
- Built-in CSS Support

## Installation

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

Start building your next web application with Next.js!`,
        excerpt: 'Learn how to get started with Next.js, the powerful React framework for building modern web applications.',
        status: 'published',
        authorId: user.id,
        category: 'Development',
        isFeatured: false,
        publishedAt: new Date(),
      },
      {
        title: 'Modern Web Development Trends',
        slug: 'modern-web-development-trends',
        content: `# Modern Web Development Trends

The web development landscape is constantly evolving. Here are the latest trends shaping the industry.

## Current Trends

1. **Jamstack Architecture**
2. **Serverless Functions**
3. **Progressive Web Apps (PWAs)**
4. **WebAssembly**
5. **AI-Powered Development Tools**

## Best Practices

- Focus on performance
- Prioritize accessibility
- Implement responsive design
- Use modern frameworks
- Optimize for SEO

Stay ahead of the curve with these modern development approaches!`,
        excerpt: 'Explore the latest trends in modern web development and stay ahead with cutting-edge technologies and best practices.',
        status: 'published',
        authorId: user.id,
        category: 'Design',
        isFeatured: false,
        publishedAt: new Date(),
      }
    ]

    for (const postData of posts) {
      await prisma.post.upsert({
        where: { slug: postData.slug },
        update: postData,
        create: postData
      })
    }

    console.log('✅ Created sample posts')

    // Create sample comments
    const comments = [
      {
        postId: 'welcome-to-ukoni-platform',
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        content: 'Great platform! Really excited to see what we can build with this.',
        status: 'approved',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        postId: 'welcome-to-ukoni-platform',
        authorName: 'Jane Smith',
        authorEmail: 'jane@example.com',
        content: 'The UI design is beautiful. Love the modern aesthetic!',
        status: 'approved',
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      {
        postId: 'getting-started-with-nextjs',
        authorName: 'Mike Johnson',
        authorEmail: 'mike@example.com',
        content: 'This Next.js tutorial is really helpful. Thanks for sharing!',
        status: 'approved',
        ipAddress: '192.168.1.3',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      }
    ]

    for (const commentData of comments) {
      const post = await prisma.post.findUnique({
        where: { slug: commentData.postId }
      })
      
      if (post) {
        await prisma.comment.create({
          data: {
            ...commentData,
            postId: post.id,
          }
        })
      }
    }

    console.log('✅ Created sample comments')

    // Create subscriber
    await prisma.subscriber.upsert({
      where: { email: 'subscriber@example.com' },
      update: {},
      create: {
        email: 'subscriber@example.com',
        isActive: true,
      }
    })

    console.log('✅ Created sample subscriber')

    // Create analytics data
    await prisma.analytics.createMany({
      data: [
        {
          event: 'page_view',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          metadata: { page: '/', referrer: 'direct' }
        },
        {
          postId: 'welcome-to-ukoni-platform',
          event: 'post_view',
          ipAddress: '192.168.1.2',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          metadata: { post_slug: 'welcome-to-ukoni-platform' }
        },
        {
          event: 'user_login',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          metadata: { user_id: user.id, provider: 'credentials' }
        }
      ]
    })

    console.log('✅ Created analytics data')

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📝 Login Credentials:')
    console.log('   Email: admin@ukoni.com')
    console.log('   Password: admin123')
    console.log('\n🌐 Visit http://localhost:3000/login to sign in')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
