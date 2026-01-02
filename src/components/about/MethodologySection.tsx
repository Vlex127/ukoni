import { Target, Lightbulb, Globe } from "lucide-react";

interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const MethodCard = ({ icon, title, desc }: MethodCardProps) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

export const MethodologySection = () => (
  <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">My Approach</h2>
      <p className="text-gray-500 text-lg">
        Blending data with human stories to ensure products are not only market-ready but resonate deeply with users.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      <MethodCard 
        icon={<Target className="w-6 h-6" />}
        title="Strategic Clarity"
        desc="Uncovering the 'why' behind behavior to translate ambiguity into clear, actionable business strategies."
      />
      <MethodCard 
        icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}
        title="Human-Centric"
        desc="Ensuring that technology and financial solutions solve real problems for real people."
      />
      <MethodCard 
        icon={<Globe className="w-6 h-6 text-purple-500" />}
        title="Market Growth"
        desc="Identifying opportunities in both competitive landscapes and underserved emerging markets."
      />
    </div>
  </section>
);
