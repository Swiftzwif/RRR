"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StorySplit() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".story-line");
      gsap.set(lines, { y: 8, opacity: 0 });
      gsap.to(lines, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="story" className="relative px-6 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="text-3xl md:text-4xl font-extrabold mb-6">Kill the Boy</h3>
          <div className="space-y-3 text-[var(--muted-fg)] text-lg">
            <p className="story-line">Not violence. Transformation.</p>
            <p className="story-line">Shed reactivity. Gain discipline.</p>
            <p className="story-line">Less impulse. More intention.</p>
            <p className="story-line">Less boy. More man.</p>
            <p className="story-line">This is your herald.</p>
          </div>
        </div>
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden holo border border-[var(--border)]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/0" />
          <div className="absolute inset-0 holo-grid" />
          <div className="absolute inset-0" aria-hidden>
            {/* Simulated silhouette + cosmic backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,.15)_0%,transparent_60%)]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-[60%] rounded-full bg-gradient-to-b from-white/80 to-transparent blur-2xl opacity-20" />
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] animate-[spin_20s_linear_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}

