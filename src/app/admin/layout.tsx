"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { useState } from "react";
import {
  Briefcase,
  Calendar,
  Clock,
  Folder,
  Home,
  Image as ImageIcon,
  LogOut,
  Mail,
  X,
} from "lucide-react";
import Link from "next/link";
// Ensure you have this component, or use a simple placeholder if testing
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Toggle function
  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* --- Sidebar --- */}
      <aside className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8 fixed h-full justify-between z-40">
        <div className="flex flex-col items-center gap-y-8">
          {/* Logo Placeholder */}
          <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 mb-4 flex items-center justify-center text-white font-bold">
            U
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-y-6 text-gray-400">
            <Link href="/admin" className="text-blue-600 p-3 bg-blue-50 rounded-2xl transition hover:scale-105">
              <Home size={22} />
            </Link>
            <Link href="/admin/mail" className="p-3 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition">
              <Mail size={22} />
            </Link>
            <Link href="#" className="p-3 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition">
              <ImageIcon size={22} />
            </Link>
            <Link href="#" className="p-3 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition">
              <Clock size={22} />
            </Link>
            <Link href="#" className="p-3 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition">
              <Folder size={22} />
            </Link>
            
            {/* Calendar Button */}
            <button 
              onClick={toggleCalendar}
              className={`p-3 rounded-2xl transition ${
                isCalendarOpen 
                ? 'text-white bg-gray-900 shadow-lg' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Calendar size={22} />
            </button>
            
            <Link href="#" className="p-3 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition">
              <Briefcase size={22} />
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <button className="text-gray-400 p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition">
          <LogOut size={22} />
        </button>
      </aside>

      {/* --- Main Content Wrapper --- */}
      <main className="flex-1 ml-20 p-8">
        {children}
      </main>

      {/* --- Calendar Modal Overlay --- */}
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsCalendarOpen(false)} // Close when clicking background
        >
          {/* Modal Content */}
          <div 
            className="bg-white rounded-3xl shadow-2xl p-6 relative w-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Calendar</h3>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <CalendarComponent 
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-xl border border-gray-100"
            />
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
               <button 
                 onClick={() => setIsCalendarOpen(false)}
                 className="text-sm text-gray-500 font-medium hover:text-gray-900"
               >
                 Cancel
               </button>
               <button 
                 onClick={() => setIsCalendarOpen(false)}
                 className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
               >
                 Done
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}