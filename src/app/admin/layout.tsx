"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  FileText,
  MessageSquare,
  BarChart3,
  LogOut,
  Menu,
  X,
  HomeIcon
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have this

// ... imports remain the same

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
    <div className="h-screen bg-[#F4F7FE] flex font-sans overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[88px] bg-white flex flex-col items-center py-8 shadow-2xl lg:shadow-xl ring-1 ring-gray-100
          transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
        `}
      >
        {/* Brand */}
        <div className="mb-12">
          <Link href="/" className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">U</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-4 w-full px-4">
          <SidebarIcon
            icon={<HomeIcon size={24} />}
            href="/"
            active={pathname === "/"}
            label="Home"
          />
          <SidebarIcon
            icon={<LayoutGrid size={24} />}
            href="/admin"
            active={pathname === "/admin"}
            label="Dashboard"
          />
          <SidebarIcon
            icon={<FileText size={24} />}
            href="/admin/posts"
            active={pathname === "/admin/posts" || pathname.startsWith("/admin/posts/")}
            label="Posts"
          />
          <SidebarIcon
            icon={<MessageSquare size={24} />}
            href="/admin/comments"
            active={pathname === "/admin/comments"}
            label="Comments"
          />

          <SidebarIcon
            icon={<BarChart3 size={24} />}
            href="/admin/analytics"
            active={pathname === "/admin/analytics"}
            label="Analytics"
          />
        </nav>

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden mt-auto mb-6 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <X size={24} />
        </button>

        {/* Desktop Logout */}
        <div className="hidden lg:block mt-auto mb-6">
          <button
            onClick={handleLogout}
            className="p-3 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 group"
            title="Logout"
          >
            <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* Mobile Header for Menu Toggle */}
        <div className="lg:hidden px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white font-bold text-sm">U</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#F4F7FE] p-4 md:p-6 lg:p-8 scroll-smooth">
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
      className={`
        relative w-full h-[64px] rounded-xl transition-all duration-200 group flex flex-col justify-center items-center gap-1
        ${active
          ? 'text-blue-600 bg-blue-50 shadow-sm'
          : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'
        }
      `}
    >
      <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-medium leading-none ${active ? 'font-bold' : ''}`}>
        {label}
      </span>
    </Link>
  );
}