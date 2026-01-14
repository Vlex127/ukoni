"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  LayoutGrid, 
  FileText, 
  MessageSquare, 
  Users, 
  BarChart3, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have this

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession(); 
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (status === "loading") return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4F7FE]">
       <Spinner />
    </div>
  );
  
  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden glass-effect"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-20 bg-white flex flex-col items-center py-6 shadow-xl lg:shadow-sm
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
        `}
      >
        {/* Brand */}
        <div className="mb-10">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-xl">B</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-6 w-full px-3">
          <SidebarIcon 
            icon={<LayoutGrid size={22} />} 
            href="/admin" 
            active={pathname === "/admin"} 
            label="Dashboard"
          />
          <SidebarIcon 
            icon={<FileText size={22} />} 
            href="/admin/posts" 
            active={pathname === "/admin/posts" || pathname.startsWith("/admin/posts/")} 
            label="Posts"
          />
          <SidebarIcon 
            icon={<MessageSquare size={22} />} 
            href="/admin/comments" 
            active={pathname === "/admin/comments"} 
            label="Comments"
          />
          <SidebarIcon 
            icon={<Users size={22} />} 
            href="/admin/users" 
            active={pathname === "/admin/users"} 
            label="Users"
          />
          <SidebarIcon 
            icon={<BarChart3 size={22} />} 
            href="/admin/analytics" 
            active={pathname === "/admin/analytics"} 
            label="Analytics"
          />
        </nav>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden mt-auto mb-4 p-3 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Desktop Logout */}
        <div className="hidden lg:block mt-auto mb-4">
          <button 
            onClick={handleLogout}
            className="p-3 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* Mobile Header for Menu Toggle */}
        <div className="lg:hidden p-4 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <Menu size={24} />
          </button>
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper Component for Icons
function SidebarIcon({ 
  icon, 
  href, 
  active, 
  label 
}: { 
  icon: React.ReactNode; 
  href: string; 
  active?: boolean;
  label: string;
}) {
  return (
    <Link 
      href={href}
      title={label}
      className={`
        relative p-3 rounded-2xl transition-all duration-200 group flex justify-center items-center
        ${active 
          ? 'text-blue-600 bg-blue-50 shadow-sm' 
          : 'text-gray-400 hover:text-blue-500 hover:bg-gray-50'
        }
      `}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full -ml-3" />
      )}
      {icon}
    </Link>
  );
}