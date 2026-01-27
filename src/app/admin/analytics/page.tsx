"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";
import VisitorsChart from "@/components/ui/VisitorsChart";
import {
  BarChart3,
  CalendarDays,
  TrendingUp,
  Users,
  Eye,
  Download,
  ExternalLink,
} from "lucide-react";

interface VisitorData {
  date: string;
  count: number;
}

interface TopPage {
  path: string;
  title: string;
  views: number;
  percentage: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

interface VisitorChartData {
  currentPeriod: VisitorData[];
  previousPeriod: VisitorData[];
  top_pages?: TopPage[];
  avg_session?: string;
  traffic_sources?: TrafficSource[];
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
        const response = await fetch(getApiUrl('analytics'), { headers });

        if (!response.ok) throw new Error('Failed to fetch visitor data');

        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];

        setVisitorData({
          currentPeriod: data.currentPeriod || [],
          previousPeriod: data.previousPeriod || [],
          top_pages: data.top_pages || [],
          avg_session: data.avg_session || "0:00",
          traffic_sources: data.traffic_sources || []
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
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs font-medium">Analytics / Overview</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Analytics Dashboard</h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
            <CalendarDays size={16} />
            <span className="whitespace-nowrap">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
        <StatCard
          icon={<Eye size={24} />}
          label="Today's Visitors"
          value={visitorData.currentPeriod[0]?.count || 0}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Page Views"
          value={visitorData.currentPeriod[0]?.count ? (visitorData.currentPeriod[0].count * 2.5).toFixed(0) : "0"}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          icon={<Users size={24} />}
          label="Unique Visitors"
          value={visitorData.currentPeriod[0]?.count || 0}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          icon={<BarChart3 size={24} />}
          label="Avg. User Duration"
          value={visitorData.avg_session || "0:00"}
          color="text-orange-600"
          bg="bg-orange-50"
        />
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Visitor Trends</h3>
            <p className="text-gray-500 text-sm mt-1">Daily visitor count over time</p>
          </div>

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
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Top Content</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Top 3 Most Viewed</span>
          </div>

          <div className="space-y-6">
            {visitorData.top_pages && visitorData.top_pages.length > 0 ? (
              visitorData.top_pages.map((item, index) => (
                <div key={index} className="flex items-center group/item hover:bg-gray-50/50 p-2 -m-2 rounded-2xl transition-colors">
                  {/* Rank Number */}
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-sm mr-4 group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-colors">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0 mr-4">
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 flex items-center gap-2"
                    >
                      {item.title}
                      <ExternalLink size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </a>
                    <div className="text-xs text-gray-400 font-medium truncate">{item.path}</div>
                  </div>

                  <div className="flex flex-col gap-1 items-end min-w-[100px]">
                    <div className={`text-sm font-bold flex items-center gap-1.5 ${item.views > 100 ? 'text-blue-600' : 'text-gray-700'}`}>
                      <Eye size={14} className={item.views > 100 ? 'animate-pulse' : ''} />
                      {item.views.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter text-right">Total Hits</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">No page views recorded yet.</div>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {visitorData.traffic_sources && visitorData.traffic_sources.length > 0 ? (
              visitorData.traffic_sources.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="text-sm font-medium text-gray-800">{item.source}</div>
                    <div className="text-xs text-gray-500">{item.visitors.toLocaleString()} visitors</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">No traffic source data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
const StatCard = ({ icon, label, value, color, bg }: any) => (
  <div className={`bg-white rounded-[2rem] p-6 flex flex-col justify-between border border-gray-100 shadow-sm hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 group`}>
    <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center ${color} mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">
        {label}
      </span>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
    </div>
  </div>
);