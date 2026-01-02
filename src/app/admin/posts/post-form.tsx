'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getApiUrl } from '@/lib/api';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';

interface PostFormProps {
  post?: {
    id?: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: string;
    category: string;
    featured_image: string | null;
    meta_title: string;
    meta_description: string;
    is_featured: boolean;
  };
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    status: post?.status || 'draft',
    category: post?.category || '',
    featured_image: post?.featured_image || '',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    is_featured: post?.is_featured || false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post?.featured_image) {
      setImagePreview(
        post.featured_image.startsWith('http')
          ? post.featured_image
          : getApiUrl(post.featured_image)
      );
    }
  }, [post]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const handleImageUpload = async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(getApiUrl('api/v1/uploads/upload'), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          featured_image: data.url || `/api/v1/uploads/${data.filename}`,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image. Please try again.');
      }
    };

    handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = post?.id
      ? getApiUrl(`api/v1/posts/${post.id}`)
      : getApiUrl('api/v1/posts/');

    const method = post?.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save post');
      }

      // Redirect to posts list after successful save
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      setError(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Featured Image</label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer">
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                    <span className="text-white text-sm font-medium">Change</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-2">
                  <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1 block">Click to upload</span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_featured"
          checked={formData.is_featured}
          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
          Mark as featured
        </label>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">SEO Settings</h3>
        
        <div className="mb-4">
          <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">
            Meta Title
          </label>
          <input
            type="text"
            id="meta_title"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description
          </label>
          <textarea
            id="meta_description"
            rows={3}
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/posts')}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              {post?.id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{post?.id ? 'Update Post' : 'Create Post'}</>
          )}
        </button>
      </div>
    </form>
  );
}
