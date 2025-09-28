"use client";

import { useEffect, useRef } from "react";

const ITEMS = [
  { quote: "Trajectory transformed me.", name: "J.D.", stars: 5 },
  { quote: "More signal, less noise.", name: "L.M.", stars: 5 },
  { quote: "Clarity I can execute on.", name: "A.K.", stars: 4 },
  { quote: "Best $99 I've spent.", name: "S.R.", stars: 5 },
  { quote: "Momentum unlocked.", name: "T.N.", stars: 5 },
];

export default function TestimonialsCarousel() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    let startX = 0, scrollLeft = 0;
    const onDown = (e: TouchEvent) => { startX = e.touches[0].pageX; scrollLeft = el.scrollLeft; };
    const onMove = (e: TouchEvent) => { const dx = e.touches[0].pageX - startX; el.scrollLeft = scrollLeft - dx; };
    el.addEventListener('touchstart', onDown, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    return () => { el.removeEventListener('touchstart', onDown); el.removeEventListener('touchmove', onMove); };
  }, []);

  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-extrabold">Trajectory Transformed Me</h3>
        <div ref={wrapRef} className="mt-6 overflow-x-auto">
          <div className="flex gap-4 pr-6">
            {[...ITEMS, ...ITEMS].map((t, i) => (
              <div key={i} className="min-w-[260px] max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="flex items-center gap-1 text-amber-400" aria-label={`${t.stars} star rating`}>
                  {Array.from({ length: t.stars }).map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="mt-3 text-lg">“{t.quote}”</p>
                <div className="mt-2 text-sm text-[var(--muted-fg)]">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

