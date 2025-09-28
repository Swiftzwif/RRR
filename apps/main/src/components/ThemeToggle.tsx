"use client";

import { useEffect, useState } from "react";

type ThemeKey = "nebula" | "ember" | "mono" | "void";

const THEMES: { key: ThemeKey; label: string; emoji: string }[] = [
  { key: "nebula", label: "Nebula", emoji: "🪐" },
  { key: "ember", label: "Ember", emoji: "🔥" },
  { key: "mono", label: "Mono", emoji: "🧊" },
  { key: "void", label: "Void", emoji: "🌌" },
];

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<ThemeKey>("nebula");

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && (localStorage.getItem('theme') as ThemeKey)) || null;
    const initial = saved && THEMES.some(t => t.key === saved) ? saved : "nebula";
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] p-1">
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors ${theme === t.key ? 'bg-white/10 text-white' : 'text-[var(--muted-fg)] hover:text-white'}`}
            aria-pressed={theme === t.key}
            aria-label={`Switch to ${t.label} theme`}
          >
            <span aria-hidden className="mr-1">{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {THEMES.map((t) => (
        <button
          key={t.key}
          onClick={() => setTheme(t.key)}
          className={`px-3 h-9 rounded-full border text-sm transition-colors ${
            theme === t.key
              ? 'border-[var(--cta-bg)] bg-[var(--cta-bg)] text-white'
              : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-fg)] hover:text-white'
          }`}
          aria-pressed={theme === t.key}
        >
          <span className="mr-1" aria-hidden>{t.emoji}</span>{t.label}
        </button>
      ))}
    </div>
  );
}

