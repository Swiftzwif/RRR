import BlogGrid from "@/components/BlogGrid";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <main>
      <section className="px-6 pt-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold">Blog</h1>
          <p className="mt-2 text-[var(--muted-fg)]">Thoughts, case studies, and playbooks.</p>
        </div>
      </section>
      <BlogGrid />
    </main>
  );
}

