import Link from "next/link";
import { ArrowRight, Search, Menu, X, Sparkles } from "lucide-react";

// Mock Data for Blog Posts
const FEATURED_POST = {
  category: "Design",
  title: "The Evolution of 3D Interfaces in Modern Web Design",
  excerpt: "How depth, shadows, and 3D elements are reshaping the flat design era into something more tangible.",
  author: "Henry Qells",
  date: "Oct 29, 2024",
  readTime: "5 min read",
  imageColor: "bg-blue-100", // Placeholder for actual image
};

const LATEST_POSTS = [
  {
    id: 1,
    category: "Development",
    title: "Why Next.js 14 is a Game Changer for Server Actions",
    excerpt: "Exploring the new mental model of handling data mutations directly from your components.",
    author: "Sarah Jenks",
    date: "Oct 28, 2024",
    readTime: "8 min read",
    color: "bg-purple-100",
  },
  {
    id: 2,
    category: "Productivity",
    title: "Setting Intentions Instead of Resolutions",
    excerpt: "A sustainable approach to personal growth that focuses on 'why' rather than just 'what'.",
    author: "Mike Ross",
    date: "Oct 25, 2024",
    readTime: "4 min read",
    color: "bg-teal-100",
  },
  {
    id: 3,
    category: "Lifestyle",
    title: "Minimalism: A Developer's Guide to Digital Decluttering",
    excerpt: "Cleaning up your digital workspace can lead to a clearer mind and better code.",
    author: "Henry Qells",
    date: "Oct 22, 2024",
    readTime: "6 min read",
    color: "bg-orange-100",
  },
];

const CATEGORIES = ["All", "Design", "Development", "Productivity", "Lifestyle", "Business"];

export default function BlogHome() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
      
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={16} fill="currentColor" />
            </div>
            Ukoni
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/dashboard" className="text-gray-900">Home</Link>
            <Link href="/articles" className="hover:text-blue-600 transition">Articles</Link>
            <Link href="/authors" className="hover:text-blue-600 transition">Authors</Link>
            <Link href="/about" className="hover:text-blue-600 transition">About</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
              <Search size={20} />
            </button>
            <Link 
              href="/login" 
              className="hidden md:inline-flex px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition"
            >
              Sign In
            </Link>
            <button className="md:hidden p-2 text-gray-900">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- Hero Section --- */}
        <section className="mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6 uppercase tracking-wider">
            Welcome to the blog
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Discover stories that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">ignite</span> your creativity.
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Ukoni is a community of writers, developers, and creators sharing insights on technology, design, and digital well-being.
          </p>
          <div className="flex justify-center gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Subscribe
            </button>
          </div>
        </section>

        {/* --- Featured Post --- */}
        <section className="mb-20">
          <div className="group relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-3xl p-8 hover:bg-gray-100 transition duration-300">
            {/* Image Placeholder */}
            <div className={`aspect-video w-full ${FEATURED_POST.imageColor} rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition`}>
               {/* <Image src="..." /> */}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-blue-600">{FEATURED_POST.category}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">{FEATURED_POST.date}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                {FEATURED_POST.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {FEATURED_POST.excerpt}
              </p>
              <div className="pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{FEATURED_POST.author}</p>
                  <p className="text-xs text-gray-500">{FEATURED_POST.readTime}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Categories Filters --- */}
        <section className="flex flex-wrap gap-2 mb-12 border-b border-gray-100 pb-8">
          {CATEGORIES.map((cat, i) => (
            <button 
              key={cat} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                i === 0 
                ? "bg-black text-white" 
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* --- Latest Posts Grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {LATEST_POSTS.map((post) => (
            <article key={post.id} className="group flex flex-col gap-4">
              {/* Card Image */}
              <div className={`w-full aspect-[4/3] ${post.color} rounded-2xl overflow-hidden relative`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition duration-300" />
              </div>

              {/* Card Content */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {post.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                      <span className="text-xs font-medium text-gray-700">{post.author}</span>
                   </div>
                   <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* --- Newsletter / Footer CTA --- */}
        <section className="bg-gray-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
           {/* Abstract Background Element */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
           
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
             <h2 className="text-3xl font-bold">Stay in the loop</h2>
             <p className="text-gray-400">
               Join 23K+ subscribers getting the best content delivered to their inbox weekly. No spam, ever.
             </p>
             <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none w-full sm:w-80"
                />
                <button className="px-6 py-3 bg-blue-600 font-bold rounded-lg hover:bg-blue-500 transition">
                  Get Started
                </button>
             </div>
           </div>
        </section>

      </main>

      {/* --- Simple Footer --- */}
      <footer className="border-t border-gray-100 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
             Ukoni
          </div>
          <div className="text-sm text-gray-500">
            &copy; 2024 Ukoni Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-400">
            <Link href="#" className="hover:text-gray-900">Twitter</Link>
            <Link href="#" className="hover:text-gray-900">GitHub</Link>
            <Link href="#" className="hover:text-gray-900">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}