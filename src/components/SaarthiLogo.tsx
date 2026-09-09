"use client";

interface SaarthiLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export default function SaarthiLogo({
  size = "md",
  showText = true,
  subtitle = "RECALCULATES WITHOUT JUDGMENT",
  className = "",
}: SaarthiLogoProps) {
  const sizeMap = {
    sm: { box: "w-8 h-8", icon: "w-5 h-5", text: "text-base", sub: "text-[8px]" },
    md: { box: "w-10 h-10", icon: "w-6 h-6", text: "text-lg", sub: "text-[9px]" },
    lg: { box: "w-12 h-12", icon: "w-7 h-7", text: "text-xl", sub: "text-[10px]" },
    xl: { box: "w-16 h-16", icon: "w-9 h-9", text: "text-2xl", sub: "text-[11px]" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        {/* Royal Saffron & Gold Badge */}
        <div
          className={`${currentSize.box} rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-orange-700 p-0.5 border border-amber-300/50 flex items-center justify-center shadow-[0_0_22px_rgba(245,158,11,0.5)] transition-transform hover:scale-105 group`}
        >
          <div className="w-full h-full rounded-[10px] bg-[#0d1322] flex items-center justify-center">
            {/* Mahabharata Royal Chariot Wheel SVG */}
            <svg
              className={`${currentSize.icon} text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] transform group-hover:rotate-45 transition-transform duration-700`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer Golden Chariot Rim */}
              <circle cx="12" cy="12" r="9" className="stroke-amber-400" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="7.5" className="stroke-amber-300/60" strokeWidth="1" strokeDasharray="2 1.5" />

              {/* Center Royal Hub */}
              <circle cx="12" cy="12" r="2.8" className="fill-amber-400 stroke-amber-200" />
              <circle cx="12" cy="12" r="1.2" className="fill-[#0d1322]" />

              {/* 8 Sacred Chariot Spokes */}
              <line x1="12" y1="3" x2="12" y2="9.2" className="stroke-amber-300" strokeWidth="1.6" />
              <line x1="12" y1="14.8" x2="12" y2="21" className="stroke-amber-300" strokeWidth="1.6" />
              <line x1="3" y1="12" x2="9.2" y2="12" className="stroke-amber-300" strokeWidth="1.6" />
              <line x1="14.8" y1="12" x2="21" y2="12" className="stroke-amber-300" strokeWidth="1.6" />

              {/* Diagonal Spokes */}
              <line x1="5.64" y1="5.64" x2="10.02" y2="10.02" className="stroke-amber-400/80" strokeWidth="1.4" />
              <line x1="13.98" y1="13.98" x2="18.36" y2="18.36" className="stroke-amber-400/80" strokeWidth="1.4" />
              <line x1="18.36" y1="5.64" x2="13.98" y2="10.02" className="stroke-amber-400/80" strokeWidth="1.4" />
              <line x1="10.02" y1="13.98" x2="5.64" y2="18.36" className="stroke-amber-400/80" strokeWidth="1.4" />
            </svg>
          </div>
        </div>

        {/* Sacred Flame Dot */}
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full border-2 border-[#0a0e17] animate-pulse shadow-[0_0_10px_#f59e0b]" />
      </div>

      {showText && (
        <div>
          <h1 className={`${currentSize.text} font-black tracking-tight font-[Cinzel] text-white flex items-center gap-2`}>
            <span className="animated-mahabharata-text">Saarthi</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-sans font-bold uppercase">
              GUIDE
            </span>
          </h1>
          {subtitle && (
            <p className={`${currentSize.sub} text-amber-400/80 uppercase tracking-[0.2em] font-sans font-medium`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
