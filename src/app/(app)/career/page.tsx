"use client";

import { useState, useEffect } from "react";
import { useSaarthi } from "@/components/SaarthiProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CareerPrediction {
  path: string;
  probability: number;
  matchReason: string;
  avgStartingSalary: number;
  growthPotential: "high" | "medium" | "stable";
}

interface SalaryProjection {
  year: number;
  projectedSalary: number;
  confidenceRange: { low: number; high: number };
}

interface SkillGap {
  missingSkills: string[];
  matchPercentage: number;
  recommendedResources: { skill: string; resourceType: string; suggestion: string }[];
}

const DarkTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 border border-white/10 shadow-2xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-xs font-semibold" style={{ color: entry.name === "Projected" ? "#f59e0b" : "#94a3b8" }}>
            {entry.name}: ₹{(entry.value / 100000).toFixed(1)} LPA
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CareerPage() {
  const { user } = useSaarthi();
  const [predictions, setPredictions] = useState<CareerPrediction[]>([]);
  const [projections, setProjections] = useState<SalaryProjection[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Software Engineer");
  const [currentSalary, setCurrentSalary] = useState(user?.currentSalary || 400000);

  const runCareerPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ml/career-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: user?.age,
          interests: user?.interests || [],
          skills: user?.skills || [],
          cgpa: user?.cgpa,
          stream: user?.stream,
        }),
      });
      const data = await res.json();
      setPredictions(data.predictions || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    runCareerPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSalaryProjection = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ml/salary-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerPath: targetRole, currentSalary }),
      });
      const data = await res.json();
      setProjections(data.projections || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const runSkillGap = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ml/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, skills: user?.skills || [] }),
      });
      const data = await res.json();
      setSkillGap(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const growthColors: Record<string, string> = {
    high: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    stable: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  const salaryChartData = projections.map((p) => ({
    year: `${p.year} Yrs`,
    Low: p.confidenceRange.low,
    Projected: p.projectedSalary,
    High: p.confidenceRange.high,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-white">
      <div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Career Engine 💼</h1>
        <p className="text-slate-400 text-sm mt-1">
          ML-powered career predictions, skill gap analysis, and salary projections
        </p>
      </div>

      {/* Top Career Path Matches */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-[Outfit]">🎯 Top Career Path Matches</h2>
          <button
            onClick={runCareerPrediction}
            disabled={loading}
            className="btn-premium px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Refresh Prediction"}
          </button>
        </div>

        {predictions.length > 0 ? (
          <div className="space-y-3">
            {predictions.map((p, idx) => (
              <div
                key={p.path}
                className="p-4 glass rounded-xl border border-white/5 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-slate-500 font-[Outfit]">#{idx + 1}</span>
                    <h3 className="text-base font-bold text-white">{p.path}</h3>
                  </div>
                  <span className="text-xl font-black text-amber-400 font-[Outfit]">{p.probability}%</span>
                </div>

                <div className="score-bar mb-3">
                  <div
                    className={`score-bar-fill ${
                      idx === 0
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : idx === 1
                        ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                        : "bg-gradient-to-r from-slate-400 to-slate-500"
                    }`}
                    style={{ width: `${p.probability}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-slate-300">💰 ₹{(p.avgStartingSalary / 100000).toFixed(1)} LPA avg. starting</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${growthColors[p.growthPotential]}`}>
                    {p.growthPotential === "high" ? "🚀 High Growth" : p.growthPotential === "medium" ? "📈 Medium Growth" : "📊 Stable"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{p.matchReason}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-xs">Click &quot;Refresh Prediction&quot; to calculate your matches</p>
          </div>
        )}
      </div>

      {/* Salary Growth Projector */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-lg font-bold font-[Outfit] mb-4">📊 Salary Growth Projector</h2>
        <div className="flex flex-wrap gap-3 mb-5">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="input-premium px-4 py-2.5 rounded-xl text-xs flex-1 min-w-[200px]"
          >
            {predictions.map((p) => (
              <option key={p.path} value={p.path} className="bg-slate-900 text-slate-300">{p.path}</option>
            ))}
            <option value="Software Engineer" className="bg-slate-900 text-slate-300">Software Engineer</option>
            <option value="Data Scientist" className="bg-slate-900 text-slate-300">Data Scientist</option>
            <option value="Product Manager" className="bg-slate-900 text-slate-300">Product Manager</option>
          </select>
          <input
            type="number"
            value={currentSalary}
            onChange={(e) => setCurrentSalary(Number(e.target.value))}
            placeholder="Current Salary"
            className="input-premium px-4 py-2.5 rounded-xl text-xs w-36"
          />
          <button
            onClick={runSalaryProjection}
            disabled={loading}
            className="btn-premium px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            Project →
          </button>
        </div>

        {projections.length > 0 && (
          <div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salaryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" stroke="#475569" fontSize={11} tick={{ fill: "#64748b" }} />
                <YAxis
                  stroke="#475569"
                  fontSize={11}
                  tick={{ fill: "#64748b" }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  axisLine={false}
                />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="Low" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Projected" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="High" fill="#fbbf24" radius={[4, 4, 0, 0]} opacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {projections.map((p) => (
                <div key={p.year} className="glass-amber rounded-xl p-3 text-center border border-amber-500/20">
                  <p className="text-[11px] text-amber-400 font-semibold">{p.year} Years</p>
                  <p className="text-lg font-black text-amber-300 font-[Outfit]">
                    ₹{(p.projectedSalary / 100000).toFixed(1)} LPA
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ₹{(p.confidenceRange.low / 100000).toFixed(1)} – ₹{(p.confidenceRange.high / 100000).toFixed(1)} LPA
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skill Gap Detector */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-[Outfit]">⚡ Skill Gap Detector</h2>
          <button
            onClick={runSkillGap}
            disabled={loading}
            className="btn-premium px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50"
          >
            Analyze Skills →
          </button>
        </div>

        {skillGap ? (
          <div>
            <div className="flex items-center gap-3 mb-4 p-4 glass-strong rounded-xl">
              <div className="text-3xl font-black text-purple-400 font-[Outfit]">{skillGap.matchPercentage}%</div>
              <div className="text-xs text-slate-300">
                Skill match score for <span className="text-white font-semibold">{targetRole}</span>
              </div>
            </div>

            {skillGap.missingSkills.length > 0 ? (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Missing Skills & Recommendations:</p>
                {skillGap.recommendedResources.map((r) => (
                  <div
                    key={r.skill}
                    className="flex items-start gap-3 p-3 glass rounded-xl border border-white/5"
                  >
                    <span className="text-amber-400 text-sm mt-0.5">⚠️</span>
                    <div>
                      <p className="text-xs font-bold text-white">{r.skill}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <span className="text-purple-400 font-semibold">{r.resourceType}:</span> {r.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-emerald-400 text-xs font-semibold">
                ✅ Great job! You possess all key skills for {targetRole}.
              </p>
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-xs">
            Click &quot;Analyze Skills&quot; to compare your profile against {targetRole} requirements.
          </p>
        )}
      </div>
    </div>
  );
}
