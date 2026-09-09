"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSaarthi } from "@/components/SaarthiProvider";

const MOODS = [
  { value: "great", emoji: "😄", label: "Great", color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" },
  { value: "good", emoji: "🙂", label: "Good", color: "bg-blue-500/20 border-blue-500/50 text-blue-300" },
  { value: "okay", emoji: "😐", label: "Okay", color: "bg-slate-500/20 border-slate-400/50 text-slate-300" },
  { value: "low", emoji: "😔", label: "Low", color: "bg-amber-500/20 border-amber-500/50 text-amber-300" },
  { value: "stressed", emoji: "😰", label: "Stressed", color: "bg-orange-500/20 border-orange-500/50 text-orange-300" },
  { value: "anxious", emoji: "😟", label: "Anxious", color: "bg-rose-500/20 border-rose-500/50 text-rose-300" },
];

const LIFE_UPDATES = [
  "Learned a new skill",
  "Applied for a job",
  "Gave an interview",
  "Completed a course",
  "Started a project",
  "Got a certification",
  "Had a setback",
  "Feeling grateful",
  "Need guidance",
  "Nothing specific",
];

export default function CheckinPage() {
  const { user } = useSaarthi();
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [lifeUpdate, setLifeUpdate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(user?.currentStreak || 0);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!mood) return;
    setLoading(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, note, lifeUpdate }),
      });
      const data = await res.json();
      setStreak(data.streak || streak + 1);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 text-white space-y-6 scale-in">
        <div className="text-6xl mb-2 animate-bounce">🌟</div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Check-in Complete!</h1>
        <p className="text-lg text-amber-400 font-semibold">
          Your {streak} day streak is growing stronger 🔥
        </p>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
          Saarthi is learning more about you with every check-in. Consistent reflection
          leads to better guidance.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => {
              setSubmitted(false);
              setMood("");
              setNote("");
              setLifeUpdate("");
            }}
            className="px-6 py-3 glass border border-white/10 rounded-xl font-medium text-slate-300 hover:text-white transition-all text-sm"
          >
            Check In Again
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-premium px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/25"
          >
            Back to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 text-white">
      <div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Daily Check-in 🌅</h1>
        <p className="text-slate-400 text-sm mt-1">
          A few seconds each day helps Saarthi guide you better for a lifetime
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="px-3 py-1 glass-amber rounded-full text-xs font-bold text-amber-400 border border-amber-500/30">
            Current Streak: {streak} days 🔥
          </span>
          {user?.longestStreak ? (
            <span className="text-xs text-slate-500">Best: {user.longestStreak} days</span>
          ) : null}
        </div>
      </div>

      {/* Mood Selector */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-base font-bold font-[Outfit] mb-4">How are you feeling today?</h2>
        <div className="grid grid-cols-3 gap-3">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`p-4 rounded-xl border text-center transition-all ${
                mood === m.value
                  ? m.color + " shadow-lg scale-[1.02]"
                  : "glass border-white/8 hover:border-white/20 text-slate-400"
              }`}
            >
              <span className="text-3xl block mb-1.5">{m.emoji}</span>
              <span className="text-xs font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional Note */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-base font-bold font-[Outfit] mb-3">Anything on your mind? <span className="text-slate-500 font-normal text-xs">(Optional)</span></h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Share your thoughts — Saarthi is listening..."
          className="input-premium w-full px-4 py-3 rounded-xl text-sm resize-none"
        />
      </div>

      {/* Life Updates */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-base font-bold font-[Outfit] mb-3">Any life updates? <span className="text-slate-500 font-normal text-xs">(Optional)</span></h2>
        <div className="grid grid-cols-2 gap-2">
          {LIFE_UPDATES.map((u) => (
            <button
              key={u}
              onClick={() => setLifeUpdate(lifeUpdate === u ? "" : u)}
              className={`px-3 py-2.5 rounded-xl text-xs text-left transition-all font-medium ${
                lifeUpdate === u
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 border"
                  : "glass border border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              {lifeUpdate === u ? "✓ " : ""}
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!mood || loading}
        className="btn-premium w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-base shadow-xl shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Saving...
          </span>
        ) : (
          "✅ Complete Check-in"
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        Consistent check-ins help Saarthi understand your patterns and give better guidance.
      </p>
    </div>
  );
}
