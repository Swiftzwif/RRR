"use client";

import { useMemo } from "react";

interface GalaxyMapProps {
  domains: string[];
  activeDomain: string | null;
  completionByDomain: Record<string, number>; // 0..1
}

export default function GalaxyMap({ domains, activeDomain, completionByDomain }: GalaxyMapProps) {
  const nodes = useMemo(() => {
    const count = domains.length || 1;
    return domains.map((name, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1);
      return { name, t };
    });
  }, [domains]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm px-4 py-6 md:px-6 md:py-7">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(124,58,237,0.2)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0.2)" />
            </linearGradient>
          </defs>
          <path d="M 20 50 Q 50 15 90 50 T 180 50 T 270 50 T 360 50" stroke="url(#orbitGradient)" strokeWidth="1" fill="none"/>
        </svg>
      </div>
      <div className="relative flex items-center justify-between">
        {nodes.map(({ name, t }) => {
          const completion = Math.min(1, Math.max(0, completionByDomain[name] ?? 0));
          const isActive = activeDomain === name;
          const bg = isActive ? "bg-black" : completion > 0 ? "bg-neutral-700" : "bg-neutral-300";
          const ring = isActive ? "ring-4 ring-black/10" : completion > 0 ? "ring-2 ring-neutral-300" : "ring-0";
          return (
            <div key={name} className="flex-1 flex items-center justify-center">
              <div className={`relative h-3 w-3 md:h-4 md:w-4 rounded-full ${bg} ${ring}`}>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-neutral-600 select-none">
                  {name}
                </span>
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-neutral-400">
                  {Math.round(completion * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
