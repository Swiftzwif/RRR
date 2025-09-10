interface PageProps { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <main className="px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold">{slug.replace(/-/g, ' ')}</h1>
        <p className="mt-4 text-[var(--muted-fg)]">Full article coming soon.</p>
      </div>
    </main>
  );
}

