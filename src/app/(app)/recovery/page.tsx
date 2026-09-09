"use client";

import { useState } from "react";
import Link from "next/link";

type SetbackType = "backlog" | "job_loss" | "interview_fail" | "career_gap" | "low_cgpa" | "general";

const RECOVERY_PLANS: Record<
  SetbackType,
  {
    title: string;
    empatheticMessage: string;
    statMessage: string;
    immediateActions: string[];
    weekPlan: string[];
    monthPlan: string[];
    inspiration: string;
  }
> = {
  backlog: {
    title: "Academic Backlog",
    empatheticMessage:
      "A backlog feels heavy, but here's the truth: it's a temporary setback, not a reflection of your ability. Many successful professionals had backlogs in college — what matters is how you bounce back.",
    statMessage:
      "47 students with backlogs cracked placements at top companies last year. Your CGPA doesn't define your career.",
    immediateActions: [
      "Contact your professor immediately — show initiative, ask for a re-evaluation or supplementary exam date",
      "Identify exactly which topics you struggled with — don't guess, get specific",
      "Create a focused study plan: 2 hours daily on the backlog subject",
    ],
    weekPlan: [
      "Break the syllabus into daily chunks — 1 chapter per day",
      "Find a study buddy from the same class who cleared it",
      "Practice previous year question papers — patterns repeat",
      "Take short breaks to avoid burnout — 25 min study, 5 min break",
    ],
    monthPlan: [
      "Complete the entire syllabus with revision",
      "Take mock tests under timed conditions",
      "Build a project to demonstrate practical knowledge beyond exams",
      "Update your Saarthi profile — this setback will soon be a milestone of resilience",
    ],
    inspiration:
      "Amitabh Bachchan was rejected by All India Radio for his voice. Today, it's his most iconic asset. Your story is just beginning.",
  },
  job_loss: {
    title: "Job Loss",
    empatheticMessage:
      "Losing a job is disorienting — I know. But this is not the end of your career. It's a pivot point. Many people look back at their job loss as the moment that redirected them to something better.",
    statMessage:
      "73% of professionals who lost jobs found better-paying roles within 6 months of focused upskilling.",
    immediateActions: [
      "Take 48 hours to process — it's okay to feel what you're feeling",
      "Update your resume immediately with your most recent role and achievements",
      "Apply for unemployment benefits or financial support if available",
      "Inform your network — don't hide; people want to help",
    ],
    weekPlan: [
      "Identify 1-2 high-demand skills in your field that you're missing",
      "Start a free online course (Coursera, YouTube, freeCodeCamp)",
      "Reach out to 5 former colleagues for coffee chats",
      "Set up job alerts on LinkedIn, Naukri, and AngelList",
    ],
    monthPlan: [
      "Complete at least 1 certification",
      "Build a portfolio project showcasing your new skills",
      "Apply to 20+ positions weekly with tailored resumes",
      "Practice interview skills — Saarthi can help with mock interviews",
    ],
    inspiration:
      "Steve Jobs was fired from Apple, the company he founded. He called it 'the best thing that ever happened to me.' Your next chapter could be even better.",
  },
  interview_fail: {
    title: "Failed Interview",
    empatheticMessage:
      "A failed interview is free feedback. It's not a judgment of your worth — it's data. Every 'no' brings you closer to the right 'yes.'",
    statMessage:
      "The average successful candidate fails 9 interviews before landing their dream role. You just got one closer.",
    immediateActions: [
      "Write down everything you remember from the interview — questions, your answers, where you stumbled",
      "Send a thank-you note to the interviewer — professionalism leaves a lasting impression",
      "Identify 3 specific areas where you can improve",
    ],
    weekPlan: [
      "Practice those weak areas daily — use Saarthi's interview prep or record yourself",
      "Research the company's interview pattern on Glassdoor/AmbitionBox",
      "Do mock interviews with friends or mentors",
      "Review fundamentals in your field",
    ],
    monthPlan: [
      "Apply to at least 30 more positions",
      "Complete 2 additional technical/skill certifications",
      "Join a peer interview practice group",
      "Track your improvement — you'll see patterns you're getting better at",
    ],
    inspiration:
      "J.K. Rowling was rejected by 12 publishers before Harry Potter was accepted. Rejection is not failure — it's redirection.",
  },
  career_gap: {
    title: "Career Gap",
    empatheticMessage:
      "A career gap is not a black mark — it's a chapter. Whether it was for family, health, or exploration, your time away from work doesn't erase your value. It may have added perspectives that others don't have.",
    statMessage:
      "42% of hiring managers say career gaps are no longer a dealbreaker if skills are current.",
    immediateActions: [
      "Frame your gap positively — what did you learn or how did you grow?",
      "Update your skills — tech moves fast, get current with the latest in your field",
      "Start a blog or LinkedIn posts sharing your learning journey",
    ],
    weekPlan: [
      "Complete an online certification in your field",
      "Contribute to open-source projects or freelance platforms",
      "Network with 10 people in your target industry",
      "Practice explaining your gap confidently in mock interviews",
    ],
    monthPlan: [
      "Build a strong portfolio with 2-3 recent projects",
      "Apply to 'returnship' programs designed for career returners",
      "Consider contract or freelance work to build recent experience",
      "Update all professional profiles with your current skills",
    ],
    inspiration:
      "Vera Wang entered the fashion industry at 40 after a career in journalism. Your gap is not a waste — it's preparation.",
  },
  low_cgpa: {
    title: "Low CGPA",
    empatheticMessage:
      "Your CGPA is a number from a specific period of your life. It doesn't measure your creativity, your resilience, your emotional intelligence, or your drive. Many companies now look beyond CGPA to what you can actually build.",
    statMessage:
      "Companies like Google, Apple, and many startups no longer require minimum CGPA. Your projects and skills speak louder.",
    immediateActions: [
      "Build 1 impressive project that demonstrates real-world skills",
      "Focus on in-demand skills with certifications to prove them",
      "Network — personal referrals often bypass CGPA filters entirely",
    ],
    weekPlan: [
      "Create a GitHub portfolio with quality code and documentation",
      "Start contributing to open-source — shows collaboration and real coding ability",
      "Get a recommendation letter from a professor or internship mentor",
      "Research companies that don't have CGPA cutoffs in your field",
    ],
    monthPlan: [
      "Build 2 more substantial projects with live demos",
      "Apply to startups — they value skills over grades",
      "Attend hackathons or competitions — winning overshadows any CGPA",
      "Create content (blog, YouTube) showcasing your expertise",
    ],
    inspiration:
      "Many IIT and NIT graduates with 8+ CGPA work for founders who had 6.5 CGPA. Execution beats grades every single time.",
  },
  general: {
    title: "Facing a Setback",
    empatheticMessage:
      "Whatever you're going through right now — I want you to know that this feeling is temporary. Setbacks are not stop signs; they're detour signs pointing you toward a path you might not have discovered otherwise.",
    statMessage:
      "Every successful person you admire has a collection of setbacks they've never talked about. Resilience is built in moments like this.",
    immediateActions: [
      "Take a deep breath. Pause. Don't make decisions from panic.",
      "Write down exactly what happened — clarity reduces anxiety",
      "Talk to Saarthi about it — unloading helps you think clearly",
    ],
    weekPlan: [
      "Identify one small win each day — momentum starts small",
      "Reach out to someone who's been through this — you're not alone",
      "Create a simple daily routine and stick to it",
    ],
    monthPlan: [
      "Look back at this month — you'll be surprised how far you've come",
      "Reassess your goals with fresh eyes",
      "Share your recovery story — it might help someone else",
    ],
    inspiration:
      "Remember: Saarthi never judges — it only recalculates. Every setback is just new data for a better path forward.",
  },
};

