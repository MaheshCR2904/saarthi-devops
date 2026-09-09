"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SaarthiLogo from "@/components/SaarthiLogo";
import Icon3D, { Icon3DName } from "@/components/Icon3D";
import { useSaarthi } from "@/components/SaarthiProvider";

interface SidebarProps {
  userName?: string;
  lifeStage?: string;
  overallLifeScore?: number;
  unreadAlerts?: number;
}

const navigation: { section: string; items: { name: string; href: string; icon: Icon3DName }[] }[] = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: "lightning" },
      { name: "Saarthi AI Guide", href: "/saarthi", icon: "meditation" },
      { name: "Life Timeline", href: "/timeline", icon: "calendar" },
    ],
  },
  {
    section: "Navigation",
    items: [
      { name: "Academic Navigator", href: "/academic", icon: "graduation" },
      { name: "Career Engine", href: "/career", icon: "briefcase" },
      { name: "What-If Simulator", href: "/simulator", icon: "crystal" },
      { name: "Resume Builder", href: "/resume", icon: "document" },
      { name: "Setback Recovery", href: "/recovery", icon: "recovery" },
    ],
  },
  {
    section: "Wellness",
    items: [
      { name: "Daily Check-in", href: "/checkin", icon: "sunrise" },
      { name: "Wellbeing Tracker", href: "/wellbeing", icon: "heart" },
      { name: "Finance Planner", href: "/finance", icon: "coin" },
    ],
  },
];

const stageLabels: Record<string, { label: string; color: string }> = {
  stage_1: { label: "Explorer · Bramhacharya (16-18)", color: "text-amber-400" },
  stage_2: { label: "Builder · Grihastha (18-22)", color: "text-amber-300" },
  stage_3: { label: "Launcher · Purushartha (22-26)", color: "text-amber-500" },
  stage_4: { label: "Accelerator · Karma (26-35)", color: "text-orange-400" },
  stage_5: { label: "Transformer · Dharma (35-50)", color: "text-[#fbbf24]" },
  stage_6: { label: "Legacy · Vanaprastha (50-60)", color: "text-rose-400" },
};

export default function SaarthiSidebar({
  userName,
  lifeStage,
  overallLifeScore,
  unreadAlerts,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useSaarthi();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("saarthi_token");
    }
    setUser(null);
    router.push("/login");
  };

  const stage = stageLabels[lifeStage || "stage_1"];
  const scoreColor =
    (overallLifeScore || 0) >= 75
      ? "from-amber-400 via-amber-500 to-orange-500"
      : (overallLifeScore || 0) >= 50
      ? "from-amber-500 to-orange-600"
      : "from-rose-500 to-pink-600";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0b1220] text-white border-r border-amber-500/20 shadow-[5px_0_30px_rgba(0,0,0,0.6)]">
      {/* Logo */}
      <div className={`p-4 border-b border-amber-500/15 ${collapsed ? "flex justify-center" : ""}`}>
        <Link href="/dashboard">
          <SaarthiLogo size="md" showText={!collapsed} />
        </Link>
      </div>

      {/* User Profile */}
      {!collapsed && userName && (
        <div className="p-4 border-b border-amber-500/15 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-black text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-300">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-[#0b1220] shadow-[0_0_8px_#f59e0b]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate font-[Cinzel]">{userName}</p>
              <p className={`text-[11px] font-sans font-semibold truncate ${stage?.color || "text-amber-400"}`}>
                {stage?.label || "Explorer · Bramhacharya"}
              </p>
            </div>
          </div>

          {overallLifeScore !== undefined && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-sans mb-1.5">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">LIFE SCORE</span>
                <span className="text-amber-400 font-bold text-glow-amber">{overallLifeScore}/100</span>
              </div>
              <div className="score-bar bg-white/10">
                <div
                  className={`score-bar-fill bg-gradient-to-r ${scoreColor}`}
                  style={{ width: `${overallLifeScore}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collapsed User Avatar */}
      {collapsed && userName && (
        <div className="flex justify-center py-3 border-b border-amber-500/15">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-black text-black border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        {navigation.map((section) => (
          <div key={section.section} className="mb-3">
            {!collapsed && (
              <p className="px-2.5 mb-2 text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-amber-400/60">
                {section.section}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-transparent text-white border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 hover:border-amber-500/20 border border-transparent"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-[60%] bg-gradient-to-b from-amber-400 to-orange-500 rounded-r-full shadow-[0_0_10px_#f59e0b]" />
                  )}
                  <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
                    <Icon3D name={item.icon} size={collapsed ? 22 : 20} />
                  </span>
                  {!collapsed && (
                    <>
                      <span className={`text-[13px] font-semibold flex-1 ${isActive ? "text-amber-300 text-glow-amber" : ""}`}>
                        {item.name}
                      </span>
                      {item.name === "Saarthi AI Guide" && Boolean(unreadAlerts) && unreadAlerts! > 0 && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-[0_0_8px_#f59e0b]">
                          {unreadAlerts}
                        </span>
                      )}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-amber-500/15 space-y-1">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent rounded-xl transition-all text-[13px] font-semibold ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <Icon3D name="door" size={20} />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center gap-2 w-full px-3 py-2 text-[11px] text-amber-400/60 hover:text-amber-400 rounded-xl transition-all font-sans font-semibold tracking-wider"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {!collapsed ? (
            <>
              <span>◀</span>
              <span>COLLAPSE</span>
            </>
          ) : (
            <span>▶</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 glass-strong rounded-xl flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-500/30"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 z-40 h-full w-72 shadow-2xl">
            {sidebarContent}
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-[240px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
