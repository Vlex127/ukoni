"use client";

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
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  emailVerified: boolean;
  admin: boolean;
}

interface Stats {
  totalPosts: number;
  totalPages: number;
  totalComments: number;
  totalViews: number;
  totalLikes: number;
}

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalPages: 0,
    totalComments: 0,
    totalViews: 0,
    totalLikes: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        
        if (session.status === "loading") {
          return;
        }
        
        if (!session.data?.user?.id) {
          console.log("No session found - redirecting to login");
          setIsLoading(false);
          router.push("/login");
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${session.data.user.id}`, // NextAuth uses user ID in session
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User data:", data);
          setUser(data.user);
        } else {
          console.error("Failed to fetch user:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        console.log('Fetching stats...');
        const response = await fetch("/api/admin/stats");
        console.log('Stats response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Stats data received:', data);
          setStats(data);
        } else {
          const errorData = await response.json();
          console.error('Stats API error:', errorData);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchUser();
    fetchStats();
  }, [session]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-8 pt-6">
      {isLoading ? (
        // Loading State
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <Spinner className="size-8" />
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* --- Top Header --- */}
          <header className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search for anything"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
              />
            </div>
            {/* Right Side Actions */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-3 rounded-2xl shadow-sm">
                <CalendarDays size={16} className="text-blue-500" />
                <span className="font-medium whitespace-nowrap">Today, Oct 29</span>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="relative p-2 bg-white rounded-full shadow-sm">
                  <Bell size={20} className="text-gray-400" />
                  <span className="absolute top-0 right-0 w-3 h-3 border-2 border-white bg-red-500 rounded-full"></span>
                </div>
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden relative flex-shrink-0">
                  <a href="/admin/profile">
                    {user?.picture ? (
                      <Image
                        src={user.picture}
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* --- Welcome Section --- */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
              {user?.name ? `Welcome ${user.name}!` : "Welcome!"} <span className="animate-pulse">👋</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here is what's happening with your blog today.
            </p>
          </div>

          {/* --- Top Content Row: Profile + Stats --- */}
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            {/* === FIXED PROFILE CARD === */}
            <div className="col-span-12 lg:col-span-4 relative group">
              <div className="h-full min-h-[300px] bg-gradient-to-br from-blue-600 to-blue-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden flex flex-col justify-between">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight min-h-[32px]">
                        {user?.name}
                      </h2>
                      <p className="text-blue-100 text-sm font-medium opacity-90 break-all min-h-[20px]">
                        {user?.email}
                      </p>
                    </div>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="flex gap-8 mt-12">
                    <div>
                      <span className="text-3xl font-bold block">{stats.totalPosts}</span>
                      <span className="text-blue-100 text-xs uppercase tracking-wider opacity-80">
                        Posts
                      </span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold block">{stats.totalViews.toLocaleString()}</span>
                      <span className="text-blue-100 text-xs uppercase tracking-wider opacity-80">
                        Views
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3D Character Placeholder */}
                <div className="absolute bottom-0 right-0 w-56 h-64 pointer-events-none">
                  <div className="w-full h-full relative">
                    <div className="absolute bottom-0 right-4 w-40 h-48 bg-gradient-to-t from-black/20 to-transparent rounded-b-2xl blur-xl"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* === Stats Cards === */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                  <BookOpen size={22} />
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium block mb-1">
                    Total Post
                  </span>
                  <span className="text-2xl font-bold text-gray-800">{stats.totalPosts}</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-4">
                  <FileText size={22} />
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium block mb-1">
                    Total Pages
                  </span>
                  <span className="text-2xl font-bold text-gray-800">{stats.totalPages}</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500 mb-4">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium block mb-1">
                    Comments
                  </span>
                  <span className="text-2xl font-bold text-gray-800">{stats.totalComments.toLocaleString()}</span>
                </div>
              </div>

              {/* Card 4 (Pop-out style) */}
              <div className="relative bg-white rounded-3xl p-6 flex flex-col justify-end shadow-xl shadow-gray-100 transform xl:-translate-y-4 border border-gray-50">
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md z-10">
                  <Heart size={12} fill="currentColor" /> +{stats.totalLikes > 0 ? Math.floor(stats.totalLikes / 1000) : 0}K
                </div>
                <div className="w-12 h-12 mb-4 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                  <Heart size={22} />
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium block mb-1">
                    Total Likes
                  </span>
                  <span className="text-2xl font-bold text-gray-800">{stats.totalLikes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Bottom Content: Chart + Blog List --- */}
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            {/* Chart Section */}
            <div className="col-span-12 lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Visitors Analytics
                  </h3>
                  <div className="flex gap-8 mt-2">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">250K</span>
                      <span className="text-gray-400 text-xs ml-2">
                        Total Visits
                      </span>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-xl w-full sm:w-auto justify-center sm:justify-start">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>{" "}
                    2024
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span>{" "}
                    2023
                  </div>
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                 <div className="min-w-[300px]">
                    <VisitorsChart />
                 </div>
              </div>
            </div>

            {/* Recent Blogs Section */}
            <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col h-[500px] lg:h-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Recent Articles</h3>
                <button className="flex items-center gap-2 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100 transition">
                  <Plus size={14} /> NEW
                </button>
              </div>

              <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                <BlogItem
                  title="Clever Ways to Celebrate Christmas..."
                  comments={325}
                  views={9546}
                  color="bg-pink-100 text-pink-600"
                />
                <BlogItem
                  title="Setting Intentions Instead of Resolutions..."
                  comments={25}
                  views={565}
                  color="bg-teal-100 text-teal-600"
                />
                <BlogItem
                  title="Physical Development Activities for..."
                  comments={35}
                  views={156}
                  color="bg-blue-100 text-blue-600"
                />
                <BlogItem
                  title="Liki Trike - A Compact Trike with the Big..."
                  comments={545}
                  views={9158}
                  color="bg-orange-100 text-orange-600"
                />
              </div>
            </div>
          </div>
        </>
      )} 
    </div>
  );
}

// Helper Component for Blog List Items
function BlogItem({
  title,
  comments,
  views,
  color,
}: {
  title: string;
  comments: number;
  views: number;
  color: string;
}) {
  return (
    <div className="flex items-start justify-between group cursor-pointer">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div
          className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-transform group-hover:scale-105`}
        >
          {/* Icon placeholder if no image */}
          <FileText size={20} className="opacity-50" />
        </div>

        <div className="flex flex-col justify-center">
          <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition">
            {title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <MessageCircle size={12} /> {comments}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              {views} views
            </span>
          </div>
        </div>
      </div>
      <button className="text-gray-300 hover:text-blue-500 transition pt-2">
        <Edit size={16} />
      </button>
    </div>
  );
}