export default function RecoveryPage() {
  const [setbackType, setSetbackType] = useState<SetbackType>("general");
  const [showPlan, setShowPlan] = useState(false);

  const plan = RECOVERY_PLANS[setbackType];

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-white">
      <div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Setback Recovery Engine 🔄</h1>
        <p className="text-slate-400 text-sm mt-1">
          Saarthi never judges — it only recalculates. Whatever happened, let&apos;s build your path forward.
        </p>
      </div>

      {/* Philosophy Banner */}
      <div className="glass-amber rounded-2xl p-6 text-center border border-amber-500/20">
        <p className="text-3xl mb-2">🙏</p>
        <p className="text-base font-semibold text-amber-300 italic font-[Outfit]">
          &ldquo;Every setback is just new data for a better path forward. I never judge — I only recalculate.&rdquo;
        </p>
        <p className="text-xs text-slate-400 mt-1">— Saarthi</p>
      </div>

      {/* Setback Selector */}
      <div className="glass rounded-2xl p-6 border border-white/8 hover-lift">
        <h2 className="text-base font-bold font-[Outfit] mb-4">What are you going through?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {([
            { key: "backlog", label: "📚 Academic Backlog", desc: "Failed exam or backlog" },
            { key: "job_loss", label: "💼 Lost Job", desc: "Laid off or fired" },
            { key: "interview_fail", label: "🎤 Failed Interview", desc: "Didn't make it through" },
            { key: "career_gap", label: "⏸️ Career Gap", desc: "Time away from work" },
            { key: "low_cgpa", label: "📉 Low CGPA", desc: "Worried about grades" },
            { key: "general", label: "🫂 Other Setback", desc: "Something else" },
          ] as { key: SetbackType; label: string; desc: string }[]).map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setSetbackType(s.key);
                setShowPlan(true);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                setbackType === s.key && showPlan
                  ? "bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-lg"
                  : "glass border-white/8 hover:border-white/20 text-slate-300"
              }`}
            >
              <p className="text-xs font-bold">{s.label}</p>
              <p className="text-[11px] text-slate-500 mt-1">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recovery Plan */}
      {showPlan && (
        <div className="space-y-6 scale-in">
          {/* Empathy + Stats */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="text-xl font-black font-[Outfit] text-white mb-3">{plan.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{plan.empatheticMessage}</p>
            <div className="p-4 glass-strong rounded-xl border border-indigo-500/30">
              <p className="text-xs font-semibold text-indigo-300">📊 {plan.statMessage}</p>
            </div>
          </div>

          {/* Immediate Actions */}
          <div className="glass rounded-2xl p-6 border border-rose-500/20 bg-rose-500/5">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-3">⚡ Immediate Actions (Today)</h3>
            <div className="space-y-2">
              {plan.immediateActions.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl border border-white/5">
                  <span className="text-rose-400 font-bold text-xs">{i + 1}.</span>
                  <span className="text-xs text-slate-300">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Week Plan */}
          <div className="glass rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">📅 This Week</h3>
            <div className="space-y-2">
              {plan.weekPlan.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl border border-white/5">
                  <span className="text-amber-400 font-bold text-xs">{i + 1}.</span>
                  <span className="text-xs text-slate-300">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Month Plan */}
          <div className="glass rounded-2xl p-6 border border-emerald-500/20 bg-emerald-500/5">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">🗓️ This Month</h3>
            <div className="space-y-2">
              {plan.monthPlan.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl border border-white/5">
                  <span className="text-emerald-400 font-bold text-xs">{i + 1}.</span>
                  <span className="text-xs text-slate-300">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inspiration */}
          <div className="glass-amber rounded-2xl p-6 border border-purple-500/30">
            <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">💫 Inspiration</p>
            <p className="text-xs text-slate-300 italic leading-relaxed">{plan.inspiration}</p>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/saarthi"
              className="btn-premium px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-orange-500/20"
            >
              🧘 Talk to Saarthi
            </Link>
            <Link
              href="/career"
              className="px-6 py-3 glass border border-white/10 text-white rounded-xl font-semibold text-xs hover:bg-white/8 transition-all"
            >
              💼 Explore Career Paths
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
