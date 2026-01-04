# UKONI - Database Setup & Authentication Guide

## 🚀 Quick Setup

### 1. Database Setup

Run the database setup script to create a user and sample data:

```bash
npm run setup:db
```

Or run it manually:

```bash
node scripts/setup-database.js
```

### 2. Default Login Credentials

After running the setup script, you can login with:

- **Email**: `admin@ukoni.com`
- **Password**: `admin123`

### 3. Manual Database Setup (Alternative)

If you prefer to run SQL directly, use the provided script:

```bash
# Run this SQL in your Neon PostgreSQL database
psql $DATABASE_URL -f scripts/create-user.sql
```

## 📁 Database Schema

The application uses the following main tables:

### Authentication Tables
- `users` - User accounts with hashed passwords
- `accounts` - NextAuth provider accounts
- `sessions` - User sessions
- `verification_tokens` - Email verification tokens

### Content Tables
- `posts` - Blog posts with metadata
- `comments` - Nested comment system
- `subscribers` - Newsletter subscribers
- `analytics` - Event tracking data

## 🔐 Authentication System

The app uses **NextAuth.js** with credentials provider:

### Features
- Email/password authentication
- Session management
- Protected routes
- User profile handling

### Files Involved
- `src/lib/auth.ts` - NextAuth configuration
- `src/lib/prisma.ts` - Database client
- `src/app/api/auth/[...nextauth]/route.ts` - Auth API route
- `src/components/auth/login-form.tsx` - Login component
- `src/app/login/page.tsx` - Login page

## 🛠️ API Routes

All API routes are located in `src/app/api/`:

- `POST /api/auth/signin` - Login
- `GET /api/posts` - Fetch posts
- `POST /api/posts` - Create post
- `GET /api/comments` - Fetch comments
- `POST /api/comments` - Create comment
- `POST /api/subscribers` - Subscribe to newsletter
- `POST /api/analytics` - Track events

## 🎨 Frontend Features

### Homepage (`src/app/page.tsx`)
- Modern blog layout with search
- Featured posts section
- Latest articles grid
- Newsletter subscription
- Responsive design

### Components
- Search drawer with real-time filtering
- Post cards with hover effects
- Category badges
- Author avatars
- Loading skeletons

## 📦 Dependencies

### Core Dependencies
- `next` - React framework
- `next-auth` - Authentication
- `@prisma/client` - Database ORM
- `bcryptjs` - Password hashing
- `tailwindcss` - Styling

### Development Dependencies
- `prisma` - Database toolkit
- `typescript` - Type safety
- `@types/node` - Node.js types

## 🌐 Environment Variables

Required environment variables (already configured in `.env`):

```env
# Database
DATABASE_URL=your_neon_postgresql_url

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Cloudinary (for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=UKONI
```

## 🚀 Running the Application

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run setup:db
```

3. Start the development server:
```bash
npm run dev
```

4. Visit `http://localhost:3000`

## 🔧 Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check Neon PostgreSQL is running
- Ensure SSL mode is enabled

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure user exists in database

### Build Errors
- Run `npm run build` to check for issues
- Check all imports are correct
- Verify Prisma client is generated: `npx prisma generate`

## 📝 Next Steps

1. **Customize the design** - Update colors, fonts, layout
2. **Add more auth providers** - Google, GitHub, etc.
3. **Implement media uploads** - Cloudinary integration
4. **Add admin panel** - Content management interface
5. **Deploy to production** - Vercel, Netlify, etc.

## 🤝 Contributing

Feel free to modify and extend the application. The codebase is designed to be:

- **Modular** - Clear separation of concerns
- **Type-safe** - Full TypeScript support
- **Scalable** - Easy to add new features
- **Modern** - Latest web technologies
