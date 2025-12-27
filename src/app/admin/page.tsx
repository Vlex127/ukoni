"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
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
  totalLikes: number;
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
    totalLikes: 0,
    userPosts: 0,
    subscribers: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      // Fetch posts
      const postsResponse = await fetch("http://localhost:8000/api/v1/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        
        // Calculate stats from posts data
        const totalPosts = postsData.length;
        const userPosts = postsData.filter((post: Post) => post.author_id === Number(user?.id)).length;
        const totalViews = postsData.reduce((sum: number, post: Post) => sum + post.view_count, 0);
        
        // Get recent posts (last 4)
        const recent = postsData
          .sort((a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4);

        setStats(prev => ({
          ...prev,
          totalPosts,
          userPosts,
          totalViews,
        }));
        setRecentPosts(recent);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
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
          {/* 3D Character Illustration Placeholder */}
          <div className="absolute -top-24 right-4 w-48 h-52 overflow-visible">
             {/* Replace with actual 3D image in public folder */}
             <div className="w-full h-full bg-blue-100 rounded-xl flex items-end justify-center pb-4 text-xs text-blue-400">
                3D Char Placeholder
                {/* <Image src="/3d-character.png" alt="Character" fill className="object-contain" /> */}
             </div>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
            <p className="text-gray-400 text-sm">Writer/Author</p>
          </div>

          <div className="flex gap-8 mt-8">
            <div>
              <span className="text-2xl font-bold text-gray-800 block">{stats.userPosts}</span>
              <span className="text-gray-400 text-xs">Total Post</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800 block">
                {stats.subscribers || "23K"}
              </span>
              <span className="text-gray-400 text-xs">Subscriber</span>
            </div>
          </div>
        </div>

        {/* Stats Cards (Span 8 - Grid of 4) */}
        <div className="col-span-8 grid grid-cols-4 gap-6">
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
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-gray-50 shadow-sm">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-500 mb-4">
              <MessageCircle size={20} />
            </div>
            <div>
              <span className="text-gray-400 text-sm block mb-1">
                Comments
              </span>
              <span className="text-2xl font-bold text-teal-500">{stats.totalComments}</span>
            </div>
          </div>

          {/* Card 4: Total Likes (Pop-out style) */}
          <div className="relative bg-white rounded-2xl p-5 flex flex-col justify-end shadow-lg transform -translate-y-2 border border-gray-50">
            {/* Floating Heart Badge */}
            <div className="absolute -top-3 -right-3 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm z-10">
              <Heart size={12} fill="currentColor" /> {stats.totalLikes}
            </div>

             <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-auto">
                {/* Empty spacer to match height */}
            </div>

            <div>
              <span className="text-gray-400 text-sm block mb-1">
                Total Likes
              </span>
              <span className="text-2xl font-bold text-red-500">{stats.totalLikes}</span>
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
                    250K
                  </span>
                  <span className="text-gray-400 text-xs">New Visitors</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800 block flex items-center gap-1">
                    2.5% <span className="text-green-500 text-lg">↑</span>
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
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> This year
              </div>
               <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Previous year
              </div>
            </div>
          </div>
          {/* The Chart Component */}
          <VisitorsChart />
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
                    comments={0} // TODO: Fetch actual comment count
                    views={post.view_count}
                    color={colors[index % colors.length]}
                    slug={post.slug}
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

// Helper Component for Blog List Items
function BlogItem({
  title,
  comments,
  views,
  color,
  slug,
}: {
  title: string;
  comments: number;
  views: number;
  color: string;
  slug: string;
}) {
  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex items-center gap-3">
        {/* Thumbnail Placeholder */}
        <div className={`w-12 h-10 rounded-lg ${color} flex-shrink-0 relative overflow-hidden`}>
            {/* Uncomment and add image: <Image src="/blog1.jpg" fill className="object-cover" /> */}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 truncate w-48">
            {title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <MessageCircle size={12} /> {comments} Comments
            </span>
            <span className="flex items-center gap-1">
              {/* Using a generic icon for views */}
              <div className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">
                 <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
               {views} Views
            </span>
          </div>
        </div>
      </div>
      <Link 
        href={`/admin/posts/${slug}`}
        className="text-gray-400 hover:text-blue-500 transition flex items-center gap-1 text-xs"
      >
        <Edit size={14} /> Edit
      </Link>
    </div>
  );
}