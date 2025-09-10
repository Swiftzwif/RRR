export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4">
          About Kill The Boy
        </h1>
        <p className="text-neutral-700 text-lg max-w-2xl">
          A 10-minute trajectory audit designed to cut noise, surface the few levers that matter, and raise your floor. Built with a ruthless respect for focus, craft, and clarity.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 p-6 bg-white shadow-sm">
            <h2 className="font-semibold text-neutral-900">Principles</h2>
            <ul className="mt-3 list-disc pl-5 text-neutral-700 space-y-1">
              <li>Clarity over complexity</li>
              <li>Honesty over performance</li>
              <li>Leverage over volume</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-200 p-6 bg-white shadow-sm">
            <h2 className="font-semibold text-neutral-900">Promise</h2>
            <p className="mt-2 text-neutral-700">No fluff. Just the few insights that compound the fastest over the next 30 days.</p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-neutral-200 p-6 bg-white shadow-sm">
          <h2 className="font-semibold text-neutral-900">Why “Kill the boy”?</h2>
          <p className="mt-2 text-neutral-700">Not about violence. About transformation. Letting go of the reactive patterns that keep you average, stepping into responsibility, discipline, and presence.</p>
        </div>
      </section>
    </main>
  );
}
