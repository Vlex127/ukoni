'use client';

import React, { useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  MoreHorizontal,
  MessageSquare,
  Share2,
  Globe,
  Clock,
  Calendar,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import { getImageUrl, generateBlurDataURL } from '@/lib/image';
import { CommentsSection } from '@/components/comments/CommentsSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- TYPES ---
type Author = {
  fullName: string;
  avatar_url?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  featuredImage: string | null;
  featuredImageUrl: string | null;
  featuredImagePublicId: string | null;
  author: Author;
  publishedAt: string;
  excerpt?: string;
  readTime?: number; // Optional read time
};

// --- LOADING SKELETON ---
const PostSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-8">
    <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
    <div className="h-12 bg-gray-200 rounded-lg w-3/4" />
    <div className="h-[400px] bg-gray-200 rounded-2xl" />
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = React.useState<Post | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showSkeleton, setShowSkeleton] = React.useState(false); // Delayed skeleton state
  const commentsRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Timer to delay the skeleton display
    const timer = setTimeout(() => {
      setShowSkeleton(true);
    }, 200); // 200ms delay before showing skeleton

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          notFound();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        clearTimeout(timer); // Clear timer if fetch finishes early
      }
    };
    fetchPost();

    return () => clearTimeout(timer); // Cleanup
  }, [slug]);

  const handleScrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.title,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    } else {
      handleCopy();
    }
  };

  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 70%, 80%)`;
  };

  if (isLoading) {
    // Only show skeleton if the delay threshold has passed
    if (showSkeleton) {
      return (
        <div className="min-h-screen bg-white">
          <PostSkeleton />
        </div>
      );
    }
    // Otherwise show nothing (or a very minimal spinner if preferred, but user implied no skeleton)
    return <div className="min-h-screen bg-white" />;
  }

  if (!post) return notFound();

  const imageSource = post.featuredImageUrl || post.featuredImage;
  const authorName = post.author?.fullName || 'Ukoni Author';
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : new Date();

  return (
    <div className="min-h-screen bg-white">
      {/* --- Sticky Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center justify-between">
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/articles" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <Link href="/" className="font-bold text-xl text-blue-700 tracking-tight hidden sm:block">
              Ukoni
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-gray-600">
              <Share2 size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-8 md:py-12 px-4 md:px-6">
        <article className="flex flex-col gap-8">

          {/* 1. Header & Meta */}
          <header className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-4">
              <span className="bg-blue-50 px-3 py-1 rounded-full">
                {post.category || 'Article'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage src={post.author.avatar_url} />
                  <AvatarFallback style={{ backgroundColor: stringToColor(authorName) }} className="text-gray-700 font-bold">
                    {authorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-bold text-gray-900 text-sm">{authorName}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(publishedDate, 'MMM d, yyyy')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime || 5} min read
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Action buttons could go here */}
              </div>
            </div>
          </header>

          {/* 2. Featured Image */}
          {imageSource && (
            <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden bg-gray-100 shadow-sm my-2">
              <Image
                src={getImageUrl(imageSource, { width: 1200, height: 630, quality: 90 })}
                alt={post.title}
                fill
                className="object-cover"
                priority={true}
                placeholder="blur"
                blurDataURL={generateBlurDataURL(800, 400)}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}

          {/* 3. Content */}
          <div className="prose prose-lg md:prose-xl prose-slate max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 4. Interaction Bar (Sticky Bottom on Mobile?) - Keeping inline for now but styled better */}
          <div className="border-y border-gray-100 py-6 my-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={handleScrollToComments}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                title="View comments"
              >
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-50">
                  <MessageSquare size={20} />
                </div>
                <span>Comments</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                title="Share article"
              >
                <div className="p-2 rounded-full bg-gray-100">
                  <Share2 size={20} />
                </div>
                <span>Share</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                title="Copy link"
              >
                <Copy size={18} />
                <span className="hidden sm:inline">Copy Link</span>
              </button>
            </div>
          </div>

          {/* 5. Comments Section */}
          <div id="comments" ref={commentsRef} className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion</h3>
            <CommentsSection postId={post.id} />
          </div>

        </article>
      </main>

      {/* Footer (Simplified) */}
      <footer className="border-t border-gray-100 mt-12 py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Ukoni. All rights reserved.
        </div>
      </footer>
    </div>
  );
}