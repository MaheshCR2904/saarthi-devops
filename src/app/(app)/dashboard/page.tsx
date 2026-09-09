"use client";

import { useState, useEffect } from "react";
import { useSaarthi } from "@/components/SaarthiProvider";
import Link from "next/link";
import Icon3D from "@/components/Icon3D";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from "recharts";

interface DashboardData {
  user: {
    name: string;
    age: number | null;
    lifeStage: string;
    stream: string;
    college: string;
    cgpa: number;
    currentRole: string;
    targetRole: string;
    skills: string[];
    interests: string[];
    careerScore: number;
    financeScore: number;
    skillsScore: number;
    wellbeingScore: number;
    overallLifeScore: number;
    currentStreak: number;
    longestStreak: number;
    currentSalary: number;
    monthlySavings: number;
  };
  stageInfo: {
    name: string;
    description: string;
    ageRange: string;
    focus: string[];
  };
  recentEvents: Array<{
    id: number;
    eventType: string;
    title: string;
    description: string;
    occurredAt: string;
    impactScore: number;
  }>;
  recentMoods: Array<{
    id: number;
    mood: string;
    note: string;
    createdAt: string;
  }>;
  activePredictions: Array<{
    id: number;
    modelType: string;
    outputPrediction: unknown;
    createdAt: string;
  }>;
  unreadAlerts: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
  }>;
}

const stageLabels: Record<string, { name: string; emoji: string; color: string; vedic: string }> = {
  stage_1: { name: "Explorer", emoji: "🧭", color: "text-amber-400", vedic: "Bramhacharya" },
  stage_2: { name: "Builder", emoji: "🏗️", color: "text-amber-300", vedic: "Grihastha" },
  stage_3: { name: "Launcher", emoji: "🚀", color: "text-orange-400", vedic: "Purushartha" },
  stage_4: { name: "Accelerator", emoji: "⚡", color: "text-amber-500", vedic: "Karma" },
  stage_5: { name: "Transformer", emoji: "🔄", color: "text-yellow-400", vedic: "Dharma" },
  stage_6: { name: "Legacy Builder", emoji: "🏛️", color: "text-rose-400", vedic: "Vanaprastha" },
};

const RoyalTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-saffron rounded-xl px-4 py-3 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
        <p className="text-[11px] font-sans text-amber-400/70 mb-1 uppercase tracking-wider">Age {label}</p>
        <p className="text-sm font-bold text-amber-300">
          {typeof payload[0].value === "number" && payload[0].value > 1000
            ? `₹${(payload[0].value / 100000).toFixed(2)} LPA`
            : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useSaarthi();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="relative">
          <div className="animate-spin w-14 h-14 border-2 border-amber-500/30 border-t-amber-400 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🛞</div>
        </div>
        <p className="text-amber-400/60 text-xs font-sans font-semibold uppercase tracking-widest animate-pulse">
          SAARTHI IS CONSULTING THE STARS...
        </p>
      </div>
    );
  }

  const userData = data?.user || user;
  const stageInfo = data?.stageInfo;
  const stage = stageLabels[userData?.lifeStage || "stage_1"];

  const radarData = [
    { subject: "Career", score: userData?.careerScore || 50, fullMark: 100 },
    { subject: "Finance", score: userData?.financeScore || 50, fullMark: 100 },
    { subject: "Skills", score: userData?.skillsScore || 50, fullMark: 100 },
    { subject: "Wellbeing", score: userData?.wellbeingScore || 50, fullMark: 100 },
  ];

  const timelineData = [
    { age: 16, salary: 0 },
    { age: 22, salary: (userData?.currentSalary || 0) * 0.6 },
    { age: userData?.age || 21, salary: userData?.currentSalary || 350000 },
    { age: 26, salary: (userData?.currentSalary || 400000) * 1.4 },
    { age: 30, salary: (userData?.currentSalary || 400000) * 2.0 },
  ];

  const scoreCards = [
    {
      label: "Overall Life Score",
      value: userData?.overallLifeScore,
      gradient: "from-amber-400 to-orange-500",
      bg: "from-amber-500/15 to-transparent",
      border: "border-amber-500/30",
      glow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]",
      icon: "star" as const,
      textColor: "text-amber-400",
    },
    {
      label: "Career",
      value: userData?.careerScore,
      gradient: "from-blue-400 to-indigo-500",
      bg: "from-blue-500/10 to-transparent",
      border: "border-blue-500/30",
      glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]",
      icon: "briefcase" as const,
      textColor: "text-blue-400",
    },
    {
      label: "Finance",
      value: userData?.financeScore,
      gradient: "from-emerald-400 to-teal-500",
      bg: "from-emerald-500/10 to-transparent",
      border: "border-emerald-500/30",
      glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
      icon: "coin" as const,
      textColor: "text-emerald-400",
    },
    {
      label: "Wellbeing",
      value: userData?.wellbeingScore,
      gradient: "from-rose-400 to-pink-500",
      bg: "from-rose-500/10 to-transparent",
      border: "border-rose-500/30",
      glow: "hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]",
      icon: "heart" as const,
      textColor: "text-rose-400",
    },
  ];

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Welcome Header */}
      <div className="fade-up flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black font-[Cinzel] text-white">
            Welcome back, {userData?.name?.split(" ")[0]} 🛞
          </h1>
          <p className={`mt-1 text-xs font-sans font-semibold uppercase tracking-widest ${stage?.color || "text-amber-400"}`}>
            {stage?.emoji} {stage?.name} · {stage?.vedic} · Age {userData?.age || "?"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center glass-saffron rounded-2xl px-5 py-2.5 border border-amber-500/30 glow-amber-sm">
            <div className="text-2xl font-black text-amber-400 font-[Cinzel]">{userData?.currentStreak || 0}</div>
            <div className="text-[10px] font-sans text-amber-400/70 uppercase tracking-wider">STREAK 🔥</div>
          </div>
          <Link
            href="/checkin"
            className="btn-premium px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-black rounded-xl font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            Daily Check-in →
          </Link>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {scoreCards.map((card) => (
          <div
            key={card.label}
            className={`hover-lift p-5 rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} ${card.glow}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <Icon3D name={card.icon} size={32} />
            </div>
            <div className={`text-3xl font-black font-[Cinzel] ${card.textColor}`}>
              {card.value || 50}
              <span className="text-xs font-normal text-slate-500 font-sans">/100</span>
            </div>
            <div className="mt-3 score-bar">
              <div
                className={`score-bar-fill bg-gradient-to-r ${card.gradient}`}
                style={{ width: `${card.value || 50}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Radar + Stage */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass-saffron rounded-2xl p-6 border border-amber-500/25 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold font-[Cinzel] text-white">Life Score Breakdown</h2>
            <span className="text-[10px] font-sans px-2.5 py-1 glass rounded-full text-amber-400 border border-amber-500/30 uppercase tracking-wider">DHARMA CHART</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(245,158,11,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#f59e0b", fontSize: 11, fontWeight: 700 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.2}
                strokeWidth={2.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stage Info */}
        <div className="glass rounded-2xl p-6 border border-amber-500/20 hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              {stage?.emoji}
            </div>
            <div>
              <h2 className="text-base font-bold font-[Cinzel] text-amber-300">
                {stageInfo?.name || stage?.name}
              </h2>
              <p className={`text-xs font-sans font-semibold uppercase tracking-wider ${stage?.color}`}>
                {stage?.vedic} · {stageInfo?.ageRange || "16-18"}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-5 font-sans">{stageInfo?.description}</p>
          <div className="space-y-2 mb-5">
            {stageInfo?.focus?.map((f: string) => (
              <div key={f} className="flex items-center gap-2.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                <span className="text-slate-300 font-sans">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Chart */}
      <div className="glass rounded-2xl p-6 border border-amber-500/15 hover-lift">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold font-[Cinzel] text-white">📈 Salary Growth Trajectory</h2>
            <p className="text-xs font-sans text-amber-400/50 mt-0.5 uppercase tracking-wider">KARMA-PHALA PROJECTION ENGINE</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={timelineData}>
            <defs>
              <linearGradient id="royalArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="age" stroke="#334155" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
            <YAxis
              stroke="#334155"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickFormatter={(v) => (v > 0 ? `₹${(v / 100000).toFixed(0)}L` : "₹0")}
            />
            <Tooltip content={<RoyalTooltip />} />
            <Area
              type="monotone"
              dataKey="salary"
              stroke="#f59e0b"
              strokeWidth={3}
              fill="url(#royalArea)"
              dot={{ fill: "#f59e0b", r: 4 }}
              activeDot={{ r: 7, fill: "#fbbf24" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Academic Navigator", href: "/academic", icon: "graduation" as const, border: "border-blue-500/30", text: "text-blue-300" },
          { label: "Career Engine", href: "/career", icon: "briefcase" as const, border: "border-purple-500/30", text: "text-purple-300" },
          { label: "What-If Simulator", href: "/simulator", icon: "crystal" as const, border: "border-indigo-500/30", text: "text-indigo-300" },
          { label: "Talk to Saarthi", href: "/saarthi", icon: "meditation" as const, border: "border-amber-500/30", text: "text-amber-300" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`hover-lift p-4 rounded-2xl glass border ${action.border} flex items-center gap-3 group`}
          >
            <span className="transform group-hover:scale-110 transition-transform">
              <Icon3D name={action.icon} size={32} />
            </span>
            <span className={`text-xs font-bold ${action.text} font-sans`}>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
