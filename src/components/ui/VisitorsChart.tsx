
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", thisYear: 40, prevYear: 24 },
  { name: "Feb", thisYear: 30, prevYear: 13 },
  { name: "Mar", thisYear: 60, prevYear: 38 },
  { name: "Apr", thisYear: 45, prevYear: 30 },
  { name: "May", thisYear: 80, prevYear: 50 },
  { name: "Jun", thisYear: 55, prevYear: 35 },
  { name: "Jul", thisYear: 75, prevYear: 45 },
  { name: "Aug", thisYear: 50, prevYear: 30 },
  { name: "Sep", thisYear: 40, prevYear: 25 },
  { name: "Oct", thisYear: 45, prevYear: 28 },
  { name: "Nov", thisYear: 35, prevYear: 18 },
  { name: "Dec", thisYear: 50, prevYear: 30 },
];

export default function VisitorsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
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
  );
}