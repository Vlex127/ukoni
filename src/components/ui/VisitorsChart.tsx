"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface VisitorData {
  date: string;
  count: number;
}

interface VisitorsChartProps {
  data?: {
    currentPeriod: VisitorData[];
    previousPeriod: VisitorData[];
  };
  loading?: boolean;
  error?: string | null;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Helper function to format data for the chart
const formatChartData = (current: VisitorData[], previous: VisitorData[]) => {
  return months.map((month, index) => {
    const currentMonth = index + 1; // 1-12
    const currentData = current.find(item => {
      const date = new Date(item.date);
      return date.getMonth() + 1 === currentMonth;
    });
    
    const previousData = previous.find(item => {
      const date = new Date(item.date);
      return date.getMonth() + 1 === currentMonth;
    });

    return {
      name: month,
      thisYear: currentData?.count || 0,
      prevYear: previousData?.count || 0,
    };
  });
};

export default function VisitorsChart({ data, loading = false, error = null }: VisitorsChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [changePercentage, setChangePercentage] = useState(0);

  useEffect(() => {
    if (data) {
      const formattedData = formatChartData(data.currentPeriod, data.previousPeriod);
      setChartData(formattedData);
      
      // Calculate total visitors for current period
      const currentTotal = data.currentPeriod.reduce((sum, item) => sum + item.count, 0);
      const previousTotal = data.previousPeriod.reduce((sum, item) => sum + item.count, 0);
      
      setTotalVisitors(currentTotal);
      
      // Calculate percentage change
      if (previousTotal > 0) {
        const change = ((currentTotal - previousTotal) / previousTotal) * 100;
        setChangePercentage(parseFloat(change.toFixed(1)));
      }
    }
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-64 w-full mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Failed to load visitor data</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Visitors Overview</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold">{totalVisitors.toLocaleString()}</span>
            {changePercentage !== 0 && (
              <span className={`text-sm ${changePercentage >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {changePercentage > 0 ? '↑' : '↓'} {Math.abs(changePercentage)}%
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevYear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="thisYear"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorThisYear)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="prevYear"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorPrevYear)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Default export with sample data for storybook/demo
export const VisitorsChartWithSampleData = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const sampleData = {
    currentPeriod: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2023, i, 1).toISOString(),
      count: Math.floor(Math.random() * 100) + 50,
    })),
    previousPeriod: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2022, i, 1).toISOString(),
      count: Math.floor(Math.random() * 80) + 30,
    })),
  };

  return <VisitorsChart data={sampleData} loading={isLoading} />;
};