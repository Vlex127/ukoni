'use client';

import React, { useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Globe,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { CommentsSection } from '@/components/comments/CommentsSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

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
  author: Author;
  publishedAt: string;
  likes_count?: number; 
};

// --- LOADING SKELETON ---
const PostSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
    <div className="p-4 h-96 bg-gray-200" />
  </div>
);

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = React.useState<Post | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Local interaction state (Guest mode - resets on refresh)
  const [isLiked, setIsLiked] = React.useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          console.log('Post data received:', data);
          setPost(data);
        } else {
          notFound();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleScrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  // Utility for avatar colors
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 70%, 80%)`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F2EF] pt-20 pb-10">
        <div className="max-w-[700px] mx-auto px-4"><PostSkeleton /></div>
      </div>
    );
  }

  if (!post) return notFound();

  const imageUrl = post.featuredImageUrl || (post.featuredImage ? getImageUrl(post.featuredImage) : null);
  const authorName = post.author?.fullName || 'Ukoni Author';

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      {/* --- Sticky Navbar (Public / Guest View) --- */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 h-14 flex items-center justify-between">
         <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/articles" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <Link href="/" className="font-bold text-xl text-blue-700 tracking-tight">
                    Ukoni
                </Link>
            </div>
            {/* No User Profile here - Just a generic action or empty */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hidden md:flex text-gray-600 font-medium">
                    All Articles
                </Button>
            </div>
         </div>
      </nav>

      <main className="max-w-[700px] mx-auto py-6 px-0 md:px-4">
        <article className="bg-white md:rounded-xl border-y md:border border-gray-200 shadow-sm overflow-hidden">
            
            {/* 1. Header (Author Info) */}
            <header className="p-4 flex items-start justify-between">
                <div className="flex gap-3">
                    <Avatar className="w-12 h-12 border border-gray-100 cursor-default">
                        <AvatarImage src={post.author.avatar_url} />
                        <AvatarFallback style={{ backgroundColor: stringToColor(authorName) }} className="text-gray-700 font-bold">
                            {authorName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-gray-900 leading-tight">
                            {authorName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(post.publishedAt))} ago</span>
                            <span>•</span>
                            <Globe size={12} />
                        </div>
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8">
                    <MoreHorizontal size={20} />
                </Button>
            </header>

            {/* 2. Content */}
            <div className="px-4 pb-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">
                    {post.title}
                </h1>
                <div 
                    className="prose prose-slate max-w-none text-gray-800 text-[15px] leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>

            {/* 3. Image */}
            {imageUrl && (
                <div className="w-full bg-gray-100 border-t border-gray-100">
                    <img src={imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[600px]" />
                </div>
            )}

            {/* 4. Social Counts */}
            <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
                <div className="flex items-center gap-1">
                   {isLiked && (
                       <div className="bg-blue-500 rounded-full p-1 text-white fade-in zoom-in duration-200">
                          <ThumbsUp size={10} fill="white" />
                       </div>
                   )}
                   <span className="hover:text-blue-600 hover:underline cursor-pointer">
                       {isLiked ? (post.likes_count || 0) + 1 : (post.likes_count || 0)} likes
                   </span>
                </div>
                <div className="hover:text-blue-600 hover:underline cursor-pointer" onClick={handleScrollToComments}>
                    Comments
                </div>
            </div>

            {/* 5. Action Bar */}
            <div className="px-2 py-1 flex items-center justify-between">
                <Button 
                    variant="ghost" 
                    className={`flex-1 gap-2 hover:bg-gray-100 rounded-md py-6 transition-all ${isLiked ? 'text-blue-600 font-semibold' : 'text-gray-600 font-medium'}`}
                    onClick={() => setIsLiked(!isLiked)}
                >
                    <ThumbsUp size={18} className={isLiked ? "fill-blue-600" : ""} />
                    Like
                </Button>
                
                <Button 
                    variant="ghost" 
                    className="flex-1 gap-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md py-6"
                    onClick={handleScrollToComments}
                >
                    <MessageSquare size={18} />
                    Comment
                </Button>
                
                <Button 
                    variant="ghost" 
                    className="flex-1 gap-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md py-6"
                    onClick={handleShare}
                >
                    <Share2 size={18} />
                    Share
                </Button>
            </div>

            {/* 6. Comments Integration */}
            <div ref={commentsRef} className="bg-gray-50/50 border-t border-gray-200 px-4 pt-2 pb-6">
                <CommentsSection postId={post.id} />
            </div>

        </article>
      </main>
    </div>
  );
}