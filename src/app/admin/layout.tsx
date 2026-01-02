"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { 
  LayoutGrid, 
  FileText,
  MessageSquare,
  Users,
  Settings,
  LogOut 
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth(); 
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex font-sans">
      {/* Slim Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-20 bg-white flex flex-col items-center py-8 shadow-sm">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col space-y-8 w-full px-4">
          <SidebarIcon icon={<LayoutGrid size={24} />} href="/admin" active={pathname === "/admin"} />
          <SidebarIcon icon={<FileText size={24} />} href="/admin/posts" active={pathname === "/admin/posts"} />
          <SidebarIcon icon={<MessageSquare size={24} />} href="/admin/comments" active={pathname === "/admin/comments"} />
          <SidebarIcon icon={<Users size={24} />} href="/admin/users" active={pathname === "/admin/users"} />
          <SidebarIcon icon={<Settings size={24} />} href="/admin/settings" active={pathname === "/admin/settings"} />
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <button 
            onClick={logout}
            className="p-3 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={24} />
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper - Pushed right by sidebar width */}
      <div className="flex-1 ml-20 p-8 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}

// --- Helper Components ---

function SidebarIcon({ icon, href, active }: { icon: React.ReactNode; href: string; active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`relative p-3 rounded-xl transition-all duration-200 group flex justify-center
        ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-gray-50'}
      `}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full -ml-4" />
      )}
      {icon}
    </Link>
  );
}

function LoadingScreen() {
  return (
<div className="max-w-7xl mx-auto flex items-center justify-center min-h-screen">
 
<Spinner/>
      </div>
  );
}