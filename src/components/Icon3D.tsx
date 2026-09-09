"use client";

import React from "react";

export type Icon3DName =
  | "wheel"
  | "meditation"
  | "graduation"
  | "briefcase"
  | "crystal"
  | "document"
  | "recovery"
  | "lightning"
  | "calendar"
  | "sunrise"
  | "heart"
  | "coin"
  | "door"
  | "star"
  | "compass"
  | "rocket"
  | "brain";

interface Icon3DProps {
  name: Icon3DName;
  size?: number;
  className?: string;
}

export default function Icon3D({ name, size = 40, className = "" }: Icon3DProps) {
  const map: Partial<Record<Icon3DName, React.ReactElement>> = {
    wheel: <WheelSVG size={size} />,
    meditation: <MeditationSVG size={size} />,
    graduation: <GraduationSVG size={size} />,
    briefcase: <BriefcaseSVG size={size} />,
    crystal: <CrystalSVG size={size} />,
    document: <DocumentSVG size={size} />,
    recovery: <RecoverySVG size={size} />,
    lightning: <LightningSVG size={size} />,
    calendar: <CalendarSVG size={size} />,
    sunrise: <SunriseSVG size={size} />,
    heart: <HeartSVG size={size} />,
    coin: <CoinSVG size={size} />,
    door: <DoorSVG size={size} />,
    star: <StarSVG size={size} />,
    compass: <CompassSVG size={size} />,
    rocket: <RocketSVG size={size} />,
    brain: <BrainSVG size={size} />,
  };
  return (
    <span
      className={`inline-flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      {map[name] ?? null}
    </span>
  );
}

/* ═══════════════════════════════════════════
   WHEEL — Dharma Chakra (amber/gold)
═══════════════════════════════════════════ */
function WheelSVG({ size }: { size: number }) {
  const spokes = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="wh-g" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
        <filter id="wh-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.55)" />
        </filter>
        <filter id="wh-gl" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="40" fill="#f59e0b" opacity="0.12" filter="url(#wh-gl)" />
      <ellipse cx="50" cy="90" rx="30" ry="5" fill="rgba(0,0,0,0.3)" />
      <circle cx="53" cy="53" r="34" fill="none" stroke="#78350f" strokeWidth="10" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="url(#wh-g)" strokeWidth="10" filter="url(#wh-d)" />
      {spokes.map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={50 + Math.cos(r) * 13} y1={50 + Math.sin(r) * 13}
            x2={50 + Math.cos(r) * 29} y2={50 + Math.sin(r) * 29}
            stroke="url(#wh-g)" strokeWidth="3.5" strokeLinecap="round" />
        );
      })}
      <circle cx="52" cy="52" r="11" fill="#78350f" />
      <circle cx="50" cy="50" r="11" fill="url(#wh-g)" />
      <circle cx="50" cy="50" r="5" fill="#0a0e17" />
      <circle cx="50" cy="50" r="3" fill="#f59e0b" />
      <ellipse cx="32" cy="31" rx="10" ry="5.5" fill="rgba(255,255,255,0.38)" transform="rotate(-45 32 31)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   MEDITATION — Lotus figure (amber)
═══════════════════════════════════════════ */
function MeditationSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="me-g" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        <radialGradient id="me-l" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        <filter id="me-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="26" ry="5" fill="rgba(0,0,0,0.28)" />
      {/* lotus back */}
      <ellipse cx="50" cy="79" rx="22" ry="9" fill="#92400e" />
      <ellipse cx="26" cy="77" rx="13" ry="6" fill="#92400e" transform="rotate(-25 26 77)" />
      <ellipse cx="74" cy="77" rx="13" ry="6" fill="#92400e" transform="rotate(25 74 77)" />
      {/* lotus front */}
      <ellipse cx="50" cy="76" rx="22" ry="9" fill="url(#me-l)" />
      <ellipse cx="27" cy="74" rx="13" ry="6" fill="#ea580c" transform="rotate(-25 27 74)" />
      <ellipse cx="73" cy="74" rx="13" ry="6" fill="#ea580c" transform="rotate(25 73 74)" />
      {/* torso */}
      <ellipse cx="52" cy="64" rx="15" ry="11" fill="#92400e" />
      <ellipse cx="50" cy="62" rx="15" ry="11" fill="url(#me-g)" filter="url(#me-d)" />
      {/* arms */}
      <path d="M35 62 Q23 69 26 75" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
      <path d="M65 62 Q77 69 74 75" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
      <circle cx="26" cy="75" r="3.5" fill="#f59e0b" />
      <circle cx="74" cy="75" r="3.5" fill="#f59e0b" />
      {/* head */}
      <circle cx="52" cy="43" r="13" fill="#92400e" />
      <circle cx="50" cy="41" r="13" fill="url(#me-g)" filter="url(#me-d)" />
      {/* aura */}
      <circle cx="50" cy="41" r="19" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.65" />
      {/* third eye */}
      <circle cx="50" cy="38" r="2.2" fill="#fef3c7" />
      <circle cx="50" cy="38" r="1" fill="#f59e0b" />
      {/* hair */}
      <ellipse cx="50" cy="27" rx="5" ry="3.5" fill="#d97706" />
      {/* shine */}
      <ellipse cx="42" cy="36" rx="5" ry="3" fill="rgba(255,255,255,0.42)" transform="rotate(-20 42 36)" />
      <ellipse cx="42" cy="58" rx="4" ry="2.5" fill="rgba(255,255,255,0.18)" transform="rotate(-15 42 58)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   GRADUATION CAP (blue/indigo)
═══════════════════════════════════════════ */
function GraduationSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="gc-t" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="gc-b" x1="0%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <filter id="gc-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="30" ry="5" fill="rgba(0,0,0,0.28)" />
      {/* cap depth */}
      <path d="M17 50 L50 38 L83 50 L83 56 L50 44 L17 56 Z" fill="#1e3a8a" />
      {/* cap top */}
      <path d="M15 48 L50 36 L85 48 L50 60 Z" fill="url(#gc-t)" filter="url(#gc-d)" />
      <circle cx="50" cy="48" r="4.5" fill="#bfdbfe" />
      <circle cx="50" cy="48" r="2.5" fill="#93c5fd" />
      {/* body depth */}
      <path d="M30 58 L30 77 Q50 86 70 77 L70 58 Q50 67 30 58 Z" fill="#1e3a8a" transform="translate(3,3)" />
      {/* body */}
      <path d="M30 58 L30 77 Q50 86 70 77 L70 58 Q50 67 30 58 Z" fill="url(#gc-b)" filter="url(#gc-d)" />
      <path d="M34 67 Q50 74 66 67" fill="none" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
      {/* tassel */}
      <circle cx="84" cy="47" r="5" fill="#fbbf24" />
      <circle cx="83" cy="46" r="3" fill="#fde68a" />
      <path d="M84 52 Q87 62 84 74" fill="none" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="81" y1="73" x2="79" y2="80" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="84" y1="74" x2="83" y2="82" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="87" y1="73" x2="88" y2="79" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
      {/* shine */}
      <ellipse cx="31" cy="43" rx="10" ry="4.5" fill="rgba(255,255,255,0.3)" transform="rotate(-15 31 43)" />
      <ellipse cx="37" cy="63" rx="6" ry="3" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   BRIEFCASE (purple)
═══════════════════════════════════════════ */
function BriefcaseSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="bf-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="bf-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="28" ry="5" fill="rgba(0,0,0,0.28)" />
      <rect x="18" y="46" width="65" height="42" rx="7" fill="#4c1d95" />
      <rect x="14" y="42" width="65" height="42" rx="7" fill="url(#bf-g)" filter="url(#bf-d)" />
      <rect x="14" y="60" width="65" height="4" rx="2" fill="#7c3aed" />
      <rect x="14" y="62" width="65" height="2" rx="1" fill="rgba(0,0,0,0.2)" />
      {/* clasp */}
      <rect x="42" y="53" width="16" height="16" rx="4" fill="#6d28d9" />
      <rect x="44" y="55" width="12" height="12" rx="3" fill="#c4b5fd" />
      <circle cx="50" cy="61" r="3.5" fill="#7c3aed" />
      <circle cx="50" cy="61" r="1.5" fill="#a78bfa" />
      {/* handle */}
      <path d="M37 42 C37 27 63 27 63 42" fill="none" stroke="#4c1d95" strokeWidth="8" strokeLinecap="round" />
      <path d="M37 42 C37 25 63 25 63 42" fill="none" stroke="url(#bf-g)" strokeWidth="7" strokeLinecap="round" />
      <path d="M38 42 C38 26 62 26 62 42" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />
      {/* shine */}
      <ellipse cx="26" cy="49" rx="10" ry="6" fill="rgba(255,255,255,0.28)" transform="rotate(-15 26 49)" />
      <ellipse cx="28" cy="73" rx="6" ry="3" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   CRYSTAL BALL (indigo/violet)
═══════════════════════════════════════════ */
function CrystalSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="cr-g" cx="34%" cy="28%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="35%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
        <radialGradient id="cr-b" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#2e1065" />
        </radialGradient>
        <filter id="cr-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
        <filter id="cr-gl" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="26" ry="5" fill="rgba(0,0,0,0.3)" />
      <circle cx="50" cy="45" r="32" fill="#4f46e5" opacity="0.25" filter="url(#cr-gl)" />
      <circle cx="50" cy="45" r="30" fill="url(#cr-g)" filter="url(#cr-d)" />
      <ellipse cx="50" cy="50" rx="20" ry="8" fill="none" stroke="rgba(139,92,246,0.45)" strokeWidth="2" />
      <ellipse cx="50" cy="45" rx="15" ry="11" fill="none" stroke="rgba(196,181,253,0.35)" strokeWidth="1.5" transform="rotate(-30 50 45)" />
      <circle cx="43" cy="48" r="1.8" fill="white" opacity="0.95" />
      <circle cx="58" cy="40" r="1.2" fill="white" opacity="0.75" />
      <circle cx="53" cy="56" r="1.1" fill="white" opacity="0.6" />
      <circle cx="38" cy="38" r="1.3" fill="white" opacity="0.8" />
      <circle cx="60" cy="52" r="0.9" fill="white" opacity="0.6" />
      {/* base */}
      <path d="M35 75 L38 82 L62 82 L65 75 Z" fill="#2e1065" transform="translate(3,3)" />
      <ellipse cx="53" cy="81" rx="16" ry="7" fill="#2e1065" />
      <path d="M35 75 L38 82 L62 82 L65 75 Z" fill="url(#cr-b)" />
      <ellipse cx="50" cy="80" rx="16" ry="7" fill="url(#cr-b)" />
      {/* shine */}
      <ellipse cx="36" cy="31" rx="12" ry="8" fill="rgba(255,255,255,0.42)" transform="rotate(-30 36 31)" />
      <ellipse cx="63" cy="40" rx="5" ry="3" fill="rgba(255,255,255,0.2)" transform="rotate(-15 63 40)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   DOCUMENT / RESUME (emerald)
═══════════════════════════════════════════ */
function DocumentSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="dc-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id="dc-f" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="dc-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="26" ry="5" fill="rgba(0,0,0,0.28)" />
      <rect x="24" y="18" width="52" height="68" rx="5" fill="#065f46" />
      <rect x="20" y="14" width="52" height="68" rx="5" fill="url(#dc-g)" filter="url(#dc-d)" />
      <path d="M57 14 L72 14 L72 29 Z" fill="#065f46" />
      <path d="M57 14 L57 29 L72 29 Z" fill="url(#dc-f)" />
      <path d="M57 14 L72 29" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <rect x="27" y="37" width="26" height="4" rx="2" fill="rgba(255,255,255,0.7)" />
      <rect x="27" y="45" width="34" height="2.5" rx="1.25" fill="rgba(255,255,255,0.45)" />
      <rect x="27" y="53" width="37" height="2.5" rx="1.25" fill="rgba(255,255,255,0.35)" />
      <rect x="27" y="59" width="30" height="2.5" rx="1.25" fill="rgba(255,255,255,0.30)" />
      <rect x="27" y="65" width="35" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)" />
      <rect x="27" y="71" width="22" height="2.5" rx="1.25" fill="rgba(255,255,255,0.20)" />
      <circle cx="37" cy="25" r="7" fill="rgba(16,185,129,0.45)" />
      <path d="M34 25 L36 27 L40 22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="27" cy="21" rx="8" ry="4" fill="rgba(255,255,255,0.32)" transform="rotate(-10 27 21)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   RECOVERY ARROWS (rose)
═══════════════════════════════════════════ */
function RecoverySVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="rv-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <filter id="rv-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
        <filter id="rv-gl" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="27" ry="5" fill="rgba(0,0,0,0.28)" />
      <circle cx="53" cy="52" r="35" fill="none" stroke="#9f1239" strokeWidth="12" opacity="0.6" />
      <path d="M22 42 A30 30 0 1 1 50 82" fill="none" stroke="url(#rv-g)" strokeWidth="11" strokeLinecap="round" filter="url(#rv-d)" />
      <polygon points="19,32 30,37 21,47" fill="#fda4af" />
      <polygon points="58,88 48,82 56,73" fill="#fda4af" />
      <circle cx="50" cy="49" r="16" fill="rgba(159,18,57,0.45)" />
      <circle cx="50" cy="49" r="13" fill="rgba(0,0,0,0.35)" />
      <path d="M50 62 L50 38" fill="none" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" />
      <polygon points="50,35 46,43 54,43" fill="#fda4af" />
      <path d="M50 47 Q40 42 36 46" fill="none" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 47 Q60 42 64 46" fill="none" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="27" cy="27" rx="9" ry="5" fill="rgba(255,255,255,0.32)" transform="rotate(-45 27 27)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   LIGHTNING BOLT (amber/yellow)
═══════════════════════════════════════════ */
function LightningSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lt-g" x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <filter id="lt-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
        <filter id="lt-gl" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="22" ry="5" fill="rgba(0,0,0,0.3)" />
      <path d="M56 10 L30 52 L46 52 L38 90 L68 42 L52 42 Z" fill="#fbbf24" opacity="0.2" filter="url(#lt-gl)" />
      <path d="M60 11 L34 53 L50 53 L42 91 L72 43 L56 43 Z" fill="#92400e" />
      <path d="M56 10 L30 52 L46 52 L38 90 L68 42 L52 42 Z" fill="url(#lt-g)" filter="url(#lt-d)" />
      <path d="M55 16 L36 49 L48 49 L42 80 L62 47 L50 47 Z" fill="rgba(255,255,150,0.3)" />
      <ellipse cx="42" cy="26" rx="6" ry="10" fill="rgba(255,255,255,0.42)" transform="rotate(-10 42 26)" />
      <circle cx="21" cy="32" r="2.2" fill="#fde68a" opacity="0.8" />
      <circle cx="77" cy="55" r="1.6" fill="#fde68a" opacity="0.6" />
      <circle cx="23" cy="62" r="1.4" fill="#fde68a" opacity="0.5" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   CALENDAR (sky blue)
═══════════════════════════════════════════ */
function CalendarSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ca-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="ca-h" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="ca-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="30" ry="5" fill="rgba(0,0,0,0.28)" />
      <rect x="17" y="24" width="64" height="62" rx="6" fill="#0369a1" />
      <rect x="14" y="21" width="64" height="62" rx="6" fill="url(#ca-g)" filter="url(#ca-d)" />
      <rect x="14" y="21" width="64" height="22" rx="6" fill="url(#ca-h)" />
      <rect x="14" y="35" width="64" height="8" fill="#0284c7" />
      <rect x="29" y="13" width="8" height="16" rx="4" fill="#075985" />
      <rect x="63" y="13" width="8" height="16" rx="4" fill="#075985" />
      <rect x="30" y="12" width="6" height="14" rx="3" fill="#7dd3fc" />
      <rect x="64" y="12" width="6" height="14" rx="3" fill="#7dd3fc" />
      <rect x="22" y="26" width="28" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2].map((row) => (
          <rect key={`${col}-${row}`}
            x={20 + col * 14} y={47 + row * 12}
            width="10" height="10" rx="2.5"
            fill={col === 1 && row === 1 ? "#0ea5e9" : "rgba(255,255,255,0.15)"} />
        ))
      )}
      <circle cx="34" cy="57" r="2.5" fill="white" />
      <ellipse cx="24" cy="28" rx="8" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-10 24 28)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   SUNRISE (orange/gold)
═══════════════════════════════════════════ */
function SunriseSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="sr-g" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        <filter id="sr-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.45)" />
        </filter>
        <filter id="sr-gl" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="32" ry="5" fill="rgba(0,0,0,0.28)" />
      <rect x="10" y="70" width="80" height="16" rx="5" fill="#7c2d12" />
      <rect x="10" y="67" width="80" height="12" rx="5" fill="#c2410c" />
      <rect x="10" y="64" width="80" height="9" rx="5" fill="#ea580c" />
      <circle cx="50" cy="60" r="24" fill="#f97316" opacity="0.3" filter="url(#sr-gl)" />
      <circle cx="50" cy="60" r="20" fill="url(#sr-g)" filter="url(#sr-d)" />
      <path d="M50 35 L47 26 L50 17 L53 26 Z" fill="#fde68a" />
      <path d="M68 48 L74 41 L81 37 L75 44 Z" fill="#fde68a" />
      <path d="M32 48 L26 41 L19 37 L25 44 Z" fill="#fde68a" />
      <path d="M73 63 L82 61 L90 63 L82 65 Z" fill="#fde68a" />
      <path d="M27 63 L18 61 L10 63 L18 65 Z" fill="#fde68a" />
      <path d="M67 31 L72 24 L76 18 L70 25 Z" fill="#fde68a" />
      <path d="M33 31 L28 24 L24 18 L30 25 Z" fill="#fde68a" />
      <ellipse cx="40" cy="52" rx="8" ry="5.5" fill="rgba(255,255,255,0.42)" transform="rotate(-30 40 52)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   HEART (pink)
═══════════════════════════════════════════ */
function HeartSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="ht-g" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="45%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#831843" />
        </radialGradient>
        <filter id="ht-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
        </filter>
        <filter id="ht-gl" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="28" ry="5" fill="rgba(0,0,0,0.28)" />
      <path d="M50 83 C50 83 13 60 13 37 C13 26 21 17 31 17 C37 17 43 20 50 26 C57 20 63 17 69 17 C79 17 87 26 87 37 C87 60 50 83 50 83Z"
        fill="#ec4899" opacity="0.25" filter="url(#ht-gl)" />
      <path d="M50 83 C50 83 13 60 13 37 C13 26 21 17 31 17 C37 17 43 20 50 26 C57 20 63 17 69 17 C79 17 87 26 87 37 C87 60 50 83 50 83Z"
        fill="#831843" transform="translate(3,4)" />
      <path d="M50 81 C50 81 12 59 12 37 C12 26 20 17 30 17 C36 17 42 20 50 26 C58 20 64 17 70 17 C80 17 88 26 88 37 C88 59 50 81 50 81Z"
        fill="url(#ht-g)" filter="url(#ht-d)" />
      <path d="M50 73 C50 73 20 55 20 38 C20 31 26 25 32 25 C37 25 42 28 47 33"
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="7" strokeLinecap="round" />
      <path d="M24 53 L33 53 L37 43 L42 63 L47 53 L76 53"
        fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="28" cy="27" rx="11" ry="6.5" fill="rgba(255,255,255,0.42)" transform="rotate(-30 28 27)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   COIN STACK (green/gold)
═══════════════════════════════════════════ */
function CoinSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="cn-g" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </radialGradient>
        <filter id="cn-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="32" ry="5" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="50" cy="80" rx="32" ry="11" fill="#14532d" />
      <rect x="18" y="67" width="64" height="13" fill="#15803d" />
      <ellipse cx="50" cy="67" rx="32" ry="11" fill="#166534" />
      <ellipse cx="50" cy="57" rx="32" ry="11" fill="#14532d" />
      <rect x="18" y="44" width="64" height="13" fill="#16a34a" />
      <ellipse cx="50" cy="44" rx="32" ry="11" fill="#15803d" />
      <ellipse cx="50" cy="34" rx="32" ry="11" fill="url(#cn-g)" filter="url(#cn-d)" />
      <text x="50" y="39" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#052e16" fontFamily="Arial, sans-serif">&#8377;</text>
      <ellipse cx="50" cy="34" rx="26" ry="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <ellipse cx="33" cy="29" rx="12" ry="5" fill="rgba(255,255,255,0.42)" transform="rotate(-15 33 29)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   DOOR / SIGN OUT (slate)
═══════════════════════════════════════════ */
function DoorSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="dr-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="dr-p" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="dr-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="30" ry="5" fill="rgba(0,0,0,0.28)" />
      <rect x="19" y="13" width="56" height="73" rx="4" fill="#0f172a" />
      <rect x="16" y="10" width="56" height="73" rx="4" fill="url(#dr-g)" filter="url(#dr-d)" />
      <rect x="22" y="18" width="44" height="60" rx="3" fill="#0f172a" />
      <rect x="19" y="15" width="44" height="60" rx="3" fill="url(#dr-p)" />
      <rect x="24" y="20" width="15" height="22" rx="2" fill="rgba(0,0,0,0.25)" />
      <rect x="43" y="20" width="15" height="22" rx="2" fill="rgba(0,0,0,0.25)" />
      <rect x="24" y="20" width="15" height="1.5" rx="0.75" fill="rgba(255,255,255,0.18)" />
      <rect x="43" y="20" width="15" height="1.5" rx="0.75" fill="rgba(255,255,255,0.18)" />
      <rect x="24" y="46" width="15" height="24" rx="2" fill="rgba(0,0,0,0.25)" />
      <rect x="43" y="46" width="15" height="24" rx="2" fill="rgba(0,0,0,0.25)" />
      <circle cx="59" cy="47" r="4.5" fill="#334155" />
      <circle cx="58" cy="46" r="3.2" fill="#64748b" />
      <circle cx="57" cy="45" r="1.5" fill="#cbd5e1" />
      <path d="M72 38 L82 46 L72 54" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="66" y1="46" x2="82" y2="46" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="25" cy="21" rx="7" ry="4" fill="rgba(255,255,255,0.18)" transform="rotate(-10 25 21)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   STAR (gold)
═══════════════════════════════════════════ */
function StarSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="st-g" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#854d0e" />
        </radialGradient>
        <filter id="st-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
        <filter id="st-gl" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="28" ry="5" fill="rgba(0,0,0,0.3)" />
      <path d="M50 12 L56 34 L80 34 L62 48 L68 70 L50 56 L32 70 L38 48 L20 34 L44 34 Z"
        fill="#facc15" opacity="0.2" filter="url(#st-gl)" />
      <path d="M50 12 L56 34 L80 34 L62 48 L68 70 L50 56 L32 70 L38 48 L20 34 L44 34 Z"
        fill="#854d0e" transform="translate(3,4)" />
      <path d="M50 12 L56 34 L80 34 L62 48 L68 70 L50 56 L32 70 L38 48 L20 34 L44 34 Z"
        fill="url(#st-g)" filter="url(#st-d)" />
      <path d="M50 20 L54 37 L70 37 L57 46 L61 62 L50 53 L39 62 L43 46 L30 37 L46 37 Z"
        fill="rgba(255,255,200,0.22)" />
      <ellipse cx="34" cy="29" rx="9" ry="5.5" fill="rgba(255,255,255,0.45)" transform="rotate(-30 34 29)" />
      <circle cx="82" cy="18" r="2.2" fill="#fef9c3" opacity="0.9" />
      <circle cx="17" cy="24" r="1.6" fill="#fef9c3" opacity="0.7" />
      <circle cx="84" cy="68" r="1.5" fill="#fef9c3" opacity="0.6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   COMPASS (teal)
═══════════════════════════════════════════ */
function CompassSVG({ size }: { size: number }) {
  const ticks = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="co-g" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#ccfbf1" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#134e4a" />
        </radialGradient>
        <filter id="co-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="30" ry="5" fill="rgba(0,0,0,0.28)" />
      <circle cx="53" cy="53" r="36" fill="#134e4a" />
      <circle cx="50" cy="50" r="36" fill="url(#co-g)" filter="url(#co-d)" />
      <circle cx="50" cy="50" r="28" fill="#0d9488" opacity="0.35" />
      <circle cx="50" cy="50" r="23" fill="#0a0e17" opacity="0.85" />
      {ticks.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 90 === 0;
        return (
          <line key={i}
            x1={50 + Math.cos(rad) * (isMajor ? 22 : 24)} y1={50 + Math.sin(rad) * (isMajor ? 22 : 24)}
            x2={50 + Math.cos(rad) * 27} y2={50 + Math.sin(rad) * 27}
            stroke={isMajor ? "#ccfbf1" : "#0d9488"} strokeWidth={isMajor ? 2 : 1} />
        );
      })}
      <text x="50" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ccfbf1" fontFamily="Arial,sans-serif">N</text>
      <text x="50" y="84" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5eead4" fontFamily="Arial,sans-serif">S</text>
      <text x="82" y="54" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5eead4" fontFamily="Arial,sans-serif">E</text>
      <text x="18" y="54" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5eead4" fontFamily="Arial,sans-serif">W</text>
      <polygon points="50,72 47,56 53,56" fill="#cbd5e1" />
      <polygon points="50,28 47,44 53,44" fill="#f43f5e" />
      <circle cx="50" cy="50" r="5" fill="#f59e0b" />
      <circle cx="50" cy="50" r="2.5" fill="#fef9c3" />
      <ellipse cx="29" cy="27" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-45 29 27)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   ROCKET (indigo/orange)
═══════════════════════════════════════════ */
function RocketSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="rk-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="60%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id="rk-f" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <filter id="rk-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="24" ry="5" fill="rgba(0,0,0,0.28)" />
      <path d="M43 78 Q50 90 57 78" fill="url(#rk-f)" filter="url(#rk-d)" />
      <path d="M46 80 Q50 87 54 80" fill="#fbbf24" />
      <path d="M38 68 L30 82 L42 74 Z" fill="#4338ca" />
      <path d="M62 68 L70 82 L58 74 Z" fill="#4338ca" />
      <path d="M38 68 L32 80 L42 74 Z" fill="#6366f1" />
      <path d="M62 68 L68 80 L58 74 Z" fill="#6366f1" />
      <path d="M58 18 Q68 38 68 62 L58 72 L50 76 L42 72 L32 62 Q32 38 42 18 Q50 8 58 18Z" fill="#3730a3" />
      <path d="M56 16 Q66 36 66 62 L56 72 L50 76 L44 72 L34 62 Q34 36 44 16 Q50 6 56 16Z" fill="url(#rk-g)" filter="url(#rk-d)" />
      <circle cx="50" cy="50" r="10" fill="#1e1b4b" />
      <circle cx="50" cy="50" r="8" fill="#312e81" />
      <ellipse cx="46" cy="46" rx="4" ry="3" fill="rgba(255,255,255,0.35)" transform="rotate(-30 46 46)" />
      <ellipse cx="39" cy="32" rx="5" ry="12" fill="rgba(255,255,255,0.3)" transform="rotate(15 39 32)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   BRAIN (violet)
═══════════════════════════════════════════ */
function BrainSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="br-g" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="55%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#4c1d95" />
        </radialGradient>
        <filter id="br-d" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="26" ry="5" fill="rgba(0,0,0,0.28)" />
      <path d="M50 18 C65 16 80 26 80 43 C80 52 76 58 70 63 C74 66 76 72 74 78 C72 84 66 86 61 85 L50 85 L39 85 C34 86 28 84 26 78 C24 72 26 66 30 63 C24 58 20 52 20 43 C20 26 35 16 50 18Z"
        fill="#4c1d95" transform="translate(2,3)" />
      <path d="M50 18 C65 16 80 26 80 43 C80 52 76 58 70 63 C74 66 76 72 74 78 C72 84 66 86 61 85 L50 85 L39 85 C34 86 28 84 26 78 C24 72 26 66 30 63 C24 58 20 52 20 43 C20 26 35 16 50 18Z"
        fill="url(#br-g)" filter="url(#br-d)" />
      <line x1="50" y1="20" x2="50" y2="85" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <path d="M28 38 Q36 33 38 42 Q40 50 34 55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 50 Q30 46 32 56 Q34 64 28 68" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
      <path d="M72 38 Q64 33 62 42 Q60 50 66 55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M78 50 Q70 46 68 56 Q66 64 72 68" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="47" r="2" fill="rgba(255,255,255,0.5)" />
      <circle cx="65" cy="47" r="2" fill="rgba(255,255,255,0.5)" />
      <circle cx="42" cy="63" r="1.5" fill="rgba(255,255,255,0.4)" />
      <circle cx="58" cy="63" r="1.5" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="32" cy="26" rx="10" ry="5.5" fill="rgba(255,255,255,0.38)" transform="rotate(-20 32 26)" />
    </svg>
  );
}
