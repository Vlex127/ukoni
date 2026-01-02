// src/app/admin/posts/[slug]/page.tsx
'use client';

import { notFound, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { PostForm } from '../post-form';
import { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: string;
  category: string | null;
  featured_image: string | null;
  featured_image_url: string | null;
  featured_image_public_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean;
}

export default function EditPostPage() {
  const { user } = useAuth();
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

        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // First, fetch all posts
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(
          `${baseUrl}/api/v1/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch posts');
        }

        const posts = await response.json();
        
        // Find the post with the matching slug
        const foundPost = posts.find((p: any) => p.slug === params.slug);
        
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

    if (user) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [user, params.slug]);

  if (!user) {
    return notFound();
  }

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
    meta_title: post.meta_title || "",
    meta_description: post.meta_description || "",
    // If featured_image is allowed to be null in the form, you can leave it. 
    // If the form complains about that too later, add: featured_image: post.featured_image || null 
  }} 
/>
    </div>
  );
}