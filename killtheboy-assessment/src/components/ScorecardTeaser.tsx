"use client";

import { useState } from "react";

export default function ScorecardTeaser() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "teaser" }) });
    if (res.ok) {
      try { localStorage.setItem('ktb_subscribed', '1'); } catch {}
      setOpen(false);
    }
  };

  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="text-3xl md:text-4xl font-extrabold">Get your personalized Trajectory Snapshot</h3>
          <p className="mt-3 text-[var(--muted-fg)]">Animated meters, clear baseline, and micro-actions to raise your floor this week.</p>
          <button onClick={() => setOpen(true)} className="mt-6 inline-flex rounded-full bg-[var(--cta-bg)] text-white px-6 py-3 font-semibold hover:bg-[var(--cta-bg-strong)]">Send it to my email</button>
          <p className="mt-2 text-xs text-[var(--muted-fg)]">Private. No spam.</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          {/* Mock meters */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-fg)]">Domain {i + 1}</span>
                <span className="text-[var(--muted-fg)]">{40 + i * 8}%</span>
              </div>
              <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 animate-[pulse_2s_ease_infinite]" style={{ width: `${40 + i * 8}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-6">
          <div className="w-full max-w-md rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold">Send my scorecard</h4>
              <button onClick={() => setOpen(false)} className="text-[var(--muted-fg)] hover:text-white">✕</button>
            </div>
            <form onSubmit={submit} className="mt-4 flex gap-2">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" className="flex-1 h-11 px-4 rounded-xl bg-white/90 text-black border border-[var(--border)] focus:ring-2 focus:ring-[var(--cta-bg)]" />
              <button className="h-11 px-5 rounded-xl bg-[var(--cta-bg)] text-white font-semibold hover:bg-[var(--cta-bg-strong)]">Send</button>
            </form>
            <p className="mt-2 text-xs text-[var(--muted-fg)]">We’ll also share weekly momentum levers.</p>
          </div>
        </div>
      )}
    </section>
  );
}
