import Link from "next/link";
import SaarthiLogo from "@/components/SaarthiLogo";
import Icon3D, { Icon3DName } from "@/components/Icon3D";

export default function LandingPage() {
  const features: { icon: Icon3DName; title: string; desc: string; color: string; border: string; glow: string }[] = [
    {
      icon: "meditation",
      title: "AI Life Guide",
      desc: "A wise conversational companion that remembers your entire journey and guides you proactively without judgment.",
      color: "from-amber-500/20 to-orange-500/5",
      border: "border-amber-500/30",
      glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    },
    {
      icon: "graduation",
      title: "Academic Navigator",
      desc: "Smart stream selection, college matching, and CGPA impact analysis for ages 16–22.",
      color: "from-blue-500/20 to-indigo-500/5",
      border: "border-blue-500/30",
      glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    },
    {
      icon: "briefcase",
      title: "Career Engine",
      desc: "ML-powered career path prediction, skill gap detection, and salary growth projection.",
      color: "from-purple-500/20 to-indigo-500/5",
      border: "border-purple-500/30",
      glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    },
    {
      icon: "crystal",
      title: "What-If Simulator",
      desc: "Compare life paths side-by-side — MBA at 25 vs Stay in Tech — with real projections.",
      color: "from-indigo-500/20 to-blue-500/5",
      border: "border-indigo-500/30",
      glow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]",
    },
    {
      icon: "document",
      title: "Smart Resume Builder",
      desc: "Auto-generates from your profile, role-specific tailoring, and ATS score checking.",
      color: "from-emerald-500/20 to-teal-500/5",
      border: "border-emerald-500/30",
      glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    },
    {
      icon: "recovery",
      title: "Setback Recovery Engine",
      desc: "Got a backlog? Lost a job? Saarthi recalculates your path without judgment.",
      color: "from-rose-500/20 to-red-500/5",
      border: "border-rose-500/30",
      glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]",
    },
  ];

  const stats = [
    { value: "10K+", label: "Journeys Guided" },
    { value: "95%", label: "User Satisfaction" },
    { value: "6", label: "Life Stages Covered" },
    { value: "16→60", label: "Age Range" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white overflow-hidden relative font-sans">
      {/* Background Royal Orbs & Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-1 top-[-150px] right-[5%]" />
        <div className="orb orb-2 bottom-[5%] left-[-150px]" />
        <div className="orb orb-3 top-[35%] right-[2%]" />
        <div className="mahabharata-pattern absolute inset-0 opacity-40" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <Link href="/">
          <SaarthiLogo size="lg" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs font-sans font-semibold uppercase tracking-wider text-slate-400">
          <a href="#features" className="hover:text-amber-400 transition-colors">MODULES</a>
          <a href="#philosophy" className="hover:text-amber-400 transition-colors">PHILOSOPHY</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-white/5 font-semibold"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-premium px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-black rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)]"
          >
            Begin Journey →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        {/* Badge */}
        <div className="fade-up flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-amber border border-amber-500/30 text-xs font-semibold text-amber-300 uppercase tracking-wider">
            <Icon3D name="wheel" size={20} />
            MAHABHARATA WISDOM · GUIDING <span className="text-white font-bold">10,000+</span> JOURNEYS ACROSS INDIA
          </div>
        </div>

        <div className="text-center max-w-5xl mx-auto">
          <h1 className="fade-up text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.04] mb-6 font-[Cinzel]">
            Your wise guide from
            <br />
            <span className="animated-mahabharata-text text-glow-amber">
              dreams to legacy
            </span>
          </h1>

          <p className="fade-up text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Saarthi is your lifelong AI charioteer — guiding you through every major
            life decision from age 16 to retirement. Like Krishna guiding Arjuna at Kurukshetra,
            <span className="text-amber-400 font-bold"> it never judges — it only recalculates.</span>
          </p>

          <div className="fade-up flex flex-wrap gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="btn-premium px-9 py-4 text-base font-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-black rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.5)]"
            >
              Begin Your Journey →
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 text-base font-semibold glass rounded-2xl hover:bg-white/10 transition-all border border-amber-500/20"
            >
              Welcome Back
            </Link>
          </div>

          {/* Stats */}
          <div className="fade-up grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center hover-lift border border-amber-500/20">
                <div className="text-2xl font-black text-amber-400 font-[Cinzel] text-glow-gold">{stat.value}</div>
                <div className="text-[11px] font-sans text-slate-400 mt-1 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-amber text-xs font-semibold text-amber-300 uppercase tracking-widest mb-4">
            🛞 PLATFORM MODULES
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-[Cinzel] mb-4">
            Everything you need,{" "}
            <span className="animated-mahabharata-text">in one place</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            From 10th board exams to retirement planning — Saarthi covers every milestone of your life story.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`hover-lift p-7 rounded-3xl bg-gradient-to-br ${feature.color} border ${feature.border} ${feature.glow} group cursor-default transition-all duration-300`}
            >
              <div className="mb-5 transform group-hover:scale-110 transition-transform duration-300">
                <Icon3D name={feature.icon} size={56} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white font-[Outfit]">{feature.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mahabharata Philosophy Section */}
      <section id="philosophy" className="relative z-10 max-w-4xl mx-auto px-6 pb-32 text-center">
        <div className="glass-saffron rounded-3xl p-12 relative overflow-hidden border border-amber-500/40 glow-saffron">
          <div className="relative z-10">
            <div className="flex justify-center mb-6"><Icon3D name="wheel" size={72} /></div>
            <blockquote className="text-3xl md:text-4xl font-black font-[Cinzel] text-white mb-6 leading-tight">
              &ldquo;Saarthi never judges —<br />
              <span className="animated-mahabharata-text">it only recalculates.</span>&rdquo;
            </blockquote>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-sm">
              Like Shri Krishna guiding Arjuna through life&apos;s toughest crossroads on the battlefield of Kurukshetra,
              Saarthi stands beside you at every turn — through every milestone, every setback, every victory.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-32 text-center">
        <div className="glass-strong rounded-3xl p-12 border border-amber-500/30">
          <h2 className="text-4xl md:text-5xl font-black font-[Cinzel] mb-4">
            Ready to meet your charioteer?
          </h2>
          <p className="text-base text-slate-400 mb-8">
            Start your lifelong journey today. Your future self will thank you.
          </p>
          <Link
            href="/register"
            className="btn-premium inline-block px-12 py-5 text-lg font-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-black rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.5)]"
          >
            Start Free — It Takes 5 Minutes →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-amber-500/15 px-6 py-8 text-center font-sans">
        <div className="flex items-center justify-center gap-2 mb-3">
          <SaarthiLogo size="sm" showText={false} />
          <span className="font-bold text-white font-[Cinzel]">Saarthi Guide</span>
        </div>
        <p className="text-xs text-slate-400">
          Built with ❤️ by Mahesh C R · MCA, Sapthagiri NPS University · Guided by Ms. Sinchana S M
        </p>
      </footer>
    </div>
  );
}
