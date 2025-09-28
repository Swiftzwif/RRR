import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";

function readDoc(file: string) {
  const p = path.join(process.cwd(), "src", "content", file);
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function renderMarkdown(md: string) {
  // extremely tiny MD renderer: #, ##, lists, paragraphs
  const lines = md.split(/\r?\n/);
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (list.length) {
      out.push(
        <ul className="list-disc pl-6 space-y-1 text-neutral-700" key={`ul-${out.length}`}>
          {list.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  lines.forEach((line, idx) => {
    const t = line.trim();
    if (!t) {
      flushList();
      out.push(<div className="h-3" key={`sp-${idx}`} />);
      return;
    }
    if (t.startsWith("# ")) {
      flushList();
      out.push(
        <h2 className="text-2xl font-bold text-neutral-900" key={`h1-${idx}`}>{t.slice(2)}</h2>
      );
      return;
    }
    if (t.startsWith("## ")) {
      flushList();
      out.push(
        <h3 className="text-xl font-semibold text-neutral-900" key={`h2-${idx}`}>{t.slice(3)}</h3>
      );
      return;
    }
    if (t.startsWith("- ")) {
      list.push(t.slice(2));
      return;
    }
    flushList();
    out.push(
      <p className="text-neutral-700" key={`p-${idx}`}>{t}</p>
    );
  });
  flushList();
  return out;
}

export default function DocsPage() {
  const scoring = readDoc("scoring.md");
  const map = readDoc("screen_copy_map.md");
  const local = (() => {
    try {
      return fs.readFileSync(path.join(process.cwd(), "README.local.md"), "utf8");
    } catch {
      return "";
    }
  })();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[var(--foreground)]">Documentation</h1>
        <p className="text-[var(--muted-fg)] max-w-2xl">
          Source-of-truth docs are rendered inline so nothing is hidden. Edit files in <code className="bg-white/10 px-2 py-1 rounded">src/content</code> and they’ll appear here.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">Scoring</h2>
            <div className="max-w-none space-y-2 text-[var(--muted-fg)]">
              {renderMarkdown(scoring)}
            </div>
          </article>
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">Screen Copy Map</h2>
            <div className="max-w-none space-y-2 text-[var(--muted-fg)]">
              {renderMarkdown(map)}
            </div>
          </article>
          {local && (
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm md:col-span-2">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">Local Development Notes</h2>
              <div className="max-w-none space-y-2 text-[var(--muted-fg)]">
                {renderMarkdown(local)}
              </div>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
