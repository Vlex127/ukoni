"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";
import VisitorsChart from "@/components/ui/VisitorsChart";
import {
  BookOpen,
  CalendarDays,
  Edit,
  FileText,
  MessageCircle,
  Plus,
  Users,
  Eye,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

// ... [Keep Interfaces Post, DashboardStats, VisitorData, etc. exactly the same] ...
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
  metaTitle: string | null;
  metaDescription: string | null;
  viewCount: number;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  author: {
    id: string;
    username: string;
    fullName: string | null;
  };
}

interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  userPosts: number;
  subscribers: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
    userPosts: 0,
    subscribers: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  interface VisitorData {
    date: string;
    count: number;
  }

  interface VisitorChartData {
    currentPeriod: VisitorData[];
    previousPeriod: VisitorData[];
  }

  const [visitorData, setVisitorData] = useState<VisitorChartData>({ currentPeriod: [], previousPeriod: [] });
  const [topPages, setTopPages] = useState<Array<{ path: string; views: number; percentage: number; title?: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = [
    'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-pink-200',
    'bg-yellow-200', 'bg-indigo-200', 'bg-red-200', 'bg-orange-200'
  ];

  useEffect(() => {
    if (session) fetchDashboardData();
  }, [session]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const headers = new Headers({ "Content-Type": "application/json" });
        const response = await fetch('/api/analytics', { headers });

        if (!response.ok) throw new Error('Failed to fetch visitor data');

        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];

        setVisitorData({
          currentPeriod: [{
            date: today,
            count: data.current_period?.total_visitors || 0
          }],
          previousPeriod: [{
            date: today,
            count: data.previous_period?.total_visitors || 0
          }]
        });
        setTopPages(data.top_pages || []);
      } catch (err) {
        console.error(err);
        setVisitorData({ currentPeriod: [], previousPeriod: [] });
      } finally {
        setIsLoading(false);
      }
    };
    fetchVisitorData();
  }, []);

  const fetchDashboardData = async () => {
    if (!session) {
      console.warn("AdminDashboard: No session available, aborting fetch.");
      return;
    }

    setLoading(true);
    try {
      const postsUrl = getApiUrl("posts");
      const commentsUrl = getApiUrl("comments");
      const subscribersUrl = getApiUrl("subscribers");

      const [postsRes, commentsRes, subsRes] = await Promise.all([
        fetch(postsUrl, { cache: 'no-store' }),
        fetch(commentsUrl, { cache: 'no-store' }),
        fetch(subscribersUrl, { cache: 'no-store' })
      ]);

      const postsData = await postsRes.json();
      const commentsData = await commentsRes.json();
      const subsData = await subsRes.json();

      const postsArray = Array.isArray(postsData) ? postsData : postsData.posts || [];

      setStats({
        totalPosts: postsArray.length,
        totalComments: Array.isArray(commentsData) ? commentsData.length : 0,
        totalViews: postsArray.reduce((acc: number, post: Post) => acc + (post.viewCount || 0), 0),
        userPosts: postsArray.filter((p: Post) => p.authorId === session?.user?.id).length,
        subscribers: Array.isArray(subsData) ? subsData.length : (subsData.count || 0)
      });

      setRecentPosts(postsArray.slice(0, 4));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-10">

      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
        {/* Left Side: Page Title or Breadcrumb */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs font-medium">Pages / Dashboard</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Main Dashboard</h2>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
            <CalendarDays size={16} />
            <span className="whitespace-nowrap">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-3">


            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 overflow-hidden relative border-2 border-white shadow-sm">
              <img
                src={`https://ui-avatars.com/api/?name=${session?.user?.username}&background=random`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{session?.user?.username || 'Writer'}</span> <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-gray-500 text-sm">Here is what's happening with your blog today.</p>
      </div>

      {/* Main Grid: Profile + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

        {/* Profile Card (Span 4) */}
        <div className="col-span-1 lg:col-span-4 mt-6 lg:mt-6">
          <div className="bg-white rounded-[2rem] p-6 relative border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Profile Image */}
            <div className="mb-6 relative">
              <div className="w-24 h-24 rounded-2xl bg-gray-50 p-1 shadow-inner">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  {/* Fallback or real image logic can go here - simplified for demo */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                    <img src="/professional.png" alt="Sophia Ukoni" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                Online
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{session?.user?.username || 'Sophia Ukoni'}</h2>
              <p className="text-gray-400 text-sm font-medium">Writer & Content Creator</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-blue-50 p-4 rounded-2xl text-center">
                <span className="text-2xl font-bold text-blue-600 block mb-1">{stats.userPosts}</span>
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Posts</span>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl text-center">
                <span className="text-2xl font-bold text-indigo-600 block mb-1">{stats.subscribers}</span>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Subs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards (Span 8) */}
        <div className="col-span-1 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-0 lg:mt-6 cursor-default">
          <StatCard
            icon={<BookOpen size={24} />}
            label="Total Posts"
            value={stats.totalPosts}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            icon={<Eye size={24} />}
            label="Total Views"
            value={stats.totalViews}
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
          <StatCard
            icon={<MessageCircle size={24} />}
            label="Comments"
            value={stats.totalComments}
            color="text-emerald-600"
            bg="bg-emerald-50"
            link="/admin/comments"
          />
        </div>
      </div>

      {/* Bottom Row: Visitor Stats + Blog List */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">

        {/* Visitor Stats Section (Span 7) */}
        <div className="col-span-1 xl:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">Visitor Analytics</h3>
              <p className="text-gray-500 text-sm mt-1">Today's visitor count</p>
            </div>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-1 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
            >
              View Details
            </Link>
          </div>

          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye size={32} className="text-blue-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-800">
                {visitorData.currentPeriod[0]?.count || 0}
              </div>
              <p className="text-gray-500 text-sm mt-2">Visitors Today</p>
            </div>
          </div>
        </div>

        {/* Recent Blogs Section (Span 5) */}
        <div className="col-span-1 xl:col-span-5 bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Recent Blogs</h3>
            <Link
              href="/admin/posts"
              className="flex items-center gap-1 text-blue-600 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
            >
              <Plus size={12} /> New Post
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[350px] sm:max-h-[400px] pr-2 custom-scrollbar">
            {recentPosts.length > 0 ? (
              recentPosts.map((post, index) => (
                <BlogItem
                  key={post.id}
                  title={post.title}
                  comments={0}
                  views={post.viewCount}
                  color={colors[index % colors.length]}
                  slug={post.slug}
                  status={post.status}
                  featuredImage={post.featuredImage}
                  featuredImageUrl={post.featuredImageUrl}
                  createdAt={post.createdAt}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-gray-400 text-sm">
                <FileText size={28} className="mb-2 opacity-50" />
                <p>No recent posts found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Pages Section */}
      {topPages.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {topPages.map((item, index) => (
              <div key={index} className="flex items-center group/item">
                <div className="flex-1 min-w-0 mr-4">
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-800 truncate block hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    {item.title || item.path}
                    <ExternalLink size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </a>
                  <div className="text-[10px] text-gray-400 truncate">{item.path}</div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 text-right">{item.percentage}%</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">{item.views.toLocaleString()} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub Components ---

const StatCard = ({ icon, label, value, color, bg, link }: any) => (
  <div className={`bg-white rounded-[2rem] p-6 flex flex-col justify-between border border-gray-100 shadow-sm hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 group relative ${link ? 'cursor-pointer' : ''}`}>
    <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center ${color} mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">
        {label}
      </span>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
    </div>
    {link && (
      <Link href={link} className="absolute inset-0 z-10" aria-label={`View ${label}`} />
    )}
  </div>
);

// Copied BlogItem logic, added responsivness
interface BlogItemProps {
  title: string;
  comments: number;
  views: number;
  color?: string;
  slug: string;
  status?: string;
  featuredImage?: string | null;
  featuredImageUrl?: string | null;
  createdAt?: string;
}

function BlogItem({
  title,
  comments,
  views,
  color = 'bg-gray-200',
  slug,
  status,
  featuredImage,
  featuredImageUrl,
  createdAt
}: BlogItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (featuredImageUrl) setImageUrl(featuredImageUrl);
    else if (featuredImage) {
      const cleanPath = featuredImage.replace(/^\/+/, '');
      setImageUrl(getApiUrl(cleanPath));
    }
  }, [featuredImage, featuredImageUrl]);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Thumbnail */}
        <div className="w-12 h-12 sm:w-14 sm:h-16 rounded-xl bg-gray-200 flex-shrink-0 relative overflow-hidden">
          {imageUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-4 h-4 bg-blue-200 rounded animate-pulse"></div>
                </div>
              )}
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                onLoadingComplete={() => setImageLoading(false)}
                unoptimized={imageUrl.startsWith('http')}
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
              />
            </>
          ) : (
            <div className={`w-full h-full ${color} flex items-center justify-center`}>
              <span className="text-sm sm:text-lg font-bold opacity-40">{title.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 mb-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                {title}
              </h4>
              {status && (
                <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium
                  ${status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                `}>
                  {status}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CalendarDays size={10} />
              {createdAt ? new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              {views} Views
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/admin/posts/${slug}`}
        className="ml-2 p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
      >
        <Edit size={14} className="sm:size-16" />
      </Link>
    </div>
  );
}