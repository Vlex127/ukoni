import { Linkedin } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => (
  <section className="relative pt-24 pb-20 overflow-hidden">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100">
        Research & Strategy Professional
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
        Uncovering the "why" <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
          behind customer behavior.
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 leading-relaxed mb-8">
        Translating human insights into strategies that drive product success and market growth.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          href="https://www.linkedin.com/in/adaeze-sophia-ukoni-1b6704a5" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors duration-200"
          aria-label="Connect on LinkedIn"
        >
          <Linkedin size={18} aria-hidden="true" /> 
          Connect on LinkedIn
        </Link>
      </div>
    </div>
    
    {/* Background Decoration */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-40 -z-10 pointer-events-none" />
  </section>
);
