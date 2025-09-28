"use client";

import { useEffect, useState } from "react";

export default function CoachingSection() {
  const total = Number(process.env.NEXT_PUBLIC_COACHING_SLOTS || 250);
  const [remaining, setRemaining] = useState<number>(total - 73); // mock remaining
  const pct = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));

  useEffect(() => {
    // Simulate ticking bar
    const i = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 15000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-3xl md:text-4xl font-extrabold">Only 250 Clients Accepted Per Year</h3>
        <p className="mt-2 text-[var(--muted-fg)]">Intense 1:1 focus on standards, systems, and velocity. Four sessions.</p>
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-left">
          <div className="flex items-center justify-between text-sm text-[var(--muted-fg)]"><span>Spots filled</span><span>{Math.round(pct)}%</span></div>
          <div className="mt-2 h-2 rounded-full bg-black/30 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 text-sm text-[var(--muted-fg)]">Remaining: <span className="text-white font-semibold">{remaining}</span></div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <ul className="list-disc list-inside text-[var(--muted-fg)]">
              <li>Week 1: Baseline & Standards Reset</li>
              <li>Week 2: Systems & Energy</li>
              <li>Week 3: Relationships & Boundaries</li>
              <li>Week 4: Execution & Compounding</li>
            </ul>
            <a href="/about" className="inline-flex rounded-full bg-[var(--cta-bg)] text-white px-6 py-3 font-semibold hover:bg-[var(--cta-bg-strong)]">Apply for Interview</a>
          </div>
        </div>
      </div>
    </section>
  );
}

