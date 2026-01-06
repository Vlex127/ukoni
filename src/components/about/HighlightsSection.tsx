import { Award as AwardIcon, Globe as GlobeIcon, Zap as ImpactIcon } from "lucide-react";

interface HighlightItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const HighlightItem = ({ icon, title, desc }: HighlightItemProps) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-white/10 rounded-lg text-white flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-gray-300">{desc}</p>
    </div>
  </div>
);

const Divider = () => (
  <div className="w-full h-px bg-gray-800 my-6"></div>
);

export const HighlightsSection = () => (
  <section className="py-16 sm:py-20 px-4 sm:px-6">
    <div className="bg-gray-900 rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 md:p-16 text-white relative overflow-hidden max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-full sm:w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-20 sm:translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12">Career Highlights & Recognition</h2>
          
          <div className="space-y-6 sm:space-y-8">
            <HighlightItem 
              icon={<AwardIcon className="w-5 h-5" />}
              title="Significant Insights 30 Under 30"
              desc="Honoured as one of the rising stars in the global market research industry."
            />
            <Divider />
            <HighlightItem 
              icon={<GlobeIcon className="w-5 h-5" />}
              title="Global Brand Experience"
              desc="Shaping digital entertainment and financial products at Transsion and Kantar."
            />
            <Divider />
            <HighlightItem 
              icon={<ImpactIcon className="w-5 h-5" />}
              title="Impact at Moniepoint"
              desc="Leading research to refine payment solutions and onboarding for millions of users."
            />
          </div>
        </div>

        {/* Call to Action Side */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 sm:p-10">
          <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
          <p className="text-gray-300 mb-8">
            Interested in collaborating on a project or learning more about my approach to research and strategy?
          </p>
          <a 
            href="mailto:ukonisophia@gmail.com" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Get in Touch
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
);
