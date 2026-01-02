"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getApiUrl } from "@/lib/api";
import { getImageUrl } from "@/lib/image";
import VisitorsChart from "@/components/ui/VisitorsChart";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Edit,
  FileText,
  Heart,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

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

interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  userPosts: number;
  subscribers: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useEffect triggered, user:', user);
    if (user) {
      console.log('User is authenticated, fetching dashboard data...');
      fetchDashboardData();
    } else {
      console.log('User is not authenticated, skipping data fetch');
    }
  }, [user]);

  useEffect(() => {
    const fetchVisitorData = async () => {
  try {
    const response = await fetch(getApiUrl('api/v1/analytics/visitors'));
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch visitor data');
    }
    const data = await response.json();
    setVisitorData({
      currentPeriod: data.currentPeriod || [],
      previousPeriod: data.previousPeriod || []
    });
  } catch (err) {
    console.error('Error in fetchVisitorData:', err);
    setError(err instanceof Error ? err.message : 'An error occurred');
    // Set empty data on error to prevent type issues
    setVisitorData({ currentPeriod: [], previousPeriod: [] });
  } finally {
    setIsLoading(false);
  }
};

    fetchVisitorData();
  }, []);

  const fetchDashboardData = async () => {
    console.log('Starting fetchDashboardData');
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("access_token");
      console.log('Auth token from localStorage:', token ? 'Found' : 'Not found');
      const headers = new Headers({
        "Content-Type": "application/json",
        "Accept": "application/json"
      });
      
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
      
      // Fetch all data in parallel
      const postsUrl = getApiUrl("api/v1/posts");
      const commentsUrl = getApiUrl("api/v1/comments");
      const subscribersUrl = getApiUrl("api/v1/subscribers/count");
      
      console.log('Fetching from URLs:', { postsUrl, commentsUrl, subscribersUrl });
      
      const [postsResponse, commentsResponse, subscribersResponse] = await Promise.all([
        fetch(postsUrl, { headers }),
        fetch(commentsUrl, { headers }),
        fetch(subscribersUrl, { headers })
      ]);
      
      console.log('API responses:', {
        postsStatus: postsResponse.status,
        commentsStatus: commentsResponse.status,
        subscribersStatus: subscribersResponse.status
      });
      
      // Process posts response
      if (!postsResponse.ok) {
        const errorText = await postsResponse.text();
        console.error('Failed to fetch posts:', postsResponse.status, errorText);
        throw new Error(`Failed to fetch posts: ${postsResponse.status} ${errorText}`);
      }
      const postsData = await postsResponse.json();
      console.log('Posts data received:', { count: postsData.length, sample: postsData[0] });
      
      // Calculate stats from posts data
      const totalPosts = postsData.length;
      const userPosts = postsData.filter((post: Post) => post.author_id === Number(user?.id)).length;
      const totalViews = postsData.reduce((sum: number, post: Post) => sum + (post.view_count || 0), 0);
      
      // Process comments response
      let totalComments = 0;
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        totalComments = Array.isArray(commentsData) ? commentsData.length : 0;
        console.log('Comments data received:', { count: totalComments });
      } else {
        console.error('Failed to fetch comments:', commentsResponse.status, await commentsResponse.text());
      }
      
      // Process subscribers response
      let subscribers = 0;
      if (subscribersResponse.ok) {
        const subsData = await subscribersResponse.json();
        subscribers = subsData.count || 0;
        console.log('Subscribers data received:', { count: subscribers });
      } else {
        console.error('Failed to fetch subscribers:', subscribersResponse.status, await subscribersResponse.text());
      }
      
      // Update state
      setStats({
        totalPosts,
        totalComments,
        totalViews,
        userPosts,
        subscribers,
      });
      
      // Get recent posts (last 4)
      const recent = Array.isArray(postsData)
        ? postsData
            .sort((a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 4)
        : [];
      
      setRecentPosts(recent);
      
    } catch (error) {
      console.error("Error in fetchDashboardData:", error);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
      // Set empty data on error to prevent type issues
      setStats({
        totalPosts: 0,
        totalComments: 0,
        totalViews: 0,
        userPosts: 0,
        subscribers: 0,
      });
      setRecentPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <Spinner/>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Header */}
      <header className="flex justify-between items-center">
        {/* Search Bar */}
        <div className="relative w-96">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search for anything"
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-100">
            <CalendarDays size={16} />
            <span>Today, October 29</span>
          </div>
          <div className="relative">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          {/* User Avatar Placeholder */}
           <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden relative">
             <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`} alt="Profile" className="object-cover"/>
           </div>
        </div>
      </header>

      {/* Welcome Section & Profile Card Row */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Welcome Back! <span>👋</span>
          </h1>
          <p className="text-gray-500 text-sm">Good evening!</p>
        </div>
      </div>

      {/* Top Content Row: Profile + Stats */}
      <div className="grid grid-cols-12 gap-8">
        {/* Profile Card (Span 4) */}
        <div className="col-span-4 bg-white rounded-[2rem] p-6 relative mt-12 border border-gray-50 shadow-sm">
          {/* Profile Image */}
          <div className="absolute -top-24 right-4 w-48 h-52 overflow-visible">
             <div className="w-full h-full relative">
                <Image src="/professional.png" alt="Profile" fill sizes="(max-width: 768px) 100vw, 50vw" loading="eager" />
             </div>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
            <p className="text-gray-400 text-sm">Writer/Author</p>
          </div>

          <div className="flex gap-8 mt-8">
            <div className="relative group">
              <span className="text-2xl font-bold text-gray-800 block">{stats.userPosts}</span>
              <span className="text-gray-400 text-xs">Your Posts</span>
              <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Total posts you've written
              </div>
            </div>
            <div className="relative group">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-gray-800">{stats.subscribers}</span>
                <span className="text-xs text-green-500 font-medium">
                  {stats.subscribers > 0 ? '↑ Active' : ''}
                </span>
              </div>
              <span className="text-gray-400 text-xs">Subscribers</span>
              <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Total newsletter subscribers
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards (Span 8 - Grid of 3) */}
        <div className="col-span-8 grid grid-cols-3 gap-6">
          {/* Card 1: Total Post */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-gray-50 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mb-4">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-gray-400 text-sm block mb-1">
                Total Post
              </span>
              <span className="text-2xl font-bold text-blue-500">{stats.totalPosts}</span>
            </div>
          </div>

          {/* Card 2: Total Pages */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-gray-50 shadow-sm">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 mb-4">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-gray-400 text-sm block mb-1">
                Total Pages
              </span>
              <span className="text-2xl font-bold text-pink-500">{stats.totalPosts}</span>
            </div>
          </div>

          {/* Card 3: Comments */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-gray-50 shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-500 mb-4 group-hover:bg-teal-50 transition-colors">
              <MessageCircle size={20} />
            </div>
            <div>
              <span className="text-gray-400 text-sm block mb-1">
                Total Comments
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-teal-500">{stats.totalComments}</span>
                {stats.totalComments > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full">
                    {stats.totalComments === 1 ? '1 comment' : `${stats.totalComments} comments`}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href="/admin/comments" className="text-xs text-teal-500 hover:underline">
                View all →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Content Row: Chart + Blog List */}
      <div className="grid grid-cols-12 gap-8 mt-4">
        {/* Chart Section (Span 7) */}
        <div className="col-span-7 bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Visitors</h3>
              <div className="flex gap-8 mt-4">
                <div>
                  <span className="text-2xl font-bold text-gray-800 block">
                    {visitorData?.currentPeriod.reduce((sum: number, day: { count: number }) => sum + day.count, 0) || '0'}
                  </span>
                  <span className="text-gray-400 text-xs">Total Visitors</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800 block flex items-center gap-1">
                    {visitorData?.currentPeriod.length ? 
                      `${Math.round((visitorData.currentPeriod[visitorData.currentPeriod.length - 1].count / 
                        (visitorData.previousPeriod[visitorData.previousPeriod.length - 1]?.count || 1) - 1) * 100)}%` 
                      : '0%'}
                    <span className="text-green-500 text-lg">↑</span>
                  </span>
                  <span className="text-gray-400 text-xs">
                    Visitors Increase
                  </span>
                </div>
              </div>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> This period
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Previous period
              </div>
            </div>
          </div>
          {/* The Chart Component */}
          <VisitorsChart 
            data={visitorData} 
            loading={isLoading} 
            error={error} 
          />
        </div>

        {/* Recent Blogs Section (Span 5) */}
        <div className="col-span-5 bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Recent Blogs</h3>
            <Link 
              href="/admin/posts"
              className="flex items-center gap-1 text-blue-500 text-sm font-medium px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition"
            >
              <Plus size={14} /> Add New
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post, index) => {
                const colors = ["bg-pink-100", "bg-teal-100", "bg-blue-100", "bg-orange-100"];
                return (
                  <BlogItem
                    key={post.id}
                    title={post.title}
                    comments={stats.totalComments} // Use actual comments count from stats
                    views={post.view_count}
                    color={colors[index % colors.length]}
                    slug={post.slug}
                    status={post.status}
                    featured_image={post.featured_image}
                    created_at={post.created_at}
                  />
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent posts found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BlogItemProps {
  title: string;
  comments: number;
  views: number;
  color?: string;
  slug: string;
  status?: string;
  featured_image?: string | null;
  created_at?: string;
}

function BlogItem({
  title,
  comments,
  views,
  color = 'bg-gray-200',
  slug,
  status,
  featured_image,
  created_at
}: BlogItemProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (featured_image) {
      setImageUrl(getImageUrl(featured_image));
      // Format the image URL properly
      let formattedUrl = featured_image;
      if (!featured_image.startsWith('http') && !featured_image.startsWith('blob:')) {
        // Remove any leading slashes to prevent double slashes
        const cleanPath = featured_image.replace(/^\/+/, '');
        formattedUrl = getApiUrl(cleanPath);
      }
      setImageUrl(formattedUrl);
    } else {
      setImageUrl(null);
    }
  }, [featured_image]);

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Thumbnail */}
        <div className="w-16 h-12 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden">
          {imageUrl && !imageError ? (
            <Image 
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized={imageUrl.startsWith('http')}
            />
          ) : (
            <div className={`w-full h-full ${color} flex items-center justify-center`}>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {title}
            </h4>
            {status && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            {created_at && (
              <span className="flex items-center gap-1">
                <CalendarDays size={12} /> {formatDate(created_at)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageCircle size={12} /> {comments} Comments
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
              {views} Views
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link 
          href={`/admin/posts/${slug}`}
          className="text-gray-400 hover:text-blue-600 transition flex items-center gap-1 text-xs px-3 py-1.5 rounded-md hover:bg-blue-50"
          title="Edit post"
        >
          <Edit size={14} /> <span className="hidden sm:inline">Edit</span>
        </Link>
      </div>
    </div>
  );
}