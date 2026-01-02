"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getApiUrl } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  FileText, 
  MoreHorizontal, 
  X, 
  Image as ImageIcon,
  Filter
} from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: string;
  author_id: number;
  category: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  view_count: number;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  author: {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
  };
}

const categories = [
  "Technology", "Design", "Culture", "Productivity", 
  "Development", "AI", "Lifestyle", "Business",
];

export default function PostsPage() {
  const { user } = useAuth();
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
    featured_image: "",
    meta_title: "",
    meta_description: "",
    is_featured: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(getApiUrl('api/v1/posts'), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = async (file: File) => {
    if (!file) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      console.log("Sending file upload request...");
      const response = await fetch(getApiUrl('api/v1/uploads/upload'), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Upload response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed with status:", response.status, "Error:", errorText);
        throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Upload successful, response:", data);
      
      // The backend returns the full URL to the uploaded file
      // e.g., "http://localhost:8000/api/v1/uploads/filename.jpg"
      return data.url || `/api/v1/uploads/${data.filename}`;
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      alert(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    setImagePreview(URL.createObjectURL(file));
    
    // Upload the file
    const imagePath = await handleImageUpload(file);
    if (imagePath) {
      setFormData(prev => ({
        ...prev,
        featured_image: imagePath
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const url = editingPost
        ? getApiUrl(`api/v1/posts/${editingPost.id}`)
        : getApiUrl('api/v1/posts');
      
      const method = editingPost ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPosts();
        closeModal();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error: ${errorData.detail || "Failed to save"}`);
      }
    } catch (error) {
      alert("Network error occurred");
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(getApiUrl(`api/v1/posts/${postId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
      featured_image: post.featured_image || "",
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      is_featured: post.is_featured,
    });
    setImagePreview(null);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingPost(null);
    setImagePreview(null);
    setFormData({
      title: "", content: "", excerpt: "", status: "draft", category: "",
      featured_image: "", meta_title: "", meta_description: "", is_featured: false,
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>
          <p className="text-gray-400 mt-1">Manage and organize your blog content</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none w-64 transition-all"
            />
          </div>
          <button
            onClick={() => { closeModal(); setShowCreateModal(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> New Post
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2rem] shadow-sm p-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your content...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="bg-orange-50 p-6 rounded-full mb-4">
              <FileText size={40} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No posts found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or create a new post.</p>
          </div>
        ) : (
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
                          {post.featured_image ? (
                            <img 
                              src={post.featured_image.startsWith('http') 
                                ? post.featured_image 
                                : getApiUrl(post.featured_image.replace(/^\/+/, ''))} 
                              alt="" 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-300">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            by {post.author.full_name || post.author.username} • {new Date(post.created_at).toLocaleDateString()}
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
                       <div className="text-sm font-medium text-gray-600">
                         {post.view_count} <span className="text-gray-400 font-normal text-xs">views</span>
                       </div>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(post)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Modal Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity" 
            onClick={closeModal}
          ></div>
          
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingPost ? "Edit Post" : "Create Post"}
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors">
                        {imagePreview || formData.featured_image ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={imagePreview || (formData.featured_image.startsWith('http') 
                                ? formData.featured_image 
                                : getApiUrl(formData.featured_image.replace(/^\/+/, '')))} 
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
                          disabled={isUploading}
                        />
                      </div>
                    </label>
                    {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
                  </div>
                </div>

                <InputGroup label="Title">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Enter post title"
                    required
                  />
                </InputGroup>

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

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-4 border border-blue-100 bg-blue-50/50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Mark as Featured Post</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-transform active:scale-95"
                >
                  {editingPost ? "Save Changes" : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components

function StatusBadge({ status }: { status: string }) {
  const styles = {
    published: "bg-blue-100 text-blue-700 border-blue-200", // Blue for success
    draft: "bg-orange-100 text-orange-700 border-orange-200", // Peach for drafts
    archived: "bg-pink-100 text-pink-700 border-pink-200", // Pink for archived
  };

  const currentStyle = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${currentStyle} capitalize`}>
      {status}
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