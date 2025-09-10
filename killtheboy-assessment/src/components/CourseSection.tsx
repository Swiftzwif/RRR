export default function CourseSection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold">Rethink. Redesign. Reignite.</h3>
            <p className="mt-2 text-[var(--muted-fg)]">A compact $99 guide to reset your standards and rebuild momentum.</p>
          </div>
          <a href="#buy" className="hidden md:inline-flex rounded-full bg-[var(--cta-bg)] text-white px-5 py-2 font-semibold hover:bg-[var(--cta-bg-strong)]">Get the Guide Now</a>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["Six Human Needs", "Understand the drives under behavior."],
            ["Map of Consciousness", "Orient to higher-energy states."],
            ["Story Reframing", "Edit your narrative for power."],
            ["Standards Reset", "Install minimum viable excellence."],
            ["Relationship Audit", "Align or clean up energy drains."],
            ["Execution Systems", "Focus, energy, and consistent output."],
          ].map(([title, desc], idx) => (
            <div key={idx} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="text-2xl">🚀</div>
              <h4 className="mt-2 font-bold text-lg">{title}</h4>
              <p className="text-[var(--muted-fg)]">{desc}</p>
            </div>
          ))}
        </div>

        {/* Progression path */}
        <div className="mt-10 relative">
          <div className="h-2 rounded-full bg-black/30 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--electric)] to-[var(--teal)] w-1/2" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">🚀</div>
        </div>

        <div className="mt-8">
          <a id="buy" href="/assess" className="inline-flex rounded-full bg-[var(--cta-bg)] text-white px-6 py-3 font-semibold hover:bg-[var(--cta-bg-strong)]">Get the Guide Now</a>
        </div>
      </div>
    </section>
  );
}

