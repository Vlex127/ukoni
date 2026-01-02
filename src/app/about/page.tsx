import { Metadata } from 'next';
import {
  Globe,
  Briefcase,
  Award,
  Linkedin,
  Instagram,
  Target,
  Lightbulb,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Building2
} from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: 'About Adaeze Sophia Ukoni | Research & Strategy Professional',
  description: 'Award-winning research and strategy professional with expertise in market research, user experience, and product strategy. Currently leading research at Moniepoint.',
  keywords: ['market research', 'product strategy', 'user experience', 'fintech', 'Moniepoint', 'Transsion', 'Kantar'],
  openGraph: {
    title: 'Adaeze Sophia Ukoni | Research & Strategy Professional',
    description: 'Award-winning research and strategy professional with expertise in market research and product strategy.',
    type: 'website',
    locale: 'en_US',
    images: ['/og-image.jpg'], // Add an OG image path here
  },
};

export default function SophiaPortfolio() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Texture */}
        <DotPattern className="absolute inset-0 text-slate-200 mask-image-gradient" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
             <Sparkles size={12} /> Research & Strategy Professional
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-balance text-slate-900">
            Uncovering the <span className="italic font-serif">"why"</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600">
               behind customer behavior.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed mb-10 text-balance">
            Translating complex human insights into clear strategies that drive product success, market growth, and measurable impact.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://www.linkedin.com/in/adaeze-sophia-ukoni-1b6704a5" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
                <Linkedin size={20} /> Connect on LinkedIn
            </a>
            <a 
              href="mailto:contact@example.com"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
            >
                Get in Touch
            </a>
          </div>
        </div>
        
        {/* Abstract Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none"></div>
      </section>

      {/* --- Social Proof / Logos --- */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-10">
        <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
                Driving impact at leading organizations
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Replace these text spans with actual SVG logos for better effect */}
                <span className="text-2xl font-bold font-serif text-slate-800">Moniepoint</span>
                <span className="text-2xl font-bold font-sans tracking-tighter text-slate-800">TRANSSION</span>
                <span className="text-2xl font-bold font-serif italic text-slate-800">Kantar</span>
            </div>
        </div>
      </section>

      {/* --- Bio & Stats Section --- */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Bridging the gap between <br/>
              <span className="text-blue-600">data</span> and <span className="text-blue-600">human connection</span>.
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                I am an award-winning research and strategy professional obsessed with connecting businesses with the people they serve. 
              </p>
              <p>
                Currently leading research efforts at <span className="font-bold text-slate-900 bg-blue-50 px-1 rounded">Moniepoint</span>, I refine payment solutions and orchestrate onboarding experiences to identify growth opportunities in both competitive and underserved markets.
              </p>
              <p>
                My career spans over seven years across industries—from consumer technology to fintech. I have partnered with global brands to shape digital entertainment and financial products that today reach millions of users across Africa and beyond.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-100">
               <StatItem number="7+" label="Years Experience" />
               <StatItem number="2" label="Global Awards" />
               <StatItem number="3" label="Key Industries" />
            </div>
          </div>
          
          {/* Right Column: Image Composition */}
          <div className="order-1 lg:order-2 relative mx-auto w-full max-w-md lg:max-w-full">
            <div className="relative aspect-[4/5] w-full">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
                
                {/* Main Image Container */}
                <div className="w-full h-full bg-slate-100 rounded-2xl overflow-hidden relative shadow-2xl border-[6px] border-white">
                    <Image 
                        src="/professional.png" // Ensure this image exists in public folder
                        alt="Adaeze Sophia Ukoni"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                        priority
                    />
                </div>

                {/* Floating Award Card */}
                <div className="absolute bottom-8 -left-8 md:-left-12 bg-white p-5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 max-w-[280px] animate-bounce-slow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 shrink-0">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Latest Recognition</p>
                            <p className="font-bold text-slate-900 text-sm leading-snug">QRCA Global Qualitative Researchers Award (2024)</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Methodology Section --- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative Background line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 hidden md:block"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 bg-slate-50 px-4 inline-block relative">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">My Approach</h2>
            <p className="text-slate-500 text-lg">
              Blending rigorous data with compelling human stories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MethodCard 
              icon={<Target className="text-blue-600" size={28} />}
              title="Strategic Clarity"
              desc="Uncovering the 'why' behind behavior to translate ambiguity into clear, actionable business strategies."
              color="bg-blue-50 border-blue-100"
            />
            <MethodCard 
              icon={<Users className="text-indigo-600" size={28} />}
              title="Human-Centric"
              desc="Ensuring that technology and financial solutions solve real problems for real people, not just theoretical users."
              color="bg-indigo-50 border-indigo-100"
            />
            <MethodCard 
              icon={<TrendingUp className="text-purple-600" size={28} />}
              title="Market Growth"
              desc="Identifying tangible opportunities in both competitive landscapes and underserved emerging markets."
              color="bg-purple-50 border-purple-100"
            />
          </div>
        </div>
      </section>

      {/* --- Highlights & CTA --- */}
      <section className="py-20 px-4 md:px-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden max-w-6xl mx-auto shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                
                {/* Highlights List */}
                <div className="lg:col-span-7">
                    <h2 className="text-3xl md:text-4xl font-bold mb-10 flex items-center gap-3">
                        <Award className="text-blue-400" /> Career Highlights
                    </h2>
                    
                    <div className="space-y-0">
                        <HighlightItem 
                            year="2024"
                            title="Significant Insights 30 Under 30"
                            desc="Honoured as one of the rising stars in the global market research industry."
                        />
                        <HighlightItem 
                            year="2022-24"
                            title="Impact at Moniepoint"
                            desc="Leading research to refine payment solutions and onboarding for millions of users."
                        />
                         <HighlightItem 
                            year="2018-22"
                            title="Global Brand Experience"
                            desc="Shaped digital entertainment and financial products at Transsion and Kantar."
                        />
                    </div>
                </div>

                {/* CTA Card */}
                <div className="lg:col-span-5 flex items-center">
                    <div className="w-full bg-white/10 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/15 transition-colors">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-900/50">
                            <Lightbulb size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Let's collaborate</h3>
                        <p className="text-slate-300 mb-8 leading-relaxed text-sm">
                            I am always open to discussing new opportunities in product strategy, market research, and speaking engagements.
                        </p>
                        <div className="flex flex-col gap-3">
                             <a href="mailto:contact@example.com" className="group w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-3.5 rounded-lg hover:bg-blue-50 transition-colors">
                                <span className="group-hover:-translate-y-0.5 transition-transform">Get in Touch</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="https://www.linkedin.com/in/adaeze-sophia-ukoni-1b6704a5" target="_blank" className="w-full text-center text-slate-400 font-medium py-3 rounded-lg hover:text-white hover:bg-white/5 transition-colors text-sm">
                                View LinkedIn Profile
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm border-t border-slate-100 mt-12">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span className="font-bold text-slate-700">Adaeze Sophia Ukoni</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <p>© 2025 All rights reserved.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="https://www.linkedin.com/in/adaeze-sophia-ukoni-1b6704a5" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-600 hover:text-white transition-all"><Linkedin size={18} /></a>
             <a href="https://www.instagram.com/ukoni_sophia" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18}/></a>
             <a href="mailto:contact@example.com" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-900 hover:text-white transition-all"><Briefcase size={18}/></a>
          </div>
      </footer>

    </div>
  );
}

// --- Helper Components ---

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="group">
      <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{number}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function MethodCard({ icon, title, desc, color }: { icon: any; title: string; desc: string, color: string }) {
  return (
    <div className={`group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-start`}>
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

function HighlightItem({ year, title, desc }: { year: string, title: string; desc: string }) {
    return (
        <div className="relative pl-8 pb-10 border-l border-slate-700 last:border-0 last:pb-0 group">
            <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] bg-blue-500 rounded-full group-hover:scale-150 group-hover:ring-4 group-hover:ring-blue-500/20 transition-all"></div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                <span className="text-xs font-bold text-blue-400 font-mono">{year}</span>
                <h4 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">{title}</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">{desc}</p>
        </div>
    )
}

function DotPattern({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%">
      <defs>
        <pattern id="dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" />
        </pattern>
        <mask id="fade-mask">
          <rect width="100%" height="100%" fill="url(#fade-gradient)" />
        </mask>
        <linearGradient id="fade-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="50%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" mask="url(#fade-mask)" opacity="0.4" />
    </svg>
  );
}