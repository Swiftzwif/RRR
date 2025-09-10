"use client";

const AVATARS: { key: string; title: string; desc: string; emoji: string }[] = [
  { key: "Drifter", title: "Drifter", desc: "Pulled by impulse, scattered energy.", emoji: "🌊" },
  { key: "Balancer", title: "Balancer", desc: "Steady, developing consistency.", emoji: "⚖️" },
  { key: "Architect", title: "Architect", desc: "Deliberate, compounding upward.", emoji: "🏗️" },
];

export default function AvatarsShowcase() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-extrabold">Your Avatar</h3>
        <p className="mt-2 text-[var(--muted-fg)]">Hover to see the hologram distort.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {AVATARS.map((a) => (
            <div key={a.key} className="holo rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] p-6 hover:shadow-[0_0_40px_rgba(56,189,248,0.25)] transition-shadow">
              <div className="h-32 rounded-xl bg-gradient-to-br from-white/10 to-white/0 holo-grid grid place-items-center text-4xl">
                <span aria-hidden>{a.emoji}</span>
              </div>
              <h4 className="mt-4 text-xl font-bold">{a.title}</h4>
              <p className="text-[var(--muted-fg)]">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

