-- Create a test user with password hash
-- Run this script in your Neon PostgreSQL database

-- First, let's insert a user account (for NextAuth)
INSERT INTO accounts (
  id,
  user_id,
  type,
  provider,
  provider_account_id,
  refresh_token,
  access_token,
  expires_at,
  token_type,
  scope,
  id_token,
  session_state
) VALUES (
  'account_test_001',
  'user_test_001',
  'credentials',
  'credentials',
  'cred_test_001',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Insert the user record
INSERT INTO users (
  id,
  email,
  username,
  hashed_password,
  full_name,
  is_active,
  is_admin,
  created_at,
  updated_at,
  bio
) VALUES (
  'user_test_001',
  'admin@ukoni.com',
  'admin',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6', -- password: "admin123"
  'Admin User',
  true,
  true,
  NOW(),
  NOW(),
  'System administrator for UKONI platform'
) ON CONFLICT (id) DO NOTHING;

-- Insert a session
INSERT INTO sessions (
  id,
  session_token,
  user_id,
  expires
) VALUES (
  'session_test_001',
  'sess_test_token_001',
  'user_test_001',
  NOW() + INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

-- Insert a verification token
INSERT INTO verification_tokens (
  identifier,
  token,
  expires
) VALUES (
  'admin@ukoni.com',
  'verify_test_001',
  NOW() + INTERVAL '24 hours'
) ON CONFLICT (identifier, token) DO NOTHING;

-- Create some sample posts
INSERT INTO posts (
  id,
  title,
  slug,
  content,
  excerpt,
  status,
  author_id,
  category,
  featured_image,
  featured_image_url,
  featured_image_public_id,
  meta_title,
  meta_description,
  view_count,
  is_featured,
  published_at,
  created_at,
  updated_at
) VALUES 
(
  1,
  'Welcome to UKONI Platform',
  'welcome-to-ukoni-platform',
  '# Welcome to UKONI Platform

This is your first post on the UKONI platform. Built with Next.js, TypeScript, and modern web technologies.

## Features

- Modern UI with Tailwind CSS
- PostgreSQL database with Neon
- Authentication with NextAuth
- Media management with Cloudinary
- Comment system
- Analytics tracking

## Getting Started

Start exploring the platform and create amazing content!',
  'Welcome to the UKONI platform - your modern blogging and content management system built with Next.js and cutting-edge web technologies.',
  'published',
  'user_test_001',
  'Technology',
  'sample-image-1.jpg',
  'https://res.cloudinary.com/demo/image/upload/sample-image-1.jpg',
  'sample_public_id_1',
  'Welcome to UKONI Platform',
  'Your first post on the UKONI platform with modern features and capabilities.',
  0,
  true,
  NOW(),
  NOW(),
  NOW()
),
(
  2,
  'Getting Started with Next.js',
  'getting-started-with-nextjs',
  '# Getting Started with Next.js

Next.js is a powerful React framework that enables server-side rendering and generates static websites for web applications.

## Key Features

- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- API Routes
- Automatic Code Splitting
- Built-in CSS Support

## Installation

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

Start building your next web application with Next.js!',
  'Learn how to get started with Next.js, the powerful React framework for building modern web applications.',
  'published',
  'user_test_001',
  'Development',
  'sample-image-2.jpg',
  'https://res.cloudinary.com/demo/image/upload/sample-image-2.jpg',
  'sample_public_id_2',
  'Getting Started with Next.js',
  'Complete guide to getting started with Next.js framework for React development.',
  0,
  false,
  NOW(),
  NOW(),
  NOW()
),
(
  3,
  'Modern Web Development Trends',
  'modern-web-development-trends',
  '# Modern Web Development Trends

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

Stay ahead of the curve with these modern development approaches!',
  'Explore the latest trends in modern web development and stay ahead with cutting-edge technologies and best practices.',
  'published',
  'user_test_001',
  'Design',
  'sample-image-3.jpg',
  'https://res.cloudinary.com/demo/image/upload/sample-image-3.jpg',
  'sample_public_id_3',
  'Modern Web Development Trends',
  'Discover the latest trends and technologies shaping the future of web development.',
  0,
  false,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create some sample comments
INSERT INTO comments (
  id,
  post_id,
  author_name,
  author_email,
  content,
  status,
  ip_address,
  user_agent,
  parent_id,
  created_at,
  updated_at
) VALUES 
(
  1,
  1,
  'John Doe',
  'john@example.com',
  'Great platform! Really excited to see what we can build with this.',
  'approved',
  '192.168.1.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  NULL,
  NOW(),
  NOW()
),
(
  2,
  1,
  'Jane Smith',
  'jane@example.com',
  'The UI design is beautiful. Love the modern aesthetic!',
  'approved',
  '192.168.1.2',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  NULL,
  NOW(),
  NOW()
),
(
  3,
  2,
  'Mike Johnson',
  'mike@example.com',
  'This Next.js tutorial is really helpful. Thanks for sharing!',
  'approved',
  '192.168.1.3',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create a sample subscriber
INSERT INTO subscribers (
  id,
  email,
  created_at,
  is_active
) VALUES (
  1,
  'subscriber@example.com',
  NOW(),
  true
) ON CONFLICT (id) DO NOTHING;

-- Create some analytics data
INSERT INTO analytics (
  id,
  event_type,
  event_data,
  ip_address,
  user_agent,
  created_at
) VALUES 
(
  1,
  'page_view',
  '{"page": "/", "referrer": "direct"}',
  '192.168.1.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  NOW()
),
(
  2,
  'post_view',
  '{"post_id": 1, "post_slug": "welcome-to-ukoni-platform"}',
  '192.168.1.2',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  NOW()
),
(
  3,
  'user_login',
  '{"user_id": "user_test_001", "provider": "credentials"}',
  '192.168.1.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully!' as status,
       'Created 1 user (admin@ukoni.com with password: admin123)' as user_info,
       'Created 3 sample posts' as posts_info,
       'Created 3 sample comments' as comments_info;
