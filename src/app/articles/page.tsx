"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Search,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { getImageUrl } from "@/lib/image";

// --- Types ---
type Author = {
  fullName: string;
  username?: string;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string | null;
  featuredImageUrl: string | null;
  featuredImagePublicId: string | null;
  author: Author;
  publishedAt: string;
  readTime: number | null;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  tags: string[];
};

const CATEGORIES = [
  "All Topics",
  "Technology",
  "Design",
  "Culture",
  "Development",
  "AI",
];

export default function ArticlesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all published posts
        const response = await fetch('/api/posts?status=published&limit=50');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        
        // Handle API response structure
        const allPosts = Array.isArray(data) ? data : data.posts || [];
        
        setPosts(allPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        // Don't set error message, just keep loading state
        setError('silent_error'); // Silent error for debugging
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.author.fullName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        activeCategory === "All Topics" || 
        post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, activeCategory]);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category).filter(Boolean));
    return ["All Topics", ...Array.from(cats)];
  }, [posts]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl aspect-[4/3] mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={16} fill="currentColor" />
            </div>
            Ukoni
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/articles" className="text-gray-900">Articles</Link>
            <Link href="/about" className="hover:text-blue-600 transition">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-full transition" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl px-6 py-8 flex flex-col gap-6 z-40 animate-in slide-in-from-top-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/articles" onClick={() => setIsMobileMenuOpen(false)}>Articles</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          </div>
        )}
      </nav>

      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <BookOpen size={14} className="text-blue-500" /> The Library
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Explore our latest <br className="hidden md:block" />
            <span className="text-blue-600">insights & stories.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-10">
            A curated collection of thoughts on technology, design, and the digital world.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search articles, topics or posts... "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Categories */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Always show loading skeleton when loading or when no posts yet */}
        {(isLoading || posts.length === 0) && <LoadingSkeleton />}

        {/* No Results - only show when not loading and posts exist but filtered results are empty */}
        {!isLoading && posts.length > 0 && filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No articles found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All Topics');
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && posts.length > 0 && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="group flex flex-col h-full">
                <Link 
                  href={`/articles/${post.slug}`} 
                  className="block overflow-hidden rounded-2xl mb-5 relative aspect-[4/3]"
                >
                  <img 
                    src={post.featuredImageUrl || getImageUrl(post.featuredImage)} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to placeholder if image fails
                      const target = e.target as HTMLImageElement;
                      target.src = getImageUrl('placeholder');
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                    {post.category}
                  </div>
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(post.publishedAt)}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime} min read
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition leading-snug">
                    <Link href={`/articles/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        {post.author.fullName.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {post.author.fullName}
                      </span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.slice(0, 2).map((tag, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && posts.length > 0 && filteredPosts.length > 0 && (
          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
              Load More Articles
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles size={16} fill="currentColor" />
              </div>
              <span className="font-bold text-lg">Ukoni</span>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
 
              <Link href="mailto:ukonisophia@gmail.com" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Ukoni. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}