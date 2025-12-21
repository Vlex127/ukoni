import {
  ArrowUpRight,
  Github,
  Linkedin,
  MoveRight,
  PenTool,
  Search,
  Sparkles,
  Twitter,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Ensure images exist or comment out Image component

// --- Mock Data ---
const TOP_AUTHORS = [
  {
    id: 1,
    name: "Henry Qells",
    role: "Editor in Chief",
    bio: "Obsessed with design systems and 3D web interfaces. Writing about the intersection of art and code.",
    articles: 154,
    followers: "23k",
    color: "bg-blue-100",
    image: "/avatar1.jpg", 
  },
  {
    id: 2,
    name: "Sarah Jenks",
    role: "Senior UX Writer",
    bio: "Simplifying complex user journeys one word at a time. Advocate for inclusive design.",
    articles: 89,
    followers: "12k",
    color: "bg-purple-100",
    image: "/avatar2.jpg",
  },
  {
    id: 3,
    name: "Mike Ross",
    role: "Tech Lead",
    bio: "Full-stack developer sharing battle-tested patterns for Next.js and serverless architectures.",
    articles: 45,
    followers: "8.5k",
    color: "bg-teal-100",
    image: "/avatar3.jpg",
  },
];

const ALL_AUTHORS = [
  {
    id: 4,
    name: "Dr. Alisha Keys",
    role: "Psychology",
    articles: 12,
    color: "bg-orange-100",
  },
  {
    id: 5,
    name: "Tom Cook",
    role: "Travel & Lifestyle",
    articles: 34,
    color: "bg-green-100",
  },
  {
    id: 6,
    name: "Jessica Lee",
    role: "Frontend Dev",
    articles: 21,
    color: "bg-pink-100",
  },
  {
    id: 7,
    name: "David Smith",
    role: "Product Manager",
    articles: 9,
    color: "bg-yellow-100",
  },
  {
    id: 8,
    name: "Emily Blunt",
    role: "Illustrator",
    articles: 18,
    color: "bg-indigo-100",
  },
  {
    id: 9,
    name: "Chris Evans",
    role: "Security Analyst",
    articles: 6,
    color: "bg-red-100",
  },
  {
    id: 10,
    name: "Natasha R.",
    role: "Data Scientist",
    articles: 15,
    color: "bg-cyan-100",
  },
  {
    id: 11,
    name: "Bruce Banner",
    role: "Backend Dev",
    articles: 42,
    color: "bg-lime-100",
  },
];

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* --- Header --- */}
      <header className="pt-24 pb-16 text-center max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
          <Users size={14} /> The Community
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Meet the minds behind <br />
          the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">stories.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Writers, developers, designers, and thinkers sharing their unique perspectives with the world.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
          <input
            type="text"
            placeholder="Find an author..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* --- Spotlight / Top Voices --- */}
        <section className="mb-24">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="text-yellow-500" size={20} />
            <h2 className="text-2xl font-bold text-gray-900">Top Voices</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TOP_AUTHORS.map((author) => (
              <div 
                key={author.id} 
                className="group relative bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                {/* Header: Avatar & Follow Button */}
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-20 h-20 rounded-full ${author.color} border-4 border-white shadow-sm flex items-center justify-center overflow-hidden`}>
                      {/* <Image src={author.image} ... /> */}
                      <span className="text-2xl font-bold opacity-20">{author.name[0]}</span>
                   </div>
                   <button className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-900 hover:text-white transition">
                      Follow
                   </button>
                </div>

                {/* Info */}
                <div className="mb-6">
                   <h3 className="text-xl font-bold text-gray-900 mb-1">{author.name}</h3>
                   <p className="text-blue-600 text-sm font-medium mb-3">{author.role}</p>
                   <p className="text-gray-500 text-sm leading-relaxed">{author.bio}</p>
                </div>

                {/* Stats & Social */}
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex gap-4 text-xs font-bold text-gray-900">
                      <span>{author.articles} Articles</span>
                      <span className="text-gray-400">•</span>
                      <span>{author.followers} Followers</span>
                   </div>
                   <div className="flex gap-3 text-gray-400">
                      <Twitter size={16} className="hover:text-blue-400 cursor-pointer transition" />
                      <Linkedin size={16} className="hover:text-blue-700 cursor-pointer transition" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- All Authors Grid --- */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Contributors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALL_AUTHORS.map((author) => (
              <Link href={`/authors/${author.id}`} key={author.id} className="group bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center transition hover:shadow-lg">
                <div className={`w-20 h-20 rounded-full ${author.color} mb-4 group-hover:scale-110 transition duration-300`}></div>
                
                <h3 className="font-bold text-gray-900">{author.name}</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-4">{author.role}</p>
                
                <div className="w-full border-t border-gray-200 my-4"></div>
                
                <div className="flex justify-between w-full items-center px-2">
                   <span className="text-xs font-medium text-gray-500">{author.articles} Articles</span>
                   <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition">
                      <ArrowUpRight size={16} />
                   </span>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Pagination / Load More */}
          <div className="mt-16 flex justify-center">
             <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition">
                Load more writers <MoveRight size={16} />
             </button>
          </div>
        </section>

        {/* --- CTA: Join the team --- */}
        <section className="mt-24">
           <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
              {/* Background Shapes */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-30"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-30"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 text-white">
                    <PenTool size={32} />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Have a story to tell?</h2>
                 <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    Join our community of writers and share your knowledge with millions of readers worldwide. We provide the platform; you provide the voice.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg">
                       Become a Writer
                    </button>
                    <button className="px-8 py-4 bg-transparent border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transition">
                       View Guidelines
                    </button>
                 </div>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}