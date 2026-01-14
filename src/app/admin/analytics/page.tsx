"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import VisitorsChart from "@/components/ui/VisitorsChart";
import {
  BarChart3,
  CalendarDays,
  TrendingUp,
  Users,
  Eye,
  Download,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface VisitorData {
  date: string;
  count: number;
}

interface VisitorChartData {
  currentPeriod: VisitorData[];
  previousPeriod: VisitorData[];
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [visitorData, setVisitorData] = useState<VisitorChartData>({ currentPeriod: [], previousPeriod: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const headers = new Headers({ "Content-Type": "application/json" });
        const response = await fetch('/api/analytics', { headers });
        
        if (!response.ok) throw new Error('Failed to fetch visitor data');
        
        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];
        
        setVisitorData({
          currentPeriod: [{
            date: today,
            count: data.current_period?.total_visitors || 0
          }],
          previousPeriod: [{
            date: today,
            count: data.previous_period?.total_visitors || 0
          }]
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load analytics data');
        setVisitorData({ currentPeriod: [], previousPeriod: [] });
      } finally {
        setIsLoading(false);
      }
    };
    fetchVisitorData();
  }, []);

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-10">
      
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
        {/* Left Side: Page Title or Breadcrumb */}
        <div className="flex flex-col">
           <span className="text-gray-400 text-xs font-medium">Analytics / Overview</span>
           <h2 className="text-lg sm:text-xl font-bold text-gray-800">Analytics Dashboard</h2>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
            <CalendarDays size={16} />
            <span className="whitespace-nowrap">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric'})}</span>
          </div>
          
          <button className="flex items-center gap-2 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
            <Download size={14} />
            Export
          </button>
        </div>
      </header>

      {/* Welcome Message */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 size={32} className="text-blue-600" />
          Analytics Overview
        </h1>
        <p className="text-gray-500 text-sm">Detailed insights into your blog's performance and visitor behavior.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          icon={<Eye size={20} />} 
          label="Today's Visitors" 
          value={visitorData.currentPeriod[0]?.count || 0} 
          color="text-blue-500" 
          bg="bg-blue-100" 
        />
        <StatCard 
          icon={<TrendingUp size={20} />} 
          label="Page Views" 
          value="1,234" 
          color="text-green-500" 
          bg="bg-green-100" 
        />
        <StatCard 
          icon={<Users size={20} />} 
          label="Unique Visitors" 
          value="892" 
          color="text-purple-500" 
          bg="bg-purple-100" 
        />
        <StatCard 
          icon={<BarChart3 size={20} />} 
          label="Avg. Session" 
          value="3:45" 
          color="text-orange-500" 
          bg="bg-orange-100" 
        />
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Visitor Trends</h3>
            <p className="text-gray-500 text-sm mt-1">Daily visitor count over time</p>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Current Period
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Previous Period
            </div>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <VisitorsChart 
            data={visitorData} 
            loading={isLoading} 
            error={error} 
          />
        </div>
      </div>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {[
              { page: "/blog/getting-started", views: 1234, percentage: 35 },
              { page: "/blog/advanced-tips", views: 892, percentage: 25 },
              { page: "/about", views: 567, percentage: 16 },
              { page: "/contact", views: 445, percentage: 13 },
              { page: "/", views: 334, percentage: 11 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 truncate">{item.page}</div>
                  <div className="text-xs text-gray-500">{item.views.toLocaleString()} views</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {[
              { source: "Direct", visitors: 1234, percentage: 45 },
              { source: "Search Engines", visitors: 892, percentage: 32 },
              { source: "Social Media", visitors: 456, percentage: 16 },
              { source: "Referral", visitors: 200, percentage: 7 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{item.source}</div>
                  <div className="text-xs text-gray-500">{item.visitors.toLocaleString()} visitors</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
const StatCard = ({ icon, label, value, color, bg }: any) => (
  <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center ${color} mb-4`}>
      {icon}
    </div>
    <div>
      <span className="text-gray-400 text-xs font-medium uppercase tracking-wide block mb-1">
        {label}
      </span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  </div>
);