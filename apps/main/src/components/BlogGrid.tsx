import Link from "next/link";

const POSTS = [
  { slug: "raise-your-floor", title: "Raise Your Floor", excerpt: "The fastest path to compounding is eliminating low-variance misses.", date: "2025-08-01" },
  { slug: "standards-reset", title: "Standards Reset", excerpt: "Design minimum viable excellence and hold it.", date: "2025-07-21" },
  { slug: "map-of-consciousness", title: "Map of Consciousness", excerpt: "Orient to high-energy behaviors you can choose daily.", date: "2025-07-12" },
];

export default function BlogGrid() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-extrabold">Resources</h3>
        <p className="mt-2 text-[var(--muted-fg)]">Articles, case studies, and free resources.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:shadow-[0_0_24px_rgba(56,189,248,0.25)] transition-shadow">
              <div className="text-xs text-[var(--muted-fg)]">{new Date(p.date).toLocaleDateString()}</div>
              <h4 className="mt-2 text-xl font-bold group-hover:cosmic-text">{p.title}</h4>
              <p className="mt-2 text-[var(--muted-fg)]">{p.excerpt}</p>
              <div className="mt-4 text-[var(--cta-bg)] font-semibold">Read →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

