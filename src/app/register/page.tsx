"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSaarthi } from "@/components/SaarthiProvider";
import SaarthiLogo from "@/components/SaarthiLogo";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    education: "",
    stream: "",
    interests: [] as string[],
    goalRawText: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useSaarthi();

  const updateForm = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          dateOfBirth: form.dateOfBirth || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("saarthi_token", data.token);
      }

      await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(data.token ? { Authorization: `Bearer ${data.token}` } : {}),
        },
        body: JSON.stringify({
          education: form.education,
          stream: form.stream,
          interests: form.interests,
          goalRawText: form.goalRawText,
        }),
      });

      await refreshUser();
      router.push("/onboarding");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const continueToNextStep = () => {
    setError("");

    if (step === 1) {
      if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
        setError("Please complete your name, email, and password to continue.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setStep((currentStep) => currentStep + 1);
  };

  const interestOptions = [
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

  const stepInfo = [
    { label: "Basic Info", icon: "👤" },
    { label: "Education", icon: "🎓" },
    { label: "Your Goals", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] flex relative overflow-hidden text-white font-sans">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-1 top-[-200px] right-[-100px]" />
        <div className="orb orb-3 bottom-[-100px] left-[10%]" />
        <div className="mahabharata-pattern absolute inset-0 opacity-30" />
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-12">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-16">
            <SaarthiLogo size="lg" />
          </Link>

          <h2 className="text-5xl font-black font-[Cinzel] leading-tight mb-6">
            Your journey{" "}
            <span className="animated-mahabharata-text text-glow-amber">starts now</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed max-w-sm mb-10">
            Set up your profile in 3 quick steps and let Saarthi start charting your unique path to glory.
          </p>

          {/* Step Visual */}
          <div className="space-y-4">
            {stepInfo.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                  step === i + 1
                    ? "glass-saffron border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : step > i + 1
                    ? "glass border border-emerald-500/20"
                    : "glass border border-white/5 opacity-40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                    step > i + 1
                      ? "bg-emerald-500/20 text-emerald-400"
                      : step === i + 1
                      ? "bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                      : "bg-white/5 text-slate-600"
                  }`}
                >
                  {step > i + 1 ? "✓" : s.icon}
                </div>
                <div>
                  <p className={`text-sm font-semibold font-[Cinzel] ${step === i + 1 ? "text-amber-300" : step > i + 1 ? "text-emerald-400" : "text-slate-600"}`}>
                    Step {i + 1} — {s.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 font-sans">
                    {i === 0 && "Name, email and password"}
                    {i === 1 && "Education, stream and interests"}
                    {i === 2 && "Your life goals and aspirations"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-amber-500/50 font-sans">
          🔒 Your data is private and encrypted. Saarthi never shares your information.
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <SaarthiLogo size="lg" />
            </Link>
          </div>

          {/* Mobile Step Indicator */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s ? "bg-amber-500 text-white glow-amber-sm" : "glass text-slate-500"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && (
                  <div className={`w-10 h-0.5 transition-all ${step > s ? "bg-amber-500" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="glass-strong rounded-3xl p-8 md:p-10 border border-amber-500/20">
            <div className="mb-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{stepInfo[step - 1].icon}</span>
                <h1 className="text-2xl font-black text-white font-[Cinzel]">
                  {step === 1 && "Basic Info"}
                  {step === 2 && "Education & Interests"}
                  {step === 3 && "Your Goals"}
                </h1>
              </div>
              <p className="text-amber-400/70 text-xs font-sans font-semibold uppercase tracking-wider">
                Step {step} of 3
                <span className="mx-2 text-slate-700">·</span>
                {step === 1 && "Let's get to know you"}
                {step === 2 && "Tell us about your background"}
                {step === 3 && "What do you want to achieve?"}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Step 1 */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      required
                      className="input-premium w-full px-4 py-3.5 rounded-xl text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      required
                      className="input-premium w-full px-4 py-3.5 rounded-xl text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      required
                      minLength={6}
                      className="input-premium w-full px-4 py-3.5 rounded-xl text-sm"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => updateForm("confirmPassword", e.target.value)}
                      required
                      className="input-premium w-full px-4 py-3.5 rounded-xl text-sm"
                      placeholder="Repeat your password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => updateForm("dateOfBirth", e.target.value)}
                      className="input-premium w-full px-4 py-3.5 rounded-xl text-sm"
                    />
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Current Education</label>
                    <select
                      value={form.education}
                      onChange={(e) => updateForm("education", e.target.value)}
                      className="input-premium w-full px-4 py-3.5 rounded-xl text-sm"
                    >
                      <option value="" className="bg-slate-900">Select...</option>
                      <option value="high_school" className="bg-slate-900">High School (10th/12th)</option>
                      <option value="bachelors" className="bg-slate-900">Bachelor&apos;s Degree</option>
                      <option value="masters" className="bg-slate-900">Master&apos;s Degree</option>
                      <option value="phd" className="bg-slate-900">PhD</option>
                      <option value="diploma" className="bg-slate-900">Diploma / Certification</option>
                      <option value="working" className="bg-slate-900">Working Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Stream / Field</label>
                    <select
                      value={form.stream}
                      onChange={(e) => updateForm("stream", e.target.value)}
                      className="input-premium w-full px-4 py-3.5 rounded-xl text-sm"
                    >
                      <option value="" className="bg-slate-900">Select...</option>
                      <option value="Science" className="bg-slate-900">Science (PCM/PCB)</option>
                      <option value="Computer Science" className="bg-slate-900">Computer Science / IT</option>
                      <option value="Commerce" className="bg-slate-900">Commerce</option>
                      <option value="Arts" className="bg-slate-900">Arts / Humanities</option>
                      <option value="Engineering" className="bg-slate-900">Engineering</option>
                      <option value="Medicine" className="bg-slate-900">Medicine</option>
                      <option value="Management" className="bg-slate-900">Management / BBA</option>
                      <option value="Law" className="bg-slate-900">Law</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Interests <span className="text-slate-500 font-normal">(select all that apply)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-2.5 rounded-xl text-xs text-left transition-all font-medium ${
                            form.interests.includes(interest)
                              ? "bg-amber-500/15 border border-amber-500/40 text-amber-300"
                              : "glass border border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-300"
                          }`}
                        >
                          {form.interests.includes(interest) ? "✓ " : ""}
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Describe your life goals in your own words
                  </label>
                  <textarea
                    value={form.goalRawText}
                    onChange={(e) => updateForm("goalRawText", e.target.value)}
                    rows={5}
                    className="input-premium w-full px-4 py-3.5 rounded-xl text-sm resize-none"
                    placeholder="E.g., I want to work in tech, earn well, and eventually move abroad for better opportunities..."
                  />
                  <div className="mt-3 p-4 glass-amber rounded-xl">
                    <p className="text-xs text-amber-300/70 leading-relaxed">
                      🧘 Saarthi will parse your goals and use them to personalize your experience.
                      Be honest — there&apos;s no wrong answer here. The more detail you give, the better your guide.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3.5 glass border border-white/10 text-white rounded-xl hover:bg-white/8 transition-all font-semibold"
                  >
                    ← Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={continueToNextStep}
                    className="btn-premium flex-1 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-black font-black rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] text-sm"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-premium flex-1 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-black font-black rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50 text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                        Charting your path...
                      </span>
                    ) : (
                      "Begin Your Journey →"
                    )}
                  </button>
                )}
              </div>

              <p className="text-center text-sm text-slate-500 pt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
