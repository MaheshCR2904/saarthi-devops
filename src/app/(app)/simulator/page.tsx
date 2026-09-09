"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ScenarioInput {
  label: string;
  careerPath: string;
  educationInvestment: number;
  startingSalary: number;
  growthRate: number;
  riskLevel: "low" | "medium" | "high";
}

interface ScenarioResult {
  label: string;
  year5Salary: number;
  year10Salary: number;
  year20Salary: number;
  retirementCorpus: number;
  netWorthAt40: number;
  riskLevel: string;
  verdict: string;
}

const PRESET_SCENARIOS = {
  mba_vs_tech: {
    scenarioA: {
      label: "MBA at 25",
      careerPath: "Product Manager",
      educationInvestment: 15,
      startingSalary: 800000,
      growthRate: 0.20,
      riskLevel: "medium" as const,
    },
    scenarioB: {
      label: "Stay in Tech",
      careerPath: "Software Engineer",
      educationInvestment: 0,
      startingSalary: 600000,
      growthRate: 0.18,
      riskLevel: "low" as const,
    },
  },
  startup_vs_mnc: {
    scenarioA: {
      label: "Join Startup",
      careerPath: "Software Engineer",
      educationInvestment: 0,
      startingSalary: 500000,
      growthRate: 0.25,
      riskLevel: "high" as const,
    },
    scenarioB: {
      label: "Join MNC",
      careerPath: "Software Engineer",
      educationInvestment: 0,
      startingSalary: 700000,
      growthRate: 0.12,
      riskLevel: "low" as const,
    },
  },
};

const DarkTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 border border-white/10 shadow-2xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-xs font-semibold" style={{ color: entry.name.includes("MBA") || entry.name.includes("Startup") ? "#6366f1" : "#f59e0b" }}>
            {entry.name}: ₹{(entry.value / 100000).toFixed(1)} Lakhs
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SimulatorPage() {
  const [scenarioA, setScenarioA] = useState<ScenarioInput>(
    PRESET_SCENARIOS.mba_vs_tech.scenarioA
  );
  const [scenarioB, setScenarioB] = useState<ScenarioInput>(
    PRESET_SCENARIOS.mba_vs_tech.scenarioB
  );
  const [results, setResults] = useState<{
    resultA: ScenarioResult;
    resultB: ScenarioResult;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ml/what-if", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioA, scenarioB }),
      });
      const data = await res.json();
      setResults({ resultA: data.resultA, resultB: data.resultB });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const applyPreset = (preset: keyof typeof PRESET_SCENARIOS) => {
    const p = PRESET_SCENARIOS[preset];
    setScenarioA(p.scenarioA);
    setScenarioB(p.scenarioB);
  };

  const updateScenario = (
    which: "A" | "B",
    field: keyof ScenarioInput,
    value: string | number
  ) => {
    const setter = which === "A" ? setScenarioA : setScenarioB;
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const comparisonData = results
    ? [
        {
          metric: "5 Yr Salary",
          [results.resultA.label]: results.resultA.year5Salary,
          [results.resultB.label]: results.resultB.year5Salary,
        },
        {
          metric: "10 Yr Salary",
          [results.resultA.label]: results.resultA.year10Salary,
          [results.resultB.label]: results.resultB.year10Salary,
        },
        {
          metric: "Net Worth @ 40",
          [results.resultA.label]: results.resultA.netWorthAt40,
          [results.resultB.label]: results.resultB.netWorthAt40,
        },
        {
          metric: "Retirement",
          [results.resultA.label]: results.resultA.retirementCorpus,
          [results.resultB.label]: results.resultB.retirementCorpus,
        },
      ]
    : [];

  const riskColors: Record<string, string> = {
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    high: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white">
      <div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">What-If Simulator 🔮</h1>
        <p className="text-slate-400 text-sm mt-1">
          Compare life paths side-by-side and see how different decisions affect your future
        </p>
      </div>

      {/* Presets */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Presets:</span>
        <button
          onClick={() => applyPreset("mba_vs_tech")}
          className="px-3.5 py-1.5 glass-amber rounded-full text-xs font-semibold text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
        >
          🎓 MBA vs Tech
        </button>
        <button
          onClick={() => applyPreset("startup_vs_mnc")}
          className="px-3.5 py-1.5 glass rounded-full text-xs font-semibold text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
        >
          🚀 Startup vs MNC
        </button>
      </div>

      {/* Scenarios Input */}
      <div className="grid lg:grid-cols-2 gap-6">
        {(["A", "B"] as const).map((which) => {
          const s = which === "A" ? scenarioA : scenarioB;
          const update = (f: keyof ScenarioInput, v: string | number) =>
            updateScenario(which, f, v);

          return (
            <div key={which} className="glass rounded-2xl p-6 border border-white/8 hover-lift">
              <h3 className="text-base font-bold font-[Outfit] mb-4 text-white">
                Scenario {which} {which === "A" ? "🅰️" : "🅱️"}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => update("label", e.target.value)}
                    className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Career Path</label>
                  <input
                    type="text"
                    value={s.careerPath}
                    onChange={(e) => update("careerPath", e.target.value)}
                    className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Education Investment (₹ Lakhs)
                  </label>
                  <input
                    type="number"
                    value={s.educationInvestment}
                    onChange={(e) => update("educationInvestment", Number(e.target.value))}
                    className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Starting Salary (₹/year)
                  </label>
                  <input
                    type="number"
                    value={s.startingSalary}
                    onChange={(e) => update("startingSalary", Number(e.target.value))}
                    className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1">
                    <span>Growth Rate</span>
                    <span className="text-amber-400 font-bold">{(s.growthRate * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    value={s.growthRate * 100}
                    onChange={(e) => update("growthRate", Number(e.target.value) / 100)}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Risk Level</label>
                  <select
                    value={s.riskLevel}
                    onChange={(e) => update("riskLevel", e.target.value)}
                    className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
                  >
                    <option value="low" className="bg-slate-900 text-slate-300">Low Risk</option>
                    <option value="medium" className="bg-slate-900 text-slate-300">Medium Risk</option>
                    <option value="high" className="bg-slate-900 text-slate-300">High Risk</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={runSimulation}
          disabled={loading}
          className="btn-premium px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-orange-500/20 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Simulating...
            </span>
          ) : (
            "🔮 Run Simulation"
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6 scale-in">
          {/* Comparison Chart */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="text-base font-bold font-[Outfit] mb-4">📊 Side-by-Side Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  type="number"
                  stroke="#475569"
                  fontSize={11}
                  tick={{ fill: "#64748b" }}
                  tickFormatter={(v) => `₹${((v as number) / 100000).toFixed(0)}L`}
                />
                <YAxis type="category" dataKey="metric" stroke="#475569" fontSize={11} tick={{ fill: "#94a3b8" }} width={100} axisLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend />
                <Bar
                  dataKey={results.resultA.label}
                  fill="#6366f1"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey={results.resultB.label}
                  fill="#f59e0b"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Verdict Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {([results.resultA, results.resultB] as ScenarioResult[]).map((r) => (
              <div
                key={r.label}
                className="glass rounded-2xl p-6 border border-white/8 hover-lift"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold font-[Outfit] text-white">{r.label}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${riskColors[r.riskLevel]}`}
                  >
                    {r.riskLevel === "high" ? "⚠️ High Risk" : r.riskLevel === "medium" ? "⚡ Medium Risk" : "🛡️ Low Risk"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 glass rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">5 Yr Salary</p>
                    <p className="text-base font-black text-white font-[Outfit]">
                      ₹{(r.year5Salary / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="p-3 glass rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">10 Yr Salary</p>
                    <p className="text-base font-black text-white font-[Outfit]">
                      ₹{(r.year10Salary / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="p-3 glass rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Net Worth @ 40</p>
                    <p className="text-base font-black text-emerald-400 font-[Outfit]">
                      ₹{(r.netWorthAt40 / 10000000).toFixed(1)}Cr
                    </p>
                  </div>
                  <div className="p-3 glass rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Retirement Corpus</p>
                    <p className="text-base font-black text-amber-400 font-[Outfit]">
                      ₹{(r.retirementCorpus / 10000000).toFixed(1)}Cr
                    </p>
                  </div>
                </div>
                <p className="mt-4 p-3.5 glass-amber rounded-xl text-xs text-amber-300 leading-relaxed border border-amber-500/20">
                  💡 {r.verdict}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
