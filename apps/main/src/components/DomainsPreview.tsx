"use client";

import { useState } from "react";

const DOMAINS = [
  {
    key: "identity",
    label: "Identity",
    desc:
      "Identity sets your aim and your standards. When you know who you are and what you stand for, daily decisions get simpler and momentum compounds. We help you define a clear target and align habits to it.",
  },
  {
    key: "health",
    label: "Health",
    desc:
      "Energy is the base for everything. Sleep, nutrition, and training give you consistent fuel for focus and execution. We help you install simple rhythms that make high energy your default.",
  },
  {
    key: "finances",
    label: "Finances",
    desc:
      "Calm confidence with money frees attention. Clarity on earnings, spending, and buffers reduces noise and fear. We help you track the essentials and build steady forward pressure.",
  },
  {
    key: "relationships",
    label: "Relationships",
    desc:
      "Your environment sets your floor. The right people elevate standards; the wrong ones drain them. We help you audit ties, set boundaries, and invest in allies and mentors.",
  },
  {
    key: "emotions",
    label: "Emotions",
    desc:
      "Emotional regulation turns reactivity into signal. When you can return to calm, you choose your best move. We help you build practices to process fast and act on principle.",
  },
  {
    key: "focus",
    label: "Focus",
    desc:
      "Attention is your most valuable asset. Direct it to the few things that move the needle. We help you design a low‑noise environment and an execution system you trust.",
  },
];

export default function DomainsPreview() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold">Assessment Domains</h3>
            <p className="mt-2 text-[var(--muted-fg)]">Hover a card to reveal what the domain is and why it matters — and preview how its meter fills from red → yellow → green.</p>
          </div>
          <a href="/assess" className="hidden md:inline-flex rounded-full bg-[var(--cta-bg)] text-white px-5 py-2 font-semibold hover:bg-[var(--cta-bg-strong)]">Take the Free Assessment →</a>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAINS.map((d) => (
            <div
              key={d.key}
              onMouseEnter={() => setHovered(d.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(d.key)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              aria-expanded={hovered === d.key}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--cta-bg)]"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">{d.label}</h4>
                <span className="text-xs text-[var(--muted-fg)]">preview</span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-black/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width,background] duration-500"
                  style={{
                    width: hovered === d.key ? "85%" : "35%",
                    background: hovered === d.key
                      ? "linear-gradient(90deg,#ef4444,#f59e0b,#22c55e)"
                      : "linear-gradient(90deg,#ef4444,#f59e0b)",
                  }}
                />
              </div>

              {/* Description overlay (hidden until hover/focus) */}
              <div
                className={`mt-4 text-sm text-[var(--muted-fg)] transition-all duration-300 overflow-hidden ${
                  hovered === d.key ? 'opacity-100 translate-y-0 max-h-52' : 'opacity-0 -translate-y-1 max-h-0 pointer-events-none'
                }`}
                aria-hidden={hovered !== d.key}
              >
                {d.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
