"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSaarthi } from "@/components/SaarthiProvider";
import SaarthiLogo from "@/components/SaarthiLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { refreshUser } = useSaarthi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("saarthi_token", data.token);
      }

      await refreshUser();
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] flex relative overflow-hidden text-white font-sans">
      {/* Background Orbs & Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-1 top-[-150px] left-[-100px]" />
        <div className="orb orb-2 bottom-[-100px] right-[-100px]" />
        <div className="mahabharata-pattern absolute inset-0 opacity-30" />
      </div>

      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 z-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 mb-16">
            <SaarthiLogo size="lg" />
          </Link>

          <div className="mt-8">
            <h2 className="text-5xl font-black font-[Cinzel] leading-tight mb-6">
              Welcome back,{" "}
              <span className="animated-mahabharata-text text-glow-amber">charioteer</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-sm">
              Your journey continues where you left off. Every step forward is progress on your unique path.
            </p>
          </div>

          <div className="mt-12 glass-saffron rounded-2xl p-6 border border-amber-500/30 glow-amber-sm">
            <p className="text-slate-200 text-xs leading-relaxed italic mb-3">
              &ldquo;Saarthi helped me pick the right stream at 17, and now at 22, I&apos;m 
              already working at my dream company.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-black font-black flex items-center justify-center text-xs">R</div>
              <div>
                <p className="text-xs font-bold text-white font-[Cinzel]">Rohan M.</p>
                <p className="text-[10px] text-amber-400">SDE at Bangalore startup</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap font-sans">
          {["Explorer · Bramhacharya", "Builder · Grihastha", "Launcher · Purushartha", "Accelerator · Karma", "Legacy · Vanaprastha"].map((stage, i) => (
            <span key={stage} className={`px-3 py-1 rounded-full text-[11px] font-semibold ${i === 1 ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "glass text-slate-400"}`}>
              {stage}
            </span>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-3xl p-8 md:p-10 scale-in border border-amber-500/25">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white font-[Cinzel] mb-1">Sign In</h1>
              <p className="text-amber-400/80 text-xs font-sans font-semibold uppercase tracking-wider">YOUR GUIDE AWAITS</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-premium w-full px-4 py-3.5 rounded-xl text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-premium w-full px-4 py-3.5 rounded-xl text-sm pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 text-xs font-semibold"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-black font-black rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] disabled:opacity-50 text-sm font-sans tracking-wider"
              >
                {loading ? "SIGNING IN..." : "SIGN IN →"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-amber-500/15 text-center text-xs">
              <p className="text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-amber-400 hover:underline font-bold">
                  START YOUR JOURNEY
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
