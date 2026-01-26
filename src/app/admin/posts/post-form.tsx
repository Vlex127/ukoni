'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';

interface PostFormProps {
  post?: {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: string;
    category: string;
    featuredImage: string | null;
    featuredImageUrl: string | null;
    featuredImagePublicId: string | null;
    metaTitle: string;
    metaDescription: string;
    isFeatured: boolean;
  };
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    status: post?.status || 'draft',
    category: post?.category || '',
    featuredImage: post?.featuredImage || '',
    featuredImageUrl: post?.featuredImageUrl || '',
    featuredImagePublicId: post?.featuredImagePublicId || '',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    isFeatured: post?.isFeatured || false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post?.featuredImageUrl) {
      setImagePreview(post.featuredImageUrl);
    } else if (post?.featuredImage && post.featuredImage.startsWith('http')) {
      setImagePreview(post.featuredImage);
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
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image to Cloudinary');
        }

        const data = await response.json();

        if (data.success) {
          setFormData(prev => ({
            ...prev,
            featuredImage: data.data.publicId,
            featuredImageUrl: data.data.url,
            featuredImagePublicId: data.data.publicId,
          }));
          setImagePreview(data.data.url);
        } else {
          throw new Error(data.message || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image to Cloudinary. Please try again.');
      }
    };

    handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const url = post?.slug
      ? `/api/posts/${post.slug}`
      : '/api/posts';

    const method = post?.slug ? 'PUT' : 'POST';

    try {
      console.log('Current formData before submission:', formData);

      // Generate slug if missing or empty
      let finalSlug = formData.slug;

      if (!finalSlug || finalSlug.trim() === '') {
        finalSlug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        // Update the state with the generated slug
        setFormData(prev => ({ ...prev, slug: finalSlug }));
      }

      // Prepare data to send with guaranteed slug
      const dataToSend = {
        ...formData,
        slug: finalSlug
      };

      console.log('Form data being sent:', dataToSend);
      console.log('Request URL:', url);
      console.log('Request method:', method);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.detail || responseData.error || 'Failed to save post');
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
      {/* Hidden field to ensure slug is always included */}
      <input type="hidden" name="slug" value={formData.slug} />

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
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="auto-generated from title"
          required
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => {
            const newTitle = e.target.value;
            setFormData({
              ...formData,
              title: newTitle,
              slug: !post?.id ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : formData.slug
            });
          }}
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
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Faith & Spirituality">Faith & Spirituality</option>
            <option value="Personal Growth">Personal Growth</option>
            <option value="Life Purpose">Life Purpose</option>
            <option value="Career & Calling">Career & Calling</option>
            <option value="Family & Relationships">Family & Relationships</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Creativity & Arts">Creativity & Arts</option>
            <option value="Education & Learning">Education & Learning</option>
            <option value="Community & Service">Community & Service</option>
            <option value="Culture & Society">Culture & Society</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_featured"
          checked={formData.isFeatured}
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
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
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
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
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
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
