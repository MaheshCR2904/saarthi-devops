"use client";

import { useState } from "react";
import { useSaarthi } from "@/components/SaarthiProvider";

interface College {
  name: string;
  location: string;
  avgCutoff: number;
  fees: string;
  placement: string;
  matchScore: number;
}

const STREAM_RECOMMENDATIONS: Record<
  string,
  { streams: string[]; reason: string; careers: string[] }
> = {
  "Technology & Coding": {
    streams: ["Science (PCM)", "Computer Science"],
    reason: "Your interest in technology aligns perfectly with the Science stream with Mathematics and Computer Science. This opens doors to engineering, software development, and AI fields.",
    careers: ["Software Engineer", "Data Scientist", "AI Engineer", "Web Developer"],
  },
  "Business & Entrepreneurship": {
    streams: ["Commerce", "Commerce with Mathematics"],
    reason: "Commerce gives you a strong foundation in business principles, accounting, and economics — essential for entrepreneurship.",
    careers: ["Entrepreneur", "Business Analyst", "Chartered Accountant", "MBA"],
  },
  "Design & Creativity": {
    streams: ["Arts / Humanities", "Science (with Design)"],
    reason: "Design-oriented careers benefit from a blend of creative thinking and technical skills. Arts or Science with Design focus are both strong choices.",
    careers: ["UX Designer", "Graphic Designer", "Architect", "Product Designer"],
  },
  "Healthcare & Medicine": {
    streams: ["Science (PCB)"],
    reason: "A strong foundation in Biology, Chemistry, and Physics is essential for medical careers.",
    careers: ["Doctor", "Pharmacist", "Biotechnologist", "Healthcare Manager"],
  },
  default: {
    streams: ["Science", "Commerce", "Arts"],
    reason: "Based on a balanced profile, all streams are viable. Focus on what excites you most.",
    careers: ["Explore various paths", "Take career assessment", "Talk to Saarthi AI"],
  },
};

const MOCK_COLLEGES: College[] = [
  { name: "IIT Madras", location: "Chennai", avgCutoff: 98, fees: "₹8L total", placement: "₹16 LPA avg", matchScore: 92 },
  { name: "BITS Pilani", location: "Pilani", avgCutoff: 85, fees: "₹12L total", placement: "₹14 LPA avg", matchScore: 88 },
  { name: "NIT Karnataka", location: "Surathkal", avgCutoff: 90, fees: "₹5L total", placement: "₹10 LPA avg", matchScore: 85 },
  { name: "RV College of Engineering", location: "Bangalore", avgCutoff: 80, fees: "₹4L total", placement: "₹9 LPA avg", matchScore: 82 },
  { name: "MIT Manipal", location: "Manipal", avgCutoff: 75, fees: "₹10L total", placement: "₹8 LPA avg", matchScore: 78 },
  { name: "SRM University", location: "Chennai", avgCutoff: 70, fees: "₹7L total", placement: "₹7 LPA avg", matchScore: 74 },
];

export default function AcademicPage() {
  const { user } = useSaarthi();
  const [selectedInterest, setSelectedInterest] = useState(user?.interests?.[0] || "Technology & Coding");
  const [cgpa, setCgpa] = useState(user?.cgpa || 7.0);
  const [targetCgpa, setTargetCgpa] = useState(8.0);

  const recommendation =
    STREAM_RECOMMENDATIONS[selectedInterest] || STREAM_RECOMMENDATIONS.default;

  const cgpaGap = targetCgpa - cgpa;
  const cgpaAnalysis =
    cgpaGap <= 0
      ? "✅ Your CGPA meets or exceeds the target!"
      : cgpaGap <= 0.5
      ? `⚠️ You're ${cgpaGap.toFixed(1)} points short. Easily achievable with consistent effort.`
      : `🔴 You're ${cgpaGap.toFixed(1)} points short. Here's a concrete plan to bridge the gap.`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-white">
      <div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Academic Navigator 🎓</h1>
        <p className="text-slate-400 text-sm mt-1">
          Stream selection, college matching, and CGPA impact analysis for ages 16–22
        </p>
      </div>

      {/* Stream Selector */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-lg font-bold font-[Outfit] mb-4">🧭 Stream Selector</h2>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Primary Interest</label>
          <select
            value={selectedInterest}
            onChange={(e) => setSelectedInterest(e.target.value)}
            className="input-premium w-full px-4 py-3 rounded-xl text-sm"
          >
            {Object.keys(STREAM_RECOMMENDATIONS).filter(k => k !== "default").map((k) => (
              <option key={k} value={k} className="bg-slate-900 text-slate-300">{k}</option>
            ))}
          </select>
        </div>

        <div className="p-4 glass-emerald rounded-xl border border-emerald-500/20 bg-emerald-500/10">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Recommended Streams:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {recommendation.streams.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold"
              >
                ✅ {s}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{recommendation.reason}</p>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-400 mb-2">Potential Career Paths:</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.careers.map((c) => (
              <span key={c} className="px-3 py-1.5 glass text-indigo-300 border border-indigo-500/20 rounded-full text-xs font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CGPA Impact Analyzer */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-lg font-bold font-[Outfit] mb-4">📊 CGPA Impact Analyzer</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Current CGPA</label>
            <input
              type="number"
              value={cgpa}
              onChange={(e) => setCgpa(Number(e.target.value))}
              min={0}
              max={10}
              step={0.1}
              className="input-premium w-full px-4 py-3 rounded-xl text-lg font-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Company&apos;s Expected CGPA</label>
            <input
              type="number"
              value={targetCgpa}
              onChange={(e) => setTargetCgpa(Number(e.target.value))}
              min={0}
              max={10}
              step={0.1}
              className="input-premium w-full px-4 py-3 rounded-xl text-lg font-black"
            />
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${cgpaGap <= 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : cgpaGap <= 0.5 ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-rose-500/10 border-rose-500/30 text-rose-300"}`}>
          <p className="text-sm font-semibold">{cgpaAnalysis}</p>
        </div>

        {cgpaGap > 0 && (
          <div className="mt-4 space-y-2.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gap Closure Plan:</p>
            {[
              `Focus on high-credit subjects first — improving from C to B in a 4-credit course has 4× the impact`,
              `Target ${(cgpa + 0.3).toFixed(1)} CGPA this semester — small, achievable goals`,
              `Dedicate 2 extra hours daily to subjects where you scored lowest`,
              `Form a study group — peer learning improves retention by 50%`,
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="text-amber-400 font-bold">{i + 1}.</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* College Matcher */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-lg font-bold font-[Outfit] mb-1">🏛️ College Matcher</h2>
        <p className="text-xs text-slate-400 mb-4">
          Based on your profile: <span className="text-amber-400 font-medium">{user?.stream || "Science"}</span> stream, CGPA <span className="text-amber-400 font-medium">{cgpa}</span>
        </p>

        <div className="space-y-3">
          {MOCK_COLLEGES.map((college) => (
            <div
              key={college.name}
              className="flex items-center justify-between p-4 glass rounded-xl border border-white/5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm group-hover:scale-105 transition-transform">
                  {college.matchScore}%
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{college.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    📍 {college.location} · 💰 {college.fees} · 🎯 {college.placement}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400">
                  Cutoff: <span className="text-amber-400">{college.avgCutoff}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
