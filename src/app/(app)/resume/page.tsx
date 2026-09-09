"use client";

import { useState, useEffect } from "react";
import { useSaarthi } from "@/components/SaarthiProvider";

interface ResumeForm {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  education: { institution: string; degree: string; year: string; cgpa: string }[];
  experience: { company: string; role: string; duration: string; description: string }[];
  skills: string[];
  certifications: string[];
  projects: { name: string; description: string; link: string }[];
  targetRole: string;
}

interface ATSAnalysis {
  score: number;
  feedback: string[];
  tips: string[];
}

export default function ResumePage() {
  const { user } = useSaarthi();
  const [form, setForm] = useState<ResumeForm>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
    education: [],
    experience: [],
    skills: user?.skills || [],
    certifications: [],
    projects: [],
    targetRole: user?.targetRole || "Software Engineer",
  });
  const [atsResult, setAtsResult] = useState<ATSAnalysis | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((data) => {
        if (data.resume) {
          setForm((prev) => ({
            ...prev,
            ...data.resume,
            education: data.resume.education || [],
            experience: data.resume.experience || [],
            skills: data.resume.skills || prev.skills,
            certifications: data.resume.certifications || [],
            projects: data.resume.projects || [],
            phone: data.resume.phone || "",
            linkedin: data.resume.linkedin || "",
            github: data.resume.github || "",
            summary: data.resume.summary || "",
          }));
        }
      });
  }, []);

  const updateField = (field: keyof ResumeForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      updateField("skills", [...form.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    updateField("skills", form.skills.filter((s) => s !== skill));
  };

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", year: "", cgpa: "" }],
    }));
  };

  const addExperience = () => {
    setForm((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", duration: "", description: "" }],
    }));
  };

  const saveResume = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.atsAnalysis) {
        setAtsResult(data.atsAnalysis);
      }
      setSaved(true);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-white">
      <div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Smart Resume Builder 📄</h1>
        <p className="text-slate-400 text-sm mt-1">
          Auto-generate, optimize for roles, and check ATS compatibility
        </p>
      </div>

      {/* ATS Score Card */}
      {atsResult && (
        <div
          className={`p-6 rounded-2xl border ${
            atsResult.score >= 80
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : atsResult.score >= 60
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black font-[Outfit]">{atsResult.score}</div>
            <div>
              <p className="font-bold text-base font-[Outfit]">ATS Match Score</p>
              <p className="text-xs text-slate-300">
                {atsResult.score >= 80
                  ? "✅ Great! Your resume is highly ATS-friendly."
                  : atsResult.score >= 60
                  ? "⚠️ Decent — needs some targeted improvements."
                  : "🔴 Needs significant optimization for ATS filters."}
              </p>
            </div>
          </div>
          {atsResult.feedback.length > 0 && (
            <div className="mt-3 space-y-1">
              {atsResult.feedback.map((f, i) => (
                <p key={i} className="text-xs text-rose-400">⚠️ {f}</p>
              ))}
            </div>
          )}
          {atsResult.tips.length > 0 && (
            <div className="mt-3 space-y-1">
              {atsResult.tips.map((t, i) => (
                <p key={i} className="text-xs text-slate-300">💡 {t}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resume Form */}
      <div className="glass rounded-2xl p-6 border border-white/8 space-y-5 hover-lift">
        <h2 className="text-base font-bold font-[Outfit]">Personal Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Role (for ATS)</label>
            <input
              type="text"
              value={form.targetRole}
              onChange={(e) => updateField("targetRole", e.target.value)}
              className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn URL</label>
            <input
              type="text"
              value={form.linkedin}
              onChange={(e) => updateField("linkedin", e.target.value)}
              className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub URL</label>
            <input
              type="text"
              value={form.github}
              onChange={(e) => updateField("github", e.target.value)}
              className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Summary</label>
          <textarea
            value={form.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            rows={3}
            className="input-premium w-full px-3.5 py-2.5 rounded-xl text-sm resize-none"
            placeholder="Brief professional summary..."
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              className="input-premium flex-1 px-3.5 py-2.5 rounded-xl text-sm"
              placeholder="Add a skill..."
            />
            <button
              onClick={addSkill}
              className="px-4 py-2.5 glass border border-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/8 transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {form.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 glass-amber rounded-full text-xs font-medium text-amber-300 border border-amber-500/20"
              >
                {s}
                <button onClick={() => removeSkill(s)} className="text-slate-400 hover:text-rose-400">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400">Education</label>
            <button onClick={addEducation} className="text-xs text-amber-400 font-semibold hover:underline">
              + Add Education
            </button>
          </div>
          {form.education.map((edu, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mt-2">
              <input placeholder="Institution" value={edu.institution} onChange={(e) => {
                const updated = [...form.education];
                updated[i] = { ...updated[i], institution: e.target.value };
                setForm((p) => ({ ...p, education: updated }));
              }} className="input-premium px-3 py-2 rounded-xl text-xs" />
              <input placeholder="Degree" value={edu.degree} onChange={(e) => {
                const updated = [...form.education];
                updated[i] = { ...updated[i], degree: e.target.value };
                setForm((p) => ({ ...p, education: updated }));
              }} className="input-premium px-3 py-2 rounded-xl text-xs" />
              <input placeholder="Year" value={edu.year} onChange={(e) => {
                const updated = [...form.education];
                updated[i] = { ...updated[i], year: e.target.value };
                setForm((p) => ({ ...p, education: updated }));
              }} className="input-premium px-3 py-2 rounded-xl text-xs" />
              <input placeholder="CGPA" value={edu.cgpa} onChange={(e) => {
                const updated = [...form.education];
                updated[i] = { ...updated[i], cgpa: e.target.value };
                setForm((p) => ({ ...p, education: updated }));
              }} className="input-premium px-3 py-2 rounded-xl text-xs" />
            </div>
          ))}
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400">Experience</label>
            <button onClick={addExperience} className="text-xs text-amber-400 font-semibold hover:underline">
              + Add Experience
            </button>
          </div>
          {form.experience.map((exp, i) => (
            <div key={i} className="space-y-2 mt-2 glass p-3 rounded-xl border border-white/5">
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="Company" value={exp.company} onChange={(e) => {
                  const updated = [...form.experience];
                  updated[i] = { ...updated[i], company: e.target.value };
                  setForm((p) => ({ ...p, experience: updated }));
                }} className="input-premium px-3 py-2 rounded-xl text-xs" />
                <input placeholder="Role" value={exp.role} onChange={(e) => {
                  const updated = [...form.experience];
                  updated[i] = { ...updated[i], role: e.target.value };
                  setForm((p) => ({ ...p, experience: updated }));
                }} className="input-premium px-3 py-2 rounded-xl text-xs" />
                <input placeholder="Duration" value={exp.duration} onChange={(e) => {
                  const updated = [...form.experience];
                  updated[i] = { ...updated[i], duration: e.target.value };
                  setForm((p) => ({ ...p, experience: updated }));
                }} className="input-premium px-3 py-2 rounded-xl text-xs" />
              </div>
              <textarea placeholder="Description of achievements..." value={exp.description} onChange={(e) => {
                const updated = [...form.experience];
                updated[i] = { ...updated[i], description: e.target.value };
                setForm((p) => ({ ...p, experience: updated }));
              }} className="input-premium w-full px-3 py-2 rounded-xl text-xs resize-none" rows={2} />
            </div>
          ))}
        </div>

        <button
          onClick={saveResume}
          disabled={saving}
          className="btn-premium w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-orange-500/20 disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Saving...
            </span>
          ) : saved ? (
            "✅ Saved — Check ATS Score Again"
          ) : (
            "💾 Save & Check ATS Score"
          )}
        </button>
      </div>
    </div>
  );
}
