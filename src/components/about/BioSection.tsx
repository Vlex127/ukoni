import Image from "next/image";
import { Award } from "lucide-react";

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-700 mb-1">{number}</div>
    <div className="text-sm text-gray-500 uppercase tracking-wider">{label}</div>
  </div>
);

export const BioSection = () => (
  <section className="bg-gray-50 py-16 sm:py-24 border-y border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Adaeze Sophia Ukoni
        </h2>
        <div className="space-y-6 text-gray-600 leading-relaxed text-base sm:text-lg">
          <p>
            I am an award-winning research and strategy professional with a passion for connecting businesses with the people they serve. 
          </p>
          <p>
            Currently leading research efforts at <span className="font-semibold text-gray-900">Moniepoint</span>, I refine payment solutions and improve onboarding experiences to identify growth opportunities in both competitive and underserved markets.
          </p>
          <p>
            My career spans over seven years across industries—from technology to fintech—where I have worked with global and African brands like <span className="font-semibold text-gray-900">Transsion</span> and <span className="font-semibold text-gray-900">Kantar</span> to shape digital entertainment and financial products reaching millions of users.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12">
          <StatItem number="7+" label="Years Experience" />
          <StatItem number="2" label="Global Awards" />
          <StatItem number="3" label="Key Industries" />
        </div>
      </div>
      
      {/* Main Portrait Image */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full">
        <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-3 opacity-10" />
        <div className="w-full h-full bg-gray-200 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
          <Image 
            src="/professional.png"
            alt="Adaeze Sophia Ukoni - Research & Strategy Professional"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        {/* Floating Award Card */}
        <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[280px] sm:max-w-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 flex-shrink-0">
              <Award size={20} className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Recognition</p>
              <p className="font-bold text-sm sm:text-base text-gray-900 leading-tight">QRCA Global Qualitative Researchers Award (2024)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
