import { notFound } from 'next/navigation';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, MessageCircle } from 'lucide-react';

// Define post type
type Post = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  slug: string;
};

// Define comment type
type Comment = {
  id: number;
  author: string;
  content: string;
  date: string;
};

// Generate static params for all published posts
export async function generateStaticParams() {
  // Return empty array for now - will be populated when database is set up
  return [];
}

// Fetch post data
async function getPost(slug: string): Promise<Post | null> {
  // Return null for now - will fetch from database when set up
  return null;
}

// Fetch comments for the post
async function getComments(postId: number): Promise<Comment[]> {
  // Return empty array for now - will fetch from database when set up
  return [];
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const comments = await getComments(post?.id ?? 0);

  if (!post) {
    notFound();
  }

  // Mock data for now
  const mockPost = {
    title: "Blog Post Coming Soon",
    content: "This blog post is being prepared. The backend database is currently being set up.",
    excerpt: "Stay tuned for amazing content!",
    thumbnailUrl: null,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { name: "Admin" },
    viewsCount: 0
  };

  const formattedDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const readTime = 1;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            Ukoni
          </Link>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {mockPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{mockPost.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={16} />
                <span>{comments.length} comments</span>
              </div>
            </div>
            
            {mockPost.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4">
                {mockPost.excerpt}
              </p>
            )}
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>{mockPost.content}</p>
            <p>The backend API with FastAPI and PostgreSQL (Neon) has been successfully set up. The database includes user authentication and management features.</p>
            <p>Next steps:</p>
            <ul>
              <li>Set up blog post models in the database</li>
              <li>Create API endpoints for blog content</li>
              <li>Connect the frontend to the backend API</li>
              <li>Implement comment functionality</li>
            </ul>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Comments ({comments.length})
          </h2>
          
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {comment.author || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </section>

        {/* Back to Home */}
        <div className="mt-16 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
          >
            <ArrowLeft size={16} />
            Back to all posts
          </Link>
        </div>
      </main>
    </div>
  );
}
