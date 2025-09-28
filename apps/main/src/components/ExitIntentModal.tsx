"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [armed, setArmed] = useState(false);
  const shownRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    // Do not show on touch devices
    const isTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    );

    // Suppress if already shown/dismissed this session or user subscribed
    const sessionShown = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('exitIntentShown') === '1';
    const sessionDismissed = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('exitIntentDismissed') === '1';
    const hasSubscribed = typeof localStorage !== 'undefined' && localStorage.getItem('ktb_subscribed') === '1';

    // Avoid showing on interactive flows like assessment form
    const blockOnRoute = pathname?.startsWith('/assess');

    if (isTouch || sessionShown || sessionDismissed || hasSubscribed || blockOnRoute) {
      return; // never arm
    }

    // Arm after any of: time on page OR scroll depth
    const t = window.setTimeout(() => setArmed(true), 15000);
    const onScroll = () => {
      if (window.scrollY > 400) setArmed(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Exit-intent detector (top edge only), debounced and single-fire
    let cooldown = false;
    const onMouseOut = (e: MouseEvent) => {
      if (!armed || shownRef.current || cooldown) return;
      const target = e.relatedTarget as Element | null;
      const topExit = e.clientY <= 0 && (!target || target.nodeName === 'HTML');
      if (!topExit) return;
      cooldown = true;
      setTimeout(() => (cooldown = false), 500);
      shownRef.current = true;
      sessionStorage.setItem('exitIntentShown', '1');
      setOpen(true);
    };

    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };

    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll as any);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [pathname, armed]);

  const close = () => {
    try { sessionStorage.setItem('exitIntentDismissed', '1'); } catch {}
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent" }),
      });
      try { localStorage.setItem('ktb_subscribed', '1'); } catch {}
      close();
    } catch {
      close();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 text-[var(--foreground)] shadow-xl">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">Before you go — grab the free scorecard</h3>
          <button onClick={close} aria-label="Close" className="text-[var(--muted-fg)] hover:text-white">✕</button>
        </div>
        <p className="mt-2 text-[var(--muted-fg)]">Drop your email and we’ll send the Trajectory Snapshot template so you can apply insights this week.</p>
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="flex-1 h-11 px-4 rounded-xl bg-white/90 text-black border border-[var(--border)] focus:ring-2 focus:ring-[var(--cta-bg)]"
          />
          <button className="h-11 px-5 rounded-xl bg-[var(--cta-bg)] text-white font-semibold hover:bg-[var(--cta-bg-strong)]">Send</button>
        </form>
        <p className="mt-2 text-xs text-[var(--muted-fg)]">We respect your time. No spam.</p>
      </div>
    </div>
  );
}
