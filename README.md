# UKONI - Next.js Application

A modern full-stack application built with Next.js, TypeScript, Neon PostgreSQL, and NextAuth.js.

## Tech Stack

- **Frontend**: Next.js 16 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ukoni
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Database Configuration
DATABASE_URL=postgresql://your-neon-db-url

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js routes
│   │   ├── posts/         # Post management
│   │   ├── comments/      # Comment system
│   │   ├── subscribers/   # Newsletter subscriptions
│   │   ├── media/         # File uploads
│   │   └── analytics/     # Analytics tracking
│   └── (pages)/           # Application pages
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth configuration
│   └── cloudinary.ts     # Cloudinary integration
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/[slug]` - Get a specific post
- `PUT /api/posts/[slug]` - Update a post
- `DELETE /api/posts/[slug]` - Delete a post

### Comments
- `GET /api/comments` - Get comments
- `POST /api/comments` - Create a comment
- `PUT /api/comments/[id]` - Update comment status
- `DELETE /api/comments/[id]` - Delete a comment

### Media
- `POST /api/media/upload` - Upload file to Cloudinary
- `POST /api/media/delete` - Delete file from Cloudinary

### Subscribers
- `GET /api/subscribers` - Get subscribers (admin only)
- `POST /api/subscribers` - Subscribe to newsletter

### Analytics
- `GET /api/analytics` - Get analytics data (admin only)
- `POST /api/analytics` - Track analytics event

## Database Schema

The application uses the following main models:

- **User**: User accounts and authentication
- **Post**: Blog posts and articles
- **Comment**: Nested comment system
- **Subscriber**: Newsletter subscribers
- **Analytics**: Event tracking and analytics

## Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
DATABASE_URL=your-production-neon-db-url
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Development

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

### Code Style

This project uses TypeScript and follows the Next.js conventions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
