"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface GameLikertProps {
  value: number | null;
  onChange: (value: number) => void;
}

const labels: Record<number, string> = {
  1: "Never / Very Low",
  2: "Rarely",
  3: "Sometimes",
  4: "Often",
  5: "Always / Excellent",
};

export default function GameLikert({ value, onChange }: GameLikertProps) {
  const [hover, setHover] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keyboard controls: Left/Right to adjust, 1..5 to set, Enter to confirm (noop here)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName || "").toUpperCase())) return;
      if (e.key >= "1" && e.key <= "5") {
        onChange(Number(e.key));
        pulse();
      } else if (e.key === "ArrowRight") {
        onChange(Math.min(5, (value || 0) + 1));
        pulse();
      } else if (e.key === "ArrowLeft") {
        onChange(Math.max(1, (value || 6) - 1));
        pulse();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onChange, value]);

  const pulse = () => {
    const el = containerRef.current;
    if (!el) return;
    el.classList.remove("anim-pop-in");
    void el.offsetWidth; // reflow
    el.classList.add("anim-pop-in");
  };

  const items = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <div ref={containerRef} className="flex items-center justify-between gap-2 md:gap-4 anim-fade-slide-up select-none">
      {items.map((n) => {
        const active = value === n;
        const isHover = hover === n;
        return (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => { onChange(n); pulse(); }}
            className={`relative flex-1 min-w-[52px] md:min-w-[64px] h-16 md:h-20 rounded-xl border text-center transition-all duration-200 ${
              active
                ? "bg-white text-black border-white burst"
                : isHover
                  ? "border-neutral-500 bg-neutral-900 text-white"
                  : "border-neutral-700 bg-neutral-900 text-white"
            }`}
            aria-pressed={active}
            aria-label={`${n} - ${labels[n]}`}
          >
            <div className="absolute inset-0 rounded-xl" style={{boxShadow: active ? "0 0 30px rgba(255,255,255,0.25) inset" : undefined}} />
            <div className="relative z-10 flex h-full flex-col items-center justify-center">
              <span className="text-lg md:text-xl font-extrabold">{n}</span>
              <span className="mt-1 text-[10px] md:text-xs opacity-70">{labels[n]}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
