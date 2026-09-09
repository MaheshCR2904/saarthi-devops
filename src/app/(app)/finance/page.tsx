"use client";

import { useState } from "react";
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

const DarkTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 border border-white/10 shadow-2xl">
        <p className="text-xs text-slate-400 mb-1">In {label} years</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-xs font-semibold" style={{ color: entry.name.includes("40%") ? "#10b981" : "#f59e0b" }}>
            {entry.name}: ₹{(entry.value / 10000000).toFixed(2)} Cr
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancePage() {
  const { user } = useSaarthi();
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || 30000);
  const [monthlySavings, setMonthlySavings] = useState(user?.monthlySavings || 10000);
  const [emergencyFund, setEmergencyFund] = useState(0);

  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

  const projectionData = [
    { year: 0, "At 30% Savings": 0, "At 40% Savings": 0 },
    ...[5, 10, 15, 20, 25, 30, 35].map((year) => {
      const r = 0.10;
      const save30 = monthlySavings * 12;
      const save40 = monthlyIncome * 0.4 * 12;
      return {
        year,
        "At 30% Savings": Math.round(save30 * ((Math.pow(1 + r, year) - 1) / r)),
        "At 40% Savings": Math.round(save40 * ((Math.pow(1 + r, year) - 1) / r)),
      };
    }),
  ];

  const retirementAge = 60;
  const currentAge = user?.age || 25;
  const yearsToRetirement = retirementAge - currentAge;

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-white">
      <div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Finance Planner 💰</h1>
        <p className="text-slate-400 text-sm mt-1">
          Savings tracker, retirement projections, and first salary guidance
        </p>
      </div>

      {/* Input Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/8 hover-lift">
          <p className="text-xs font-semibold text-slate-400 mb-1">Monthly Income (₹)</p>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full text-2xl font-black font-[Outfit] text-white bg-transparent border-b border-white/10 focus:border-amber-400 focus:outline-none py-1"
          />
        </div>
        <div className="glass rounded-2xl p-5 border border-white/8 hover-lift">
          <p className="text-xs font-semibold text-slate-400 mb-1">Monthly Savings (₹)</p>
          <input
            type="number"
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(Number(e.target.value))}
            className="w-full text-2xl font-black font-[Outfit] text-emerald-400 bg-transparent border-b border-white/10 focus:border-emerald-400 focus:outline-none py-1"
          />
        </div>
        <div className="glass rounded-2xl p-5 border border-white/8 hover-lift">
          <p className="text-xs font-semibold text-slate-400 mb-1">Emergency Fund (₹)</p>
          <input
            type="number"
            value={emergencyFund}
            onChange={(e) => setEmergencyFund(Number(e.target.value))}
            className="w-full text-2xl font-black font-[Outfit] text-indigo-400 bg-transparent border-b border-white/10 focus:border-indigo-400 focus:outline-none py-1"
          />
        </div>
      </div>

      {/* Savings Rate Gauge */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold font-[Outfit]">Savings Rate</h2>
          <span className="text-2xl font-black font-[Outfit] text-amber-400">{savingsRate.toFixed(1)}%</span>
        </div>
        <div className="score-bar mb-2">
          <div
            className={`score-bar-fill ${
              savingsRate >= 30
                ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                : savingsRate >= 20
                ? "bg-gradient-to-r from-amber-400 to-orange-500"
                : "bg-gradient-to-r from-rose-400 to-pink-500"
            }`}
            style={{ width: `${Math.min(savingsRate, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span>0%</span>
          <span>20% (Good)</span>
          <span>30% (Great)</span>
          <span>50% (Excellent)</span>
        </div>
        <p className="text-xs text-slate-300 mt-3">
          {savingsRate >= 30
            ? "✅ Excellent savings rate! You're building strong financial habits."
            : savingsRate >= 20
            ? "👍 Good savings rate. Try to push it to 30% for faster wealth building."
            : "💡 Aim to save at least 20% of your income. Start small and increase gradually."}
        </p>
      </div>

      {/* 50/30/20 Rule */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-base font-bold font-[Outfit] mb-1">📋 First Salary Guide: 50/30/20 Rule</h2>
        <p className="text-xs text-slate-400 mb-4">A simple budgeting framework for young earners</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-4 glass rounded-xl border border-blue-500/20 bg-blue-500/10">
            <p className="text-xl font-black text-blue-400 font-[Outfit]">
              ₹{((monthlyIncome * 0.5) / 1000).toFixed(0)}K
            </p>
            <p className="text-xs font-bold text-blue-300 mt-1">50% Needs</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Rent, food, bills</p>
          </div>
          <div className="p-4 glass rounded-xl border border-purple-500/20 bg-purple-500/10">
            <p className="text-xl font-black text-purple-400 font-[Outfit]">
              ₹{((monthlyIncome * 0.3) / 1000).toFixed(0)}K
            </p>
            <p className="text-xs font-bold text-purple-300 mt-1">30% Wants</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Dining, entertainment</p>
          </div>
          <div className="p-4 glass rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <p className="text-xl font-black text-emerald-400 font-[Outfit]">
              ₹{((monthlyIncome * 0.2) / 1000).toFixed(0)}K
            </p>
            <p className="text-xs font-bold text-emerald-300 mt-1">20% Savings</p>
            <p className="text-[10px] text-slate-400 mt-0.5">SIP, emergency fund</p>
          </div>
        </div>
      </div>

      {/* Retirement Projection Chart */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-base font-bold font-[Outfit] mb-1">
          🏖️ Retirement Corpus Projection (Age {currentAge} → {retirementAge})
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          {yearsToRetirement} years to retirement · Assuming 10% annual compounding
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" stroke="#475569" fontSize={11} tick={{ fill: "#64748b" }} />
            <YAxis
              stroke="#475569"
              fontSize={11}
              tick={{ fill: "#64748b" }}
              tickFormatter={(v) => `₹${((v as number) / 10000000).toFixed(0)}Cr`}
              axisLine={false}
            />
            <Tooltip content={<DarkTooltip />} />
            <Line type="monotone" dataKey="At 30% Savings" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: "#f59e0b" }} />
            <Line type="monotone" dataKey="At 40% Savings" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: "#10b981" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tips Card */}
      <div className="glass-amber rounded-2xl p-6 border border-amber-500/20">
        <h3 className="text-sm font-bold text-amber-300 mb-3">💡 Financial Tips for Your Life Stage</h3>
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>• Start a SIP of ₹{(monthlySavings * 0.5).toFixed(0)}/month in an index fund — consistency beats timing</p>
          <p>• Build an emergency fund of 6 months expenses: ₹{((monthlyIncome - monthlySavings) * 6).toLocaleString("en-IN")}</p>
          <p>• Get term insurance by age 30 — it&apos;s significantly cheaper when you&apos;re young</p>
          <p>• Avoid lifestyle inflation — when your salary increases, boost savings first</p>
          <p>• Track your net worth monthly — what gets measured gets managed</p>
        </div>
      </div>
    </div>
  );
}
