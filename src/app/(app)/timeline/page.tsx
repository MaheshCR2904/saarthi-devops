"use client";

import { useState, useEffect } from "react";
import { useSaarthi } from "@/components/SaarthiProvider";

interface LifeEvent {
  id: number;
  eventType: string;
  title: string;
  description: string;
  lifeStage: string;
  occurredAt: string;
  impactScore: number;
}

const eventIcons: Record<string, string> = {
  milestone: "🌟",
  setback: "⚡",
  skill_learned: "📚",
  job_applied: "📤",
  interview: "🎤",
  promotion: "🚀",
  course_completed: "✅",
  certification: "🏅",
  other: "📌",
};

const stageNames: Record<string, string> = {
  stage_1: "Explorer (16-18)",
  stage_2: "Builder (18-22)",
  stage_3: "Launcher (22-26)",
  stage_4: "Accelerator (26-35)",
  stage_5: "Transformer (35-50)",
  stage_6: "Legacy Builder (50-60)",
};

const futureMilestones = [
  { age: 22, label: "Graduate College", predicted: true },
  { age: 23, label: "First Job", predicted: true },
  { age: 25, label: "First Promotion", predicted: true },
  { age: 28, label: "Senior Role", predicted: true },
  { age: 30, label: "₹20 LPA Target", predicted: true },
  { age: 35, label: "Leadership Role", predicted: true },
  { age: 45, label: "Financial Independence", predicted: true },
  { age: 60, label: "Retirement Ready", predicted: true },
];

export default function TimelinePage() {
  const { user } = useSaarthi();
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventType: "milestone",
    title: "",
    description: "",
    occurredAt: new Date().toISOString().split("T")[0],
    impactScore: 0,
  });

  useEffect(() => {
    fetch("/api/events?limit=50")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []));
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title) return;
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    const data = await res.json();
    if (data.event) {
      setEvents((prev) => [data.event, ...prev]);
      setShowAdd(false);
      setNewEvent({
        eventType: "milestone",
        title: "",
        description: "",
        occurredAt: new Date().toISOString().split("T")[0],
        impactScore: 0,
      });
    }
  };

  const userAge = user?.age || 21;

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-[Outfit] text-white">Life Timeline 📅</h1>
          <p className="text-slate-400 text-sm mt-1">
            Your journey — past milestones and predicted future
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-premium px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20"
        >
          + Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {showAdd && (
        <div className="glass-strong rounded-2xl p-6 border border-white/10 space-y-3 scale-in shadow-2xl">
          <h3 className="text-base font-bold font-[Outfit] text-white">Log a Life Event</h3>
          <select
            value={newEvent.eventType}
            onChange={(e) => setNewEvent((p) => ({ ...p, eventType: e.target.value }))}
            className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
          >
            <option value="milestone" className="bg-slate-900 text-slate-300">🌟 Milestone</option>
            <option value="setback" className="bg-slate-900 text-slate-300">⚡ Setback</option>
            <option value="skill_learned" className="bg-slate-900 text-slate-300">📚 Skill Learned</option>
            <option value="job_applied" className="bg-slate-900 text-slate-300">📤 Job Applied</option>
            <option value="interview" className="bg-slate-900 text-slate-300">🎤 Interview</option>
            <option value="promotion" className="bg-slate-900 text-slate-300">🚀 Promotion</option>
            <option value="course_completed" className="bg-slate-900 text-slate-300">✅ Course Completed</option>
            <option value="certification" className="bg-slate-900 text-slate-300">🏅 Certification</option>
            <option value="other" className="bg-slate-900 text-slate-300">📌 Other</option>
          </select>
          <input
            type="text"
            placeholder="Event title..."
            value={newEvent.title}
            onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
            className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={newEvent.description}
            onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            className="input-premium w-full px-4 py-2.5 rounded-xl text-sm resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={newEvent.occurredAt}
              onChange={(e) => setNewEvent((p) => ({ ...p, occurredAt: e.target.value }))}
              className="input-premium px-4 py-2.5 rounded-xl text-sm"
            />
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1 font-semibold">
                <span>Impact Score</span>
                <span className="text-amber-400 font-bold">{newEvent.impactScore}</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                value={newEvent.impactScore}
                onChange={(e) =>
                  setNewEvent((p) => ({ ...p, impactScore: parseInt(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddEvent}
              className="btn-premium flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg"
            >
              Save Event
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2.5 glass border border-white/10 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline Container */}
      <div className="glass rounded-2xl p-8 border border-white/8 hover-lift">
        <div className="relative pl-8 border-l-2 border-white/10 space-y-8">
          {/* Future predicted milestones */}
          {futureMilestones
            .filter((m) => m.age > userAge)
            .map((m) => (
              <div key={m.label} className="relative">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full border-2 border-dashed border-slate-600 bg-[#0a0e17]" />
                <div className="opacity-40 hover:opacity-80 transition-opacity">
                  <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">🔮 Predicted Milestone</p>
                  <p className="font-bold text-white text-sm">{m.label}</p>
                  <p className="text-xs text-slate-500">Target Age: {m.age}</p>
                </div>
              </div>
            ))}

          {/* Past/Logged events */}
          {events.map((event) => (
            <div key={event.id} className="relative">
              <div
                className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border-2 ${
                  event.impactScore >= 0
                    ? "border-emerald-400 bg-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "border-rose-400 bg-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                }`}
              />
              <div className="glass p-4 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all">
                <p className="text-xs font-semibold text-amber-400 mb-1">
                  {eventIcons[event.eventType] || "📌"} {event.eventType.replace("_", " ")}
                </p>
                <p className="font-bold text-white text-base">{event.title}</p>
                {event.description && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{event.description}</p>
                )}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-500">
                  <span>
                    {new Date(event.occurredAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {event.lifeStage && ` · ${stageNames[event.lifeStage] || event.lifeStage}`}
                  </span>
                  {event.impactScore !== 0 && (
                    <span className={`font-bold ${event.impactScore > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      Impact: {event.impactScore > 0 ? `+${event.impactScore}` : event.impactScore}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Start marker */}
          <div className="relative">
            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            <div className="glass p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
              <p className="text-xs font-bold text-amber-400">🌟 Journey Began</p>
              <p className="font-bold text-white text-sm">Joined Saarthi Platform</p>
              <p className="text-xs text-slate-400 mt-0.5">Today · Day 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
