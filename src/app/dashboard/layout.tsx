import Link from "next/link";
import {
  BookMarked,
  Clock,
  Compass,
  Home,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* User Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col z-30 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 font-bold text-xl tracking-tight text-gray-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
            <Sparkles size={16} fill="currentColor" />
          </div>
          <span className="hidden md:block">Ukoni</span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
          <NavItem href="/dashboard" icon={<Home size={20} />} label="Home" active />
          <NavItem href="#" icon={<Compass size={20} />} label="Explore" />
          <NavItem href="#" icon={<BookMarked size={20} />} label="Saved Articles" />
          <NavItem href="#" icon={<Clock size={20} />} label="Reading History" />
          <NavItem href="#" icon={<User size={20} />} label="My Profile" />
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
           <NavItem href="#" icon={<Settings size={20} />} label="Settings" />
           <Link href="/" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition">
              <LogOut size={20} />
              <span className="hidden md:block font-medium">Log Out</span>
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}

// Helper Component for Sidebar Links
function NavItem({ href, icon, label, active = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${
        active 
          ? "bg-blue-50 text-blue-600" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {icon}
      <span className="hidden md:block">{label}</span>
    </Link>
  )
}