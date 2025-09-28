export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="px-6 py-12">
      <div className="max-w-3xl mx-auto text-sm leading-7 text-[var(--muted-fg)]">
        <h1 className="text-3xl font-extrabold text-[var(--foreground)] mb-4">Privacy Policy</h1>
        <p>We respect your privacy. We store assessment submissions and leads to deliver results and occasional updates. You can unsubscribe anytime via the link in emails.</p>
        <p className="mt-4">Analytics and pixels (Google Analytics, Hotjar, Meta, Google Ads) may be enabled to improve the experience and reach. Configure environment variables to disable/enable.</p>
        <p className="mt-4">Contact: support@trajectory.example.com</p>
      </div>
    </main>
  );
}

