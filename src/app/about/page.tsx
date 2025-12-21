import {
  Users,
  Globe,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-8">
            Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            We are building the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              future of storytelling.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed mb-10">
            Ukoni is a digital sanctuary for thinkers, creators, and curious minds. 
            We believe that great ideas deserve a beautiful home.
          </p>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-40 -z-10 pointer-events-none"></div>
      </section>

      {/* --- Mission & Stats --- */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Bridging the gap between complex ideas and clear understanding.
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Founded in 2024, Ukoni started with a simple question: 
                <em> "Why is the internet so noisy?"</em>
              </p>
              <p>
                We set out to create a platform that prioritizes signal over noise. 
                A place where reading feels like a retreat, not a chore. Whether 
                you are a developer documenting your journey or a designer sharing 
                process, Ukoni is your canvas.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12">
               <StatItem number="2M+" label="Monthly Readers" />
               <StatItem number="15k+" label="Published Authors" />
               <StatItem number="120" label="Countries Reached" />
               <StatItem number="4.9" label="App Store Rating" />
            </div>
          </div>
          
          {/* Image Placeholder */}
          <div className="relative h-[500px] bg-white rounded-[2.5rem] p-4 shadow-xl shadow-blue-900/5 rotate-3 border border-gray-100">
             <div className="w-full h-full bg-gray-100 rounded-[2rem] overflow-hidden relative">
               <Image src="/group.png" alt="team photo" fill className="object-cover" />  
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                   Office / Team Photo
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- Our Values --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What drives us</h2>
          <p className="text-gray-500">
            Our core values shape every decision we make, from the code we write to the communities we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard 
            icon={<Globe className="text-blue-600" />}
            title="Open & Inclusive"
            desc="We believe knowledge should be free and accessible to everyone, regardless of background."
          />
          <ValueCard 
            icon={<Zap className="text-yellow-500" />}
            title="Speed Matters"
            desc="We respect your time. Our platform is engineered for speed, ensuring a seamless flow."
          />
          <ValueCard 
            icon={<Heart className="text-red-500" />}
            title="Creator First"
            desc="We build tools that empower writers to own their audience and their intellectual property."
          />
        </div>
      </section>

      {/* --- The Team --- */}
      <section className="bg-gray-900 text-white py-24 rounded-t-[3rem] mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
               <h2 className="text-3xl font-bold mb-2">Meet the Makers</h2>
               <p className="text-gray-400">The diverse team working remotely from 12 countries.</p>
            </div>
            <Link href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition">
              Join our team <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMember name="Alex Rivers" role="Founder & CEO" color="bg-blue-500" />
            <TeamMember name="Sarah Jenks" role="Head of Design" color="bg-purple-500" />
            <TeamMember name="Vincent Iwuno" role="CTO" color="bg-teal-500" />
            <TeamMember name="You?" role="We are hiring!" color="bg-gray-800 border-2 border-dashed border-gray-700" isHiring />
          </div>
        </div>
      </section>
      
      {/* --- Footer CTA --- */}
      <section className="py-24 text-center">
         <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to share your story?</h2>
         <div className="flex justify-center gap-4">
            <Link href="/register" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200">
               Get Started
            </Link>
            <Link href="/blog" className="px-8 py-3 bg-white text-gray-900 font-bold border border-gray-200 rounded-full hover:bg-gray-50 transition">
               Read Blogs
            </Link>
         </div>
      </section>
    </div>
  );
}

// --- Helper Components ---

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-extrabold text-blue-600 mb-1">{number}</div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition text-left">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

function TeamMember({ name, role, color, isHiring }: { name: string; role: string; color: string; isHiring?: boolean }) {
  return (
    <div className="group text-center">
      <div className={`w-full aspect-square rounded-2xl mb-4 relative overflow-hidden ${color} flex items-center justify-center`}>
         {isHiring ? (
            <span className="text-2xl font-bold text-gray-600">+</span>
         ) : (
             // Placeholder for Team Image
             <div className="opacity-50 group-hover:opacity-100 transition duration-500 scale-90 group-hover:scale-100">
                <Users size={48} className="text-white/50" />
             </div>
         )}
      </div>
      <h3 className="text-lg font-bold text-white">{name}</h3>
      <p className="text-sm text-gray-400">{role}</p>
    </div>
  );
}