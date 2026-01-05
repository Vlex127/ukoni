// src/app/admin/posts/[slug]/page.tsx
'use client';

import { notFound, useParams } from 'next/navigation';
import { PostForm } from '../post-form';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: string;
  category: string | null;
  featuredImage: string | null;
  featuredImageUrl: string | null;
  featuredImagePublicId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  viewCount: number;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    fullName: string | null;
  };
}

export default function EditPostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!params?.slug) {
          setError('Post slug is missing');
          setLoading(false);
          return;
        }

        // Fetch posts using our API
        const response = await fetch(
          `/api/posts?slug=${params.slug}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch post');
        }

        const postsData = await response.json();
        
        // Find the post with the matching slug
        const foundPost = postsData.posts?.find((p: any) => p.slug === params.slug);
        
        if (!foundPost) {
          setError('Post not found');
          return;
        }
        
        setPost(foundPost);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-500 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-red-700">
                {error || 'Post not found. The post may have been deleted or you may not have permission to view it.'}
              </p>
              <button
                onClick={() => window.location.href = '/admin/posts'}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                &larr; Back to Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
      </div>
      <PostForm 
        post={{
          ...post,
          excerpt: post.excerpt || "",
          category: post.category || "",
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          // If featured_image is allowed to be null in the form, you can leave it. 
          // If the form complains about that too later, add: featured_image: post.featured_image || null 
        }} 
      />
    </div>
  );
}