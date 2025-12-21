import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Filter,
  Search,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Ensure you have images or remove/comment Image components

// --- Mock Data ---
const CATEGORIES = [
  "All Topics",
  "Technology",
  "Design",
  "Culture",
  "Productivity",
  "Development",
  "AI",
];

const ARTICLES = [
  {
    id: 1,
    title: "The Psychology of Minimalist Design",
    excerpt: "Why less is more, and how cognitive load affects user decision making in modern interfaces.",
    category: "Design",
    author: "Sarah Jenks",
    date: "Dec 12, 2024",
    readTime: "6 min",
    imageColor: "bg-orange-100",
    tags: ["UX", "Minimalism"],
  },
  {
    id: 2,
    title: "Next.js 15: What to Expect",
    excerpt: "A deep dive into the upcoming features of the React framework and how it changes the game.",
    category: "Technology",
    author: "Vincent Iwuno",
    date: "Dec 10, 2024",
    readTime: "12 min",
    imageColor: "bg-blue-100",
    tags: ["React", "Frontend"],
  },
  {
    id: 3,
    title: "Digital Nomad Lifestyle in 2025",
    excerpt: "How remote work has evolved and the best cities to live in for creatives this year.",
    category: "Culture",
    author: "Alex Rivers",
    date: "Dec 08, 2024",
    readTime: "8 min",
    imageColor: "bg-green-100",
    tags: ["Remote Work", "Travel"],
  },
  {
    id: 4,
    title: "Mastering Tailwind CSS Grid",
    excerpt: "Stop struggling with layout. Here is a comprehensive guide to building complex grids.",
    category: "Development",
    author: "Code Master",
    date: "Dec 05, 2024",
    readTime: "15 min",
    imageColor: "bg-purple-100",
    tags: ["CSS", "Tutorial"],
  },
  {
    id: 5,
    title: "The Rise of AI Agents",
    excerpt: "From chatbots to autonomous agents: understanding the next wave of artificial intelligence.",
    category: "AI",
    author: "Robot Fan",
    date: "Dec 01, 2024",
    readTime: "5 min",
    imageColor: "bg-indigo-100",
    tags: ["AI", "Future"],
  },
  {
    id: 6,
    title: "Sustainable Coding Practices",
    excerpt: "Writing code that is not only clean but also energy efficient. Yes, it matters.",
    category: "Development",
    author: "Green Dev",
    date: "Nov 28, 2024",
    readTime: "7 min",
    imageColor: "bg-teal-100",
    tags: ["Green Tech", "Coding"],
  },
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* --- Page Header --- */}
      <header className="bg-gray-50 border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <BookOpen size={14} className="text-blue-500" /> The Library
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Explore our latest <br className="hidden md:block" />
            <span className="text-blue-600">insights & stories.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-10">
            A curated collection of thoughts on technology, design, and the digital world.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search articles, topics, or authors..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* --- Filters & Sorting --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-gray-100 pb-6">
          {/* Categories Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                  idx === 0
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter Dropdown Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition ml-auto md:ml-0">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* --- Featured Article (Large Card) --- */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
            
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wide uppercase mb-4">
                <Sparkles size={16} /> Featured Story
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                How Design Systems Scale: A Practical Guide
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Building a design system is easy. Maintaining it as your team grows is the hard part. Learn the governance models that actually work.
              </p>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                 <div>
                    <p className="font-bold">Henry Qells</p>
                    <p className="text-xs text-gray-400">Dec 21, 2024 • 10 min read</p>
                 </div>
              </div>

              <Link 
                href="/articles/featured-slug" 
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold self-start hover:bg-gray-100 transition"
              >
                Read Article <ArrowRight size={18} />
              </Link>
            </div>

            {/* Feature Image Placeholder */}
            <div className="relative h-64 lg:h-auto rounded-3xl overflow-hidden bg-gray-800 border border-gray-700 group-hover:border-gray-600 transition">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    {/* <Image src="..." /> */}
                    Feature Image
                 </div>
            </div>
          </div>
        </section>

        {/* --- Articles Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {ARTICLES.map((article) => (
            <article key={article.id} className="group flex flex-col h-full">
              {/* Image */}
              <Link href={`/articles/${article.id}`} className="block overflow-hidden rounded-2xl mb-5 relative aspect-[4/3]">
                <div className={`w-full h-full ${article.imageColor} transition-transform duration-500 group-hover:scale-105`}></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                  {article.category}
                </div>
              </Link>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition leading-snug">
                  <Link href={`/articles/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                      <span className="text-xs font-medium text-gray-700">{article.author}</span>
                   </div>
                   <div className="flex gap-2">
                      {article.tags.slice(0, 1).map(tag => (
                         <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100">#{tag}</span>
                      ))}
                   </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* --- Load More --- */}
        <div className="mt-20 text-center">
          <button className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
            Load More Articles
          </button>
        </div>

        {/* --- Newsletter CTA (Slim Version) --- */}
        <section className="mt-24 bg-blue-600 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden">
             <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Weekly Digest</h2>
                <p className="text-blue-100 mb-8">Get the best articles delivered to your inbox every Monday. No spam.</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                   <input type="email" placeholder="Your email address" className="px-4 py-3 rounded-xl text-gray-900 focus:outline-none w-full sm:w-80" />
                   <button className="bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition">Subscribe</button>
                </div>
             </div>
             {/* Decor */}
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full blur-2xl"></div>
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 rounded-full blur-2xl"></div>
        </section>

      </main>
    </div>
  );
}