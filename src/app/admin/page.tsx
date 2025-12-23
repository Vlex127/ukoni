"use client"
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
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
      
      {/* --- Top Header --- */}
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
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-3 rounded-2xl shadow-sm">
            <CalendarDays size={16} className="text-blue-500" />
            <span className="font-medium">Today, Oct 29</span>
          </div>
          <div className="relative p-2 bg-white rounded-full shadow-sm">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-0 right-0 w-3 h-3 border-2 border-white bg-red-500 rounded-full"></span>
          </div>
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden relative">
             <a href="/admin/profile">
             {/*get iamge from user db */}
             <Image src="/avatar.jpg" alt="User" fill className="object-cover"/> 
             </a>
          </div>
        </div>
      </header>

      {/* --- Welcome Section --- */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Welcome Back! <span className="animate-pulse">👋</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here is what's happening with your blog today.</p>
      </div>

      {/* --- Top Content Row: Profile + Stats --- */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* === FIXED PROFILE CARD (Span 4) === */}
        <div className="col-span-12 lg:col-span-4 relative group">
          {/* Main Card Background - Now a Gradient */}
          <div className="h-full bg-gradient-to-br from-blue-600 to-blue-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden flex flex-col justify-between">
            
            {/* Background Pattern Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight">Henry Qells</h2>
                    <p className="text-blue-100 text-sm font-medium opacity-90">Writer & Editor</p>
                 </div>
                 <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition">
                    <MoreHorizontal size={20} />
                 </button>
              </div>
              
              <div className="flex gap-8 mt-12">
                <div>
                  <span className="text-3xl font-bold block">32</span>
                  <span className="text-blue-100 text-xs uppercase tracking-wider opacity-80">Posts</span>
                </div>
                <div>
                  <span className="text-3xl font-bold block">23K</span>
                  <span className="text-blue-100 text-xs uppercase tracking-wider opacity-80">Subs</span>
                </div>
              </div>
            </div>

            {/* 3D Character - Fixed: Removed the box, increased size, positioned absolutely */}
            {/* Make sure your image is a PNG with transparent background */}
            <div className="absolute bottom-0 right-0 w-56 h-64 pointer-events-none">
                <div className="w-full h-full relative">
                   {/* Placeholder if no image */}
                   <div className="absolute bottom-0 right-4 w-40 h-48 bg-gradient-to-t from-black/20 to-transparent rounded-b-2xl blur-xl"></div>
                   {/* <Image src="/3d-character.png" alt="Character" fill className="object-contain object-bottom drop-shadow-2xl" /> */}
                </div>
            </div>
          </div>
        </div>

        {/* === Stats Cards (Span 8) === */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
              <BookOpen size={22} />
            </div>
            <div>
              <span className="text-gray-400 text-sm font-medium block mb-1">Total Post</span>
              <span className="text-2xl font-bold text-gray-800">154</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-4">
              <FileText size={22} />
            </div>
            <div>
              <span className="text-gray-400 text-sm font-medium block mb-1">Total Pages</span>
              <span className="text-2xl font-bold text-gray-800">56</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500 mb-4">
              <MessageCircle size={22} />
            </div>
            <div>
              <span className="text-gray-400 text-sm font-medium block mb-1">Comments</span>
              <span className="text-2xl font-bold text-gray-800">34.2K</span>
            </div>
          </div>

          {/* Card 4 (Pop-out style) */}
          <div className="relative bg-white rounded-3xl p-6 flex flex-col justify-end shadow-xl shadow-gray-100 transform md:-translate-y-4 border border-gray-50">
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md z-10">
              <Heart size={12} fill="currentColor" /> +1K
            </div>
            <div className="w-12 h-12 mb-auto bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
               <Heart size={22} />
            </div>
            <div>
              <span className="text-gray-400 text-sm font-medium block mb-1">Total Likes</span>
              <span className="text-2xl font-bold text-gray-800">65.2K</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Content: Chart + Blog List --- */}
      <div className="grid grid-cols-12 gap-8">
        {/* Chart Section */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Visitors Analytics</h3>
              <div className="flex gap-8 mt-2">
                <div>
                  <span className="text-2xl font-bold text-gray-800">250K</span>
                  <span className="text-gray-400 text-xs ml-2">Total Visits</span>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> 2024
              </div>
               <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span> 2023
              </div>
            </div>
          </div>
          <VisitorsChart />
        </div>

        {/* Recent Blogs Section */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Articles</h3>
            <button className="flex items-center gap-2 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100 transition">
              <Plus size={14} /> NEW
            </button>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto pr-2">
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
    </div>
  );
}

// Helper Component for Blog List Items
function BlogItem({ title, comments, views, color }: { title: string; comments: number; views: number; color: string }) {
  return (
    <div className="flex items-start justify-between group cursor-pointer">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-transform group-hover:scale-105`}>
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