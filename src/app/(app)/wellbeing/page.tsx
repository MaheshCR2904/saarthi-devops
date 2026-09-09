"use client";

import { useState, useEffect } from "react";
import { useSaarthi } from "@/components/SaarthiProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WellbeingAnalysis {
  wellbeingScore: number;
  trend: "improving" | "stable" | "declining";
  riskFlag: "none" | "mild" | "moderate" | "concerning";
  insight: string;
}

interface MoodLog {
  id: number;
  mood: string;
  note: string;
  lifeUpdate: string;
  wellbeingScore: number;
  createdAt: string;
}

const moodEmojis: Record<string, string> = {
  great: "😄",
  good: "🙂",
  okay: "😐",
  low: "😔",
  stressed: "😰",
  anxious: "😟",
};

const trendIcons: Record<string, string> = {
  improving: "📈",
  stable: "📊",
  declining: "📉",
};

const riskStyles: Record<string, string> = {
  none: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  mild: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  moderate: "bg-orange-500/10 border-orange-500/30 text-orange-300",
  concerning: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const DarkTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 border border-white/10 shadow-2xl text-white">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-amber-400">Score: {payload[0].value}/100</p>
      </div>
    );
  }
  return null;
};

export default function WellbeingPage() {
  const { user } = useSaarthi();
  const [analysis, setAnalysis] = useState<WellbeingAnalysis | null>(null);
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/ml/wellbeing").then((r) => r.json()),
      fetch("/api/mood?limit=30").then((r) => r.json()),
    ])
      .then(([analysisData, moodData]) => {
        setAnalysis(analysisData);
        setLogs(moodData.logs || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const chartData = [...logs]
    .reverse()
    .slice(-14)
    .map((l) => ({
      date: new Date(l.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      score: l.wellbeingScore || 50,
      mood: l.mood,
    }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-white">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
        <p className="text-xs text-slate-500">Analyzing wellbeing data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-white">
      <div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Wellbeing Tracker 💙</h1>
        <p className="text-slate-400 text-sm mt-1">
          Sensitive, non-clinical, supportive — observe your patterns without judgment
        </p>
      </div>

      {/* Analysis Card */}
      {analysis && (
        <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold font-[Outfit] text-white">Your Wellbeing Overview</h2>
            <span className="text-2xl">{trendIcons[analysis.trend]}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-4 glass rounded-xl">
              <p className="text-3xl font-black text-amber-400 font-[Outfit]">{analysis.wellbeingScore}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Wellbeing Score</p>
            </div>
            <div className="text-center p-4 glass rounded-xl">
              <p className="text-lg font-bold text-white capitalize font-[Outfit]">{analysis.trend}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Trend</p>
            </div>
            <div className="text-center p-4 glass rounded-xl">
              <p className="text-lg font-bold text-white capitalize font-[Outfit]">{analysis.riskFlag}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Risk Level</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${riskStyles[analysis.riskFlag]}`}>
            <p className="text-xs leading-relaxed">{analysis.insight}</p>
          </div>

          {analysis.riskFlag === "concerning" && (
            <div className="mt-4 p-4 glass-amber rounded-xl border border-rose-500/30">
              <p className="text-xs font-bold text-rose-300 mb-2">
                🫂 We notice your wellbeing score has been lower recently. Please remember:
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <li>• This is a pattern observation, not a clinical diagnosis</li>
                <li>• Consider talking to a trusted friend, family member, or mentor</li>
                <li>• Professional support is available — iCALL: 9152987821 (free, confidential)</li>
                <li>• Saarthi is here 24/7 to talk — you&apos;re never alone</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Mood Chart */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-base font-bold font-[Outfit] mb-4">Mood Trend (Last 14 Days)</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" stroke="#475569" fontSize={11} tick={{ fill: "#64748b" }} />
              <YAxis domain={[0, 100]} stroke="#475569" fontSize={11} tick={{ fill: "#64748b" }} axisLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ fill: "#f59e0b", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-slate-500 text-xs py-8">
            Start logging your mood to see trends here
          </p>
        )}
      </div>

      {/* Recent Logs */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-base font-bold font-[Outfit] mb-4">Recent Mood Logs</h2>
        {logs.length > 0 ? (
          <div className="space-y-2">
            {logs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 glass rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{moodEmojis[log.mood] || "😐"}</span>
                  <div>
                    <span className="text-xs font-bold text-white capitalize">{log.mood}</span>
                    {log.note && <p className="text-[11px] text-slate-400 truncate max-w-[240px]">{log.note}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500">
                    {new Date(log.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-xs text-center py-6">
            No mood logs yet. Do your first daily check-in!
          </p>
        )}
      </div>
    </div>
  );
}
