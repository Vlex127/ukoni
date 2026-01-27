"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  FileText,
  MoreHorizontal,
  X,
  Image as ImageIcon,
  Filter,
  CalendarDays,
  User,
  Eye,
  BarChart3,
  RefreshCw
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: string;
  authorId: string;
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

const categories = [
  "Faith & Spirituality", "Personal Growth", "Life Purpose", "Career & Calling",
  "Family & Relationships", "Health & Wellness", "Creativity & Arts",
  "Education & Learning", "Community & Service", "Culture & Society", "Lifestyle",
];

export default function PostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    category: "",
    featuredImage: "",
    featuredImageUrl: "",
    featuredImagePublicId: "",
    metaTitle: "",
    metaDescription: "",
    isFeatured: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        cache: 'no-store', // Disable caching to see latest view counts
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const postsArray = Array.isArray(data) ? data : data.posts || [];
        setPosts(postsArray);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleImageUpload = async (file: File) => {
    if (!file) return null;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/media/upload', {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
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
        return data.data.url;
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    await handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPost
        ? `/api/posts/${editingPost.slug}`
        : '/api/posts';

      const method = editingPost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText);
        alert(`Error: ${errorData.detail || errorData.error || "Failed to save"}`);
        return;
      }

      await fetchPosts();
      closeModal();
    } catch (error) {
      console.error('Submit error:', error);
      alert("Network error occurred");
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) await fetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      status: post.status,
      category: post.category || "",
      featuredImage: post.featuredImage || "",
      featuredImageUrl: post.featuredImageUrl || "",
      featuredImagePublicId: post.featuredImagePublicId || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      isFeatured: post.isFeatured,
    });
    setImagePreview(post.featuredImageUrl || null);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingPost(null);
    setImagePreview(null);
    setFormData({
      title: "", content: "", excerpt: "", status: "draft", category: "",
      featuredImage: "",
      featuredImageUrl: "",
      featuredImagePublicId: "",
      metaTitle: "",
      metaDescription: "",
      isFeatured: false,
    });
  };

  if (!session) return null;

  return (
    <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">

      {/* --- Responsive Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">All Posts</h1>
          <p className="text-sm md:text-base text-gray-400 mt-1">Manage and organize your blog content</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white rounded-xl md:rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 transition-all"
            />
          </div>
          <button
            onClick={fetchPosts}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 px-4 py-3 rounded-xl md:rounded-2xl font-medium transition-all shadow-sm border border-gray-100 active:scale-95"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => { closeModal(); setShowCreateModal(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl md:rounded-2xl font-medium transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus size={20} /> <span className="whitespace-nowrap">New Post</span>
          </button>
        </div>
      </div>

      {/* --- Stats Summary Section --- */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
              <FileText size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-800">{posts.length}</span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Posts</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-2">
              <Eye size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {posts.reduce((acc, p) => acc + (p.viewCount || 0), 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Views</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2">
              <BarChart3 size={20} />
            </div>
            <span className="text-sm font-bold text-gray-800 line-clamp-1">
              {[...posts].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0]?.title || 'N/A'}
            </span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Most Popular</span>
          </div>
        </div>
      )}

      {/* --- Main Content Area --- */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your content...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm flex flex-col items-center">
          <div className="bg-orange-50 p-6 rounded-full mb-4">
            <FileText size={40} className="text-orange-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No posts found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search or create a new post.</p>
        </div>
      ) : (
        <>
          {/* --- View 1: Desktop Table (Hidden on Mobile) --- */}
          <div className="hidden md:block bg-white rounded-[2rem] shadow-sm p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-4 pl-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Details</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stats</th>
                    <th className="pb-4 text-right pr-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {post.featuredImageUrl ? (
                              <img src={post.featuredImageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-300">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 line-clamp-1 max-w-[200px]">{post.title}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              by {post.author.fullName || post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100">
                          {post.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-4">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <div className={`text-sm font-bold flex items-center gap-1.5 ${post.viewCount > 100 ? 'text-blue-600' : 'text-gray-700'}`}>
                            <Eye size={14} className={post.viewCount > 100 ? 'animate-pulse' : ''} />
                            {post.viewCount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Total Hits</div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(post)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- View 2: Mobile Cards (Hidden on Desktop) --- */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
                {/* Top Row: Image + Title */}
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {post.featuredImageUrl ? (
                      <img src={post.featuredImageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800 line-clamp-2 text-sm">{post.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <User size={12} />
                      <span className="truncate">{post.author.username}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <CalendarDays size={12} />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Meta info */}
                <div className="flex items-center justify-between border-t border-b border-gray-50 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Category</span>
                    <span className="text-xs font-medium text-gray-600">{post.category || "Uncategorized"}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Popularity</span>
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${post.viewCount > 100 ? 'text-blue-600' : 'text-gray-600'}`}>
                      <Eye size={12} /> {post.viewCount.toLocaleString()} <span className="text-[10px] font-normal opacity-70">views</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Status + Actions */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={post.status} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 bg-pink-50 text-pink-600 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- Responsive Modal --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal Container: Full height on mobile, fit content on desktop */}
          <div className="relative bg-white w-full h-[95vh] md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-[2rem] rounded-t-[2rem] shadow-2xl flex flex-col">

            {/* Modal Header */}
            <div className="flex-shrink-0 bg-white/80 backdrop-blur-md px-6 md:px-8 py-4 md:py-6 border-b border-gray-100 flex justify-between items-center z-10 md:rounded-t-[2rem] rounded-t-[2rem]">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                {editingPost ? "Edit Post" : "Create Post"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                  <label className="cursor-pointer block w-full">
                    <div className="w-full md:w-32 h-40 md:h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors bg-gray-50 md:bg-white">
                      {imagePreview || formData.featuredImageUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview || formData.featuredImageUrl}
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
                          <span className="text-xs text-gray-500 mt-1 block">Tap to upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </div>
                  </label>
                  {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>

                <InputGroup label="Title">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Enter post title"
                    required
                  />
                </InputGroup>

                {/* Stacks on mobile, Side-by-side on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Category">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 focus:border-blue-100 rounded-xl outline-none transition-all"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </InputGroup>

                  <InputGroup label="Status">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 focus:border-blue-100 rounded-xl outline-none transition-all"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </InputGroup>
                </div>

                <InputGroup label="Excerpt">
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 focus:border-blue-100 rounded-xl outline-none transition-all resize-none"
                    placeholder="A short summary for previews..."
                  />
                </InputGroup>

                <InputGroup label="Content">
                  <textarea
                    rows={8}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 focus:border-blue-100 rounded-xl outline-none transition-all font-mono text-sm"
                    placeholder="Write your masterpiece here..."
                  />
                </InputGroup>

                <div className="pt-2 pb-20 md:pb-0">
                  <label className="flex items-center gap-3 p-4 border border-blue-100 bg-blue-50/50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Mark as Featured Post</span>
                  </label>
                </div>

              </form>
            </div>

            {/* Modal Footer - Fixed at bottom */}
            <div className="flex-shrink-0 bg-white border-t border-gray-100 p-4 md:p-6 flex justify-end gap-3 md:rounded-b-[2rem]">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-transform active:scale-95"
              >
                {editingPost ? "Save Changes" : "Publish Post"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components

function StatusBadge({ status }: { status: string }) {
  const styles = {
    published: "bg-blue-100 text-blue-700 border-blue-200",
    draft: "bg-orange-100 text-orange-700 border-orange-200",
    archived: "bg-pink-100 text-pink-700 border-pink-200",
  };

  const currentStyle = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${currentStyle} font-medium`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function InputGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700 ml-1">{label}</label>
      {children}
    </div>
  );
}