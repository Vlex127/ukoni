"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";
import VisitorsChart from "@/components/ui/VisitorsChart";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Edit,
  FileText,
  MessageCircle,
  Plus,
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
    setLoading(true);
    try {
      const postsUrl = "/api/posts";
      const commentsUrl = "/api/comments";
      const subscribersUrl = "/api/subscribers";
      
      const [postsRes, commentsRes, subsRes] = await Promise.all([
        fetch(postsUrl), fetch(commentsUrl), fetch(subscribersUrl)
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
        subscribers: subsData.count || 0
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
        <Spinner/>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-10">
      
      {/* Top Header */}
      <header className="flex justify-between items-center w-full">
        {/* Left Side: Page Title or Breadcrumb (Optional, kept empty for now) */}
        <div className="flex flex-col">
           <span className="text-gray-400 text-xs font-medium">Pages / Dashboard</span>
           <h2 className="text-xl font-bold text-gray-800">Main Dashboard</h2>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
            <CalendarDays size={16} />
            <span className="whitespace-nowrap">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric'})}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer bg-white p-2 rounded-full shadow-sm hover:shadow-md transition">
              <Bell size={20} className="text-gray-400 hover:text-gray-600 transition" />
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border-2 border-white shadow-sm">
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          Welcome Back! <span className="animate-wave">👋</span>
        </h1>
        <p className="text-gray-500 text-sm">Here is what's happening with your blog today.</p>
      </div>

      {/* Main Grid: Profile + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Profile Card (Span 4) */}
        <div className="col-span-1 lg:col-span-4 mt-20 lg:mt-12">
          <div className="bg-white rounded-[2rem] p-6 relative border border-gray-100 shadow-sm h-full flex flex-col justify-end">
            {/* Profile Image - Popping out */}
            <div className="absolute -top-20 right-1/2 translate-x-1/2 lg:translate-x-0 lg:-right-2 lg:right-4 w-40 h-44 md:w-48 md:h-52">
               <div className="w-full h-full relative drop-shadow-xl">
                  {/* Using standard img for reliability with external assets, or stick to Next Image */}
                  <Image src="/professional.png" alt="Profile" fill className="object-contain" priority />
               </div>
            </div>

            <div className="mt-20 lg:mt-4 text-center lg:text-left">
              <h2 className="text-xl font-bold text-gray-800 truncate">{session?.user?.username || 'Admin'}</h2>
              <p className="text-gray-400 text-sm">Writer/Author</p>
            </div>

            <div className="flex justify-center lg:justify-start gap-8 mt-8 pb-2">
              <div className="text-center lg:text-left">
                <span className="text-2xl font-bold text-gray-800 block">{stats.userPosts}</span>
                <span className="text-gray-400 text-xs uppercase tracking-wider">Posts</span>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1">
                  <span className="text-2xl font-bold text-gray-800">{stats.subscribers}</span>
                </div>
                <span className="text-gray-400 text-xs uppercase tracking-wider">Subscribers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards (Span 8) */}
        <div className="col-span-1 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-0 lg:mt-12">
          <StatCard 
            icon={<BookOpen size={20} />} 
            label="Total Posts" 
            value={stats.totalPosts} 
            color="text-blue-500" 
            bg="bg-blue-100" 
          />
          <StatCard 
            icon={<FileText size={20} />} 
            label="Total Pages" 
            value={stats.totalPosts} // Assuming pages logic
            color="text-pink-500" 
            bg="bg-pink-100" 
          />
          <StatCard 
            icon={<MessageCircle size={20} />} 
            label="Total Comments" 
            value={stats.totalComments} 
            color="text-teal-500" 
            bg="bg-teal-100" 
            link="/admin/comments"
          />
        </div>
      </div>

      {/* Bottom Row: Chart + Blog List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Chart Section (Span 7) */}
        <div className="col-span-1 lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[400px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Visitors Analytics</h3>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Current
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Previous
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <VisitorsChart 
              data={visitorData} 
              loading={isLoading} 
              error={error} 
            />
          </div>
        </div>

        {/* Recent Blogs Section (Span 5) */}
        <div className="col-span-1 lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Recent Blogs</h3>
            <Link 
              href="/admin/posts"
              className="flex items-center gap-1 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
            >
              <Plus size={14} /> New Post
            </Link>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
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
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                <FileText size={32} className="mb-2 opacity-50"/>
                <p>No recent posts found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

const StatCard = ({ icon, label, value, color, bg, link }: any) => (
  <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center ${color} mb-4`}>
      {icon}
    </div>
    <div>
      <span className="text-gray-400 text-xs font-medium uppercase tracking-wide block mb-1">
        {label}
      </span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
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
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-200 flex-shrink-0 relative overflow-hidden">
          {imageUrl && !imageError ? (
            <Image 
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
              unoptimized={imageUrl.startsWith('http')}
            />
          ) : (
            <div className={`w-full h-full ${color} flex items-center justify-center`}>
              <span className="text-lg font-bold opacity-40">{title.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-800 truncate max-w-full">
              {title}
            </h4>
            {status && (
              <span className={`self-start sm:self-auto text-[10px] px-2 py-0.5 rounded-full font-medium
                ${status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
              `}>
                {status}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CalendarDays size={12} /> 
              {createdAt ? new Date(createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : ''}
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
        className="ml-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Edit size={16} />
      </Link>
    </div>
  );
}