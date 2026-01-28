"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from 'date-fns';
import {
  Search,
  Sparkles,
  Instagram,
  Menu,
  Linkedin,
  ArrowRight,
  Clock,
  ChevronRight,
  FileText,
  Heart,
  Palette,
  Anchor,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- Configuration ---
// Assuming these are in your project
import { getImageUrl, generateBlurDataURL } from '@/lib/image';

// --- Types ---
type Author = {
  fullName: string;
  username?: string;
};

type Post = {
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
  author: Author;
};

const CATEGORY_COLORS: Record<string, string> = {
  'Faith & Spirituality': 'bg-purple-100 text-purple-800',
  'Personal Growth': 'bg-green-100 text-green-800',
  'Life Purpose': 'bg-blue-100 text-blue-800',
  'Career & Calling': 'bg-orange-100 text-orange-800',
  'Family & Relationships': 'bg-pink-100 text-pink-800',
  'Health & Wellness': 'bg-emerald-100 text-emerald-800',
  'Creativity & Arts': 'bg-indigo-100 text-indigo-800',
  'Education & Learning': 'bg-cyan-100 text-cyan-800',
  'Community & Service': 'bg-red-100 text-red-800',
  'Culture & Society': 'bg-yellow-100 text-yellow-800',
  'Lifestyle': 'bg-amber-100 text-amber-800',
  default: 'bg-gray-100 text-gray-800',
};

export default function BlogHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  // Delayed loading skeleton
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // 1. Fetch Featured Post
        const featuredUrl = '/api/posts?is_featured=true&status=published&limit=1';
        const featuredRes = await fetch(featuredUrl);

        if (!featuredRes.ok) {
          throw new Error(`Featured posts fetch failed: ${featuredRes.status} ${featuredRes.statusText}`);
        }
        const featuredData = await featuredRes.json();

        // 2. Fetch Latest Posts
        const latestUrl = '/api/posts?status=published&limit=10';
        const response = await fetch(latestUrl);

        if (!response.ok) {
          throw new Error(`Latest posts fetch failed: ${response.status} ${response.statusText}`);
        }
        const latestData = await response.json();

        // Handle API response structure
        const featuredPosts = Array.isArray(featuredData) ? featuredData : featuredData.posts || [];
        const latestPosts = Array.isArray(latestData) ? latestData : latestData.posts || [];

        if (featuredPosts.length > 0) {
          const featured = featuredPosts[0];
          setFeaturedPost(featured);
          setPosts(latestPosts.filter((p: Post) => p.id !== featured.id));
        } else {
          setFeaturedPost(latestPosts[0] || null);
          setPosts(latestPosts.slice(1));
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  // Real-time Search Logic
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    // Search in current posts + featured post
    const allSearchable = featuredPost ? [featuredPost, ...posts] : posts;

    return allSearchable.filter(post =>
      post.title.toLowerCase().includes(query) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
      post.author.fullName.toLowerCase().includes(query)
    );
  }, [posts, featuredPost, searchQuery]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setSubscribeMessage('Please enter your email address');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribeMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscribeMessage('');

    try {
      console.log('Attempting subscription with email:', email);
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Subscription response status:', response.status);
      console.log('Subscription response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Subscription error response:', errorText);
        throw new Error(errorText || 'Failed to subscribe. Please try again.');
      }

      const data = await response.json();
      console.log('Subscription success data:', data);

      setSubscribeMessage(data.message || 'Thank you for subscribing! You\'ll hear from us soon.');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeMessage(
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again later.'
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 relative">

      {/* --- SEARCH DRAWER (Right Side) --- */}
      {/* 1. Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsSearchOpen(false)}
      />

      {/* 2. Drawer Panel */}
      <div className={`fixed top-0 right-0 z-[70] h-full w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isSearchOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Search</h2>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Linkedin size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles, topics, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-lg"
              autoFocus={isSearchOpen}
            />
          </div>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto h-[calc(100vh-180px)] p-6">

          {/* State: Typing but no results */}
          {searchQuery && filteredPosts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}

          {/* State: Results Found */}
          {searchQuery && filteredPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Found {filteredPosts.length} matches
              </h3>
              {filteredPosts.map(post => (
                <Link
                  href={`/articles/${post.slug}`}
                  key={post.id}
                  onClick={() => setIsSearchOpen(false)} // Close drawer on click
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                >
                  {/* Thumbnail (Optional) */}
                  {post.featuredImageUrl && (
                    <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src={getImageUrl(post.featuredImageUrl, { width: 64, height: 64, quality: 75 })}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={generateBlurDataURL(64, 64)}
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className={`${CATEGORY_COLORS[post.category || ''] || CATEGORY_COLORS.default} px-1.5 py-0.5 rounded`}>
                        {post.category || 'Uncategorized'}
                      </span>
                      <span>•</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 mt-2" />
                </Link>
              ))}
            </div>
          )}

          {/* State: Empty Search (Show Recent/Suggestions) */}
          {!searchQuery && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Recent Articles
              </h3>
              <div className="space-y-4">
                {posts.slice(0, 4).map(post => (
                  <Link
                    href={`/articles/${post.slug}`}
                    key={post.id}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-3 text-gray-600 hover:text-blue-600 group py-2"
                  >
                    <FileText size={18} className="text-gray-300 group-hover:text-blue-600" />
                    <span className="line-clamp-1 font-medium">{post.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* --- END SEARCH DRAWER --- */}

      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={16} fill="currentColor" />
            </div>
            Ukoni
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="text-gray-900">Home</Link>
            <Link href="/articles" className="hover:text-blue-600 transition">Articles</Link>
            <Link href="/about" className="hover:text-blue-600 transition">About</Link>
          </div>

          {/* Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-all group"
          >
            <Search size={18} className="group-hover:text-blue-600" />
            <span className="hidden sm:inline">Search...</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">

        {/* --- Hero Section --- */}
        <section className="mb-20 md:mb-32 relative">
          <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60 transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-teal-50 rounded-full blur-3xl opacity-60 transform -translate-x-1/4 translate-y-1/4"></div>

          <div className="text-center max-w-4xl mx-auto pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-8 uppercase tracking-widest shadow-sm">
              <Sparkles size={14} className="animate-pulse" />
              Elevating Creative Living
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Insights for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-teal-400">conscious</span> soul.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              A curated space for lifestyle, faith-based wisdom, and intentional digital well-being by Sophia Ukoni.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('latest-posts');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
              >
                Start Reading <ArrowRight size={20} />
              </button>
              <Link href="/about" className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* --- Pillars Section --- */}
        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Faith & Walk', desc: 'Exploring the beauty of a spiritual life in a modern world.', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: Palette, title: 'Creative Living', desc: 'Practical tips to ignite your imagination and daily inspiration.', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Anchor, title: 'Intentional Living', desc: 'Bridging the gap between digital noise and mindful presence.', color: 'text-teal-600', bg: 'bg-teal-50' },
            ].map((pillar, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className={`w-14 h-14 ${pillar.bg} ${pillar.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <pillar.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-gray-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Topics Explorer --- */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Explore Topics</h2>
              <p className="text-gray-500">Dive into what matters most to you.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'default').slice(0, 6).map(([cat, colorClass]) => (
              <Link
                key={cat}
                href={`/articles?category=${encodeURIComponent(cat)}`}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-blue-100 hover:shadow-lg transition-all group text-center"
              >
                <div className={`w-12 h-12 rounded-full ${colorClass.split(' ')[0]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Zap size={20} />
                </div>
                <span className="text-sm font-bold text-gray-900">{cat}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* --- Meet the Author (Sophia) --- */}
        <section className="mb-24 p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-blue-600 to-teal-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest">About the Author</span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">I'm Sophia, and I'm here to inspire your journey.</h2>
              <p className="text-lg opacity-90 leading-relaxed font-medium">
                Through Ukoni, I share my walk of faith, my creative pursuits, and my mission to live a more intentional, digital-balanced life. I believe everyone has a story worth telling and a light worth sharing.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/about" className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
                  Read My Story
                </Link>
                <div className="flex items-center gap-4 px-4">
                  <a href="https://www.instagram.com/ukoni_sophia" className="hover:scale-110 transition-transform"><Instagram /></a>
                  <a href="https://www.linkedin.com/in/adaeze-sophia-ukoni-1b6704a5" className="hover:scale-110 transition-transform"><Linkedin /></a>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] md:aspect-square w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl rotate-3 group hover:rotate-0 transition-transform duration-500 bg-white/20">
              {/* Note: In a real app we'd use a real author image here */}
              <div className="w-full h-full flex items-center justify-center bg-blue-100/20 backdrop-blur-sm">
                <img src="professional.png" alt="Author" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* --- Content Area --- */}
        <div id="latest-posts"></div>
        {(loading && !showSkeleton) ? null : (loading || (!posts.length && !featuredPost)) ? (
          // Show loading skeleton
          <>
            {/* Featured Post Skeleton */}
            <section className="mb-16 md:mb-24">
              <div className="grid md:grid-cols-12 gap-8 items-center bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                <div className="md:col-span-7 h-64 md:h-[400px] bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="md:col-span-5 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                  <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Latest Posts Skeleton */}
            <section className="mb-16 md:mb-24">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-bold text-gray-900">Latest Articles</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <div className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* --- Featured Post (Big Card) --- */}
            {loading ? (
              <section className="mb-16 md:mb-24">
                <div className="grid md:grid-cols-12 gap-8 items-center bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                  {/* Skeleton Image */}
                  <div className="md:col-span-7 h-64 md:h-[400px] bg-gray-200 animate-pulse rounded-2xl"></div>

                  {/* Skeleton Content */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                    </div>
                    <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </section>
            ) : featuredPost && (
              <section className="mb-16 md:mb-24">
                <div className="group relative grid md:grid-cols-12 gap-8 items-center bg-gray-50 rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Image Side */}
                  <div className="md:col-span-7 h-64 md:h-[400px] relative overflow-hidden rounded-2xl">
                    {featuredPost.featuredImageUrl ? (
                      <Image
                        src={getImageUrl(featuredPost.featuredImageUrl, { width: 800, height: 600, quality: 85 })}
                        alt={featuredPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 58vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                        placeholder="blur"
                        blurDataURL={generateBlurDataURL(800, 600)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FileText size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content Side */}
                  <div className="md:col-span-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${CATEGORY_COLORS[featuredPost.category || ''] || CATEGORY_COLORS.default}`}>
                        {featuredPost.category || 'Uncategorized'}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        5 min read
                      </span>
                    </div>

                    <Link href={`/articles/${featuredPost.slug}`}>
                      <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                    </Link>

                    <p className="text-gray-600 line-clamp-3">
                      {featuredPost.excerpt || 'Discover insights and ideas in this featured article.'}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {featuredPost.author.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{featuredPost.author.fullName}</p>
                          <p className="text-xs text-gray-500">{formatDate(featuredPost.publishedAt)}</p>
                        </div>
                      </div>
                      <Link href={`/articles/${featuredPost.slug}`} className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* --- Latest Posts Grid --- */}
            <section className="mb-16 md:mb-24">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-bold text-gray-900">Latest Articles</h3>
                {!loading && (
                  <Link href="/articles" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight size={14} />
                  </Link>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  // Skeleton for loading state
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="space-y-4">
                      <div className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  posts.map((post) => (
                    <article key={post.id} className="group flex flex-col h-full">
                      {/* Image */}
                      <Link href={`/articles/${post.slug}`} className="block overflow-hidden rounded-2xl mb-4 aspect-[4/3] relative">
                        {post.featuredImageUrl ? (
                          <Image
                            src={getImageUrl(post.featuredImageUrl, { width: 400, height: 300, quality: 80 })}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={generateBlurDataURL(400, 300)}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <FileText size={48} className="text-gray-400" />
                          </div>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-3 text-xs">
                          <span className={`px-2 py-1 rounded-md font-medium ${CATEGORY_COLORS[post.category || ''] || CATEGORY_COLORS.default}`}>
                            {post.category || 'Uncategorized'}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{formatDate(post.publishedAt)}</span>
                        </div>

                        <Link href={`/articles/${post.slug}`} className="mb-3 block">
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                        </Link>

                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                          {post.excerpt || 'Read this article to discover more insights and ideas.'}
                        </p>

                        {/* Author Mini */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {post.author.fullName.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-gray-900">{post.author.fullName}</span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {/* --- Newsletter --- */}
        <section className="bg-gray-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Stay in the loop</h2>
            <p className="text-gray-400">
              Join 23K+ subscribers getting the best content delivered to their inbox weekly. No spam, ever.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md sm:max-w-none mx-auto">
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none w-full sm:w-80"
                disabled={isSubscribing}
              />
              <button
                type="submit"
                disabled={isSubscribing || !email}
                className="px-6 py-3 font-bold rounded-lg transition w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribeMessage && <p className="text-green-400 text-sm mt-2">{subscribeMessage}</p>}
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-gray-100 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white">
              <Sparkles size={12} fill="currentColor" />
            </div>
            Ukoni
          </div>
          <div className="text-sm text-gray-500">
            &copy; 2026 Ukoni Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-400 items-center">
            <a href="https://www.linkedin.com/in/adaeze-sophia-ukoni-1b6704a5"><Linkedin className="w-5 h-5 hover:text-blue-900 cursor-pointer transition" /></a>
            <a href="https://www.instagram.com/ukoni_sophia"><Instagram size={20} className="hover:text-pink-600 cursor-pointer transition" /></a>

          </div>
        </div>
      </footer>
    </div>
  );
}