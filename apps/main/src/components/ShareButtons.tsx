"use client";

export default function ShareButtons({ text, url }: { text: string; url: string }) {
  const shareNative = async () => {
    if ((navigator as any).share) {
      try { await (navigator as any).share({ title: "Trajectory", text, url }); } catch {}
    }
  };
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  return (
    <div className="flex items-center gap-3">
      <button onClick={shareNative} className="rounded-full border border-[var(--border)] px-4 py-2 hover:bg-white/10">Share</button>
      <a href={twitterUrl} target="_blank" className="rounded-full border border-[var(--border)] px-4 py-2 hover:bg-white/10">Twitter</a>
      <a href={linkedinUrl} target="_blank" className="rounded-full border border-[var(--border)] px-4 py-2 hover:bg-white/10">LinkedIn</a>
    </div>
  );
}

