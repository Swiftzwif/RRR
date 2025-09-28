"use client";

import { useState } from "react";

export default function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (res.ok) {
        try { localStorage.setItem('ktb_subscribed', '1'); } catch {}
        setOk(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (ok) {
    return <p className="text-sm text-[var(--muted-fg)]">Thanks — check your inbox.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@domain.com"
        className="flex-1 h-10 px-4 rounded-full bg-white/80 text-[var(--foreground)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--cta-bg)] transition-all focus:w-[110%]"
      />
      <button disabled={!email || loading} className="h-10 px-4 rounded-full bg-[var(--cta-bg)] text-white font-semibold hover:bg-[var(--cta-bg-strong)] disabled:opacity-50">
        {loading ? 'Sending…' : 'Subscribe'}
      </button>
    </form>
  );
}

