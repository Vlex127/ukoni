import {
  Bell,
  Bookmark,
  ChevronRight,
  Clock,
  MoreHorizontal,
  PlayCircle,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="flex flex-col gap-10">
      {/* --- Header --- */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good Morning, Alex! ☀️
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            You've read <span className="text-blue-600 font-bold">12 articles</span> this week. Keep it up!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search topics..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64"
            />
          </div>
          <button className="relative p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white shadow-sm"></div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- Left Column (Content Feed) --- */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          
          {/* 1. Continue Reading (Hero Card) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-blue-600" /> Continue Reading
              </h2>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 group hover:shadow-md transition">
              {/* Image */}
              <div className="w-full sm:w-48 h-32 bg-orange-100 rounded-2xl flex-shrink-0 relative overflow-hidden">
                 {/* <Image src="/..." fill /> */}
                 <div className="absolute inset-0 flex items-center justify-center text-orange-400">
                    <TrendingUp size={32} />
                 </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md mb-2 inline-block">Productivity</span>
                    <button className="text-gray-400 hover:text-gray-900"><MoreHorizontal size={20} /></button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                    The Art of Deep Work in a Distracted World
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    Why multitasking is a myth and how to actually get things done...
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                    <span>65% Completed</span>
                    <span>3 min left</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[65%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. For You / Feed */}
          <section>
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
              <button className="text-sm text-blue-600 font-medium hover:underline">Customize</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <ArticleCard 
                  category="Design" 
                  title="Understanding Color Theory in UI" 
                  author="Sarah Jenks" 
                  time="5 min read"
                  color="bg-purple-100"
               />
               <ArticleCard 
                  category="Tech" 
                  title="The Future of React Server Components" 
                  author="Mike Ross" 
                  time="8 min read"
                  color="bg-blue-100"
               />
               <ArticleCard 
                  category="Psychology" 
                  title="Why We Procrastinate" 
                  author="Dr. Alisha" 
                  time="6 min read"
                  color="bg-green-100"
               />
               <ArticleCard 
                  category="Travel" 
                  title="Digital Nomad Guide: Bali 2024" 
                  author="Tom Cook" 
                  time="12 min read"
                  color="bg-yellow-100"
               />
            </div>
          </section>
        </div>

        {/* --- Right Column (Sidebar Widgets) --- */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          
          {/* Widget: Your Bookmarks */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Bookmark size={18} className="text-blue-600 fill-blue-600" /> Saved
              </h3>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <BookmarkItem title="10 Tips for Clean Code" category="Dev" />
              <BookmarkItem title="Minimalist Home Setup" category="Lifestyle" />
              <BookmarkItem title="Understanding Next.js Middleware" category="Dev" />
            </div>
          </div>

          {/* Widget: Topics to Follow */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Topics you follow</h3>
            <div className="flex flex-wrap gap-2">
              {['UX Design', 'React', 'Startups', 'Writing', 'AI', 'Health'].map(topic => (
                <button key={topic} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition border border-transparent hover:border-blue-100">
                  # {topic}
                </button>
              ))}
              <button className="px-3 py-1.5 bg-white border border-dashed border-gray-300 text-gray-400 text-xs font-medium rounded-lg hover:border-blue-300 hover:text-blue-500 transition">
                + Add
              </button>
            </div>
          </div>

          {/* Widget: Premium Promo (Optional) */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl text-white relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                   <Star fill="white" className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-lg mb-2">Go Premium</h3>
                <p className="text-gray-300 text-sm mb-4">Access exclusive articles and listen to audio versions.</p>
                <button className="w-full py-2 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 transition">
                   Upgrade Now
                </button>
             </div>
             {/* Decorative circles */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Components for this Page ---

function ArticleCard({ category, title, author, time, color }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition cursor-pointer flex flex-col justify-between h-full">
      <div className="flex items-start gap-4 mb-3">
        <div className={`w-12 h-12 ${color} rounded-xl flex-shrink-0`}></div>
        <div>
           <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{category}</span>
           <h4 className="font-bold text-gray-900 text-sm leading-snug mt-1 line-clamp-2">{title}</h4>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-auto">
         <span className="text-xs font-medium text-gray-500">{author}</span>
         <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} /> {time}
         </span>
      </div>
    </div>
  )
}

function BookmarkItem({ title, category }: any) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition cursor-pointer group">
       <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition">
          <PlayCircle size={20} />
       </div>
       <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-800 truncate">{title}</h4>
          <p className="text-xs text-gray-400">{category}</p>
       </div>
    </div>
  )
}