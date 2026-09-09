"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSaarthi } from "@/components/SaarthiProvider";

const INTEREST_OPTIONS = [
  "Technology & Coding",
  "Business & Entrepreneurship",
  "Design & Creativity",
  "Finance & Accounting",
  "Healthcare & Medicine",
  "Research & Academics",
  "Marketing & Communication",
  "Engineering & Manufacturing",
  "Public Service & Governance",
  "Data & Analytics",
  "Writing & Content",
  "Teaching & Mentoring",
];

const SKILL_OPTIONS = [
  "Programming",
  "Data Analysis",
  "Communication",
  "Problem Solving",
  "Leadership",
  "Design Thinking",
  "Financial Analysis",
  "Research",
  "Content Creation",
  "Project Management",
  "Public Speaking",
  "Critical Thinking",
];

export default function OnboardingPage() {
  const { user, refreshUser } = useSaarthi();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [education, setEducation] = useState(user?.education || "");
  const [stream, setStream] = useState(user?.stream || "");
  const [cgpa, setCgpa] = useState(user?.cgpa || 0);
  const [targetRole, setTargetRole] = useState(user?.targetRole || "");
  const [goalRawText, setGoalRawText] = useState("");
  const [currentSalary, setCurrentSalary] = useState(user?.currentSalary || 0);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (i: string) => {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  const toggleSkill = (s: string) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests,
          skills,
          education,
          stream,
          cgpa,
          targetRole,
          goalRawText,
          currentSalary,
        }),
      });
      await refreshUser();
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const stepTitles = [
    { title: "Step 1: Your Interests", icon: "🎨", subtitle: "Select all that interest you. This helps Saarthi understand what paths excite you." },
    { title: "Step 2: Your Skills", icon: "⚡", subtitle: "What are you good at? Be honest — Saarthi will help you fill the gaps." },
    { title: "Step 3: Education & Career", icon: "🎓", subtitle: "Tell us about your background so we can personalize your guidance." },
    { title: "Step 4: Your Goals", icon: "🎯", subtitle: "Describe your life goals in your own words. Saarthi will parse them to understand your aspirations." },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 text-white">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-3xl mb-3 shadow-lg glow-amber-sm">
          🛞
        </div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Welcome to Saarthi!</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Let&apos;s set up your profile so Saarthi can guide you better.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2 justify-center">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                step >= s
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg glow-amber-sm"
                  : "glass text-slate-500 border border-white/5"
              }`}
            >
              {step > s ? "✓" : s}
            </div>
            {s < 4 && (
              <div
                className={`w-8 h-0.5 rounded-full transition-all ${
                  step > s ? "bg-amber-500" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Glass Card */}
      <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl scale-in">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{stepTitles[step - 1].icon}</span>
            <h2 className="text-xl font-bold font-[Outfit] text-white">{stepTitles[step - 1].title}</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{stepTitles[step - 1].subtitle}</p>
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2.5">
            {INTEREST_OPTIONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleInterest(i)}
                className={`p-3 rounded-xl text-xs text-left transition-all font-medium ${
                  interests.includes(i)
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 border"
                    : "glass border border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                {interests.includes(i) ? "✓ " : ""}
                {i}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-2.5">
            {SKILL_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSkill(s)}
                className={`p-3 rounded-xl text-xs text-left transition-all font-medium ${
                  skills.includes(s)
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300 border"
                    : "glass border border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                {skills.includes(s) ? "✓ " : ""}
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Education & Career */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Education</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="input-premium w-full px-4 py-3 rounded-xl text-sm"
              >
                <option value="" className="bg-slate-900 text-slate-300">Select...</option>
                <option value="high_school" className="bg-slate-900 text-slate-300">High School</option>
                <option value="bachelors" className="bg-slate-900 text-slate-300">Bachelor&apos;s Degree</option>
                <option value="masters" className="bg-slate-900 text-slate-300">Master&apos;s Degree</option>
                <option value="phd" className="bg-slate-900 text-slate-300">PhD</option>
                <option value="diploma" className="bg-slate-900 text-slate-300">Diploma</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Stream</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="input-premium w-full px-4 py-3 rounded-xl text-sm"
              >
                <option value="" className="bg-slate-900 text-slate-300">Select...</option>
                <option value="Science" className="bg-slate-900 text-slate-300">Science</option>
                <option value="Computer Science" className="bg-slate-900 text-slate-300">Computer Science</option>
                <option value="Commerce" className="bg-slate-900 text-slate-300">Commerce</option>
                <option value="Arts" className="bg-slate-900 text-slate-300">Arts</option>
                <option value="Engineering" className="bg-slate-900 text-slate-300">Engineering</option>
                <option value="Management" className="bg-slate-900 text-slate-300">Management</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">CGPA (if applicable)</label>
              <input
                type="number"
                value={cgpa || ""}
                onChange={(e) => setCgpa(Number(e.target.value))}
                min={0}
                max={10}
                step={0.1}
                placeholder="e.g. 8.5"
                className="input-premium w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Software Engineer, Data Scientist..."
                className="input-premium w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Annual Salary (₹)
              </label>
              <input
                type="number"
                value={currentSalary || ""}
                onChange={(e) => setCurrentSalary(Number(e.target.value))}
                placeholder="e.g. 600000"
                className="input-premium w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 4: Goals */}
        {step === 4 && (
          <div className="space-y-3">
            <textarea
              value={goalRawText}
              onChange={(e) => setGoalRawText(e.target.value)}
              rows={5}
              placeholder="E.g., I want to work in technology, earn a good salary, and eventually move abroad for better opportunities. I'm also interested in starting my own company someday..."
              className="input-premium w-full px-4 py-3 rounded-xl text-sm resize-none"
            />
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>🧘 Be as detailed as you like</span>
              <span>{goalRawText.length} characters</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8 pt-4 border-t border-white/8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3.5 glass border border-white/10 text-white rounded-xl hover:bg-white/8 transition-all font-medium text-sm"
            >
              ← Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-premium flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 text-sm"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-premium flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 disabled:opacity-50 text-sm"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </span>
              ) : (
                "🚀 Complete Setup & Go to Dashboard"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
