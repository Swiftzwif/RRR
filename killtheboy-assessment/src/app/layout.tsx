import { getCopy } from "@/lib/copy";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Trajectory | Your Life Assessment",
    template: "%s | Trajectory",
  },
  description: getCopy("brand.description"),
  openGraph: {
    title: "Trajectory | Your Life Assessment",
    description: getCopy("brand.description"),
    url: "https://trajectory.example.com",
    siteName: "Trajectory",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trajectory Life Assessment",
    description: getCopy("brand.description"),
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-body bg-sky-50 text-sky-800">
        <header className="sticky top-0 z-40 bg-header-bg/95 backdrop-blur border-b border-sky-200/10">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-display font-bold text-sky-800"
            >
              {getCopy("brand.name")}
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <Link
                href="/story"
                className="text-sky-600 hover:text-sky-800 transition-colors"
              >
                {getCopy("nav.story")}
              </Link>
              <Link
                href="/assessment"
                className="text-sky-600 hover:text-sky-800 transition-colors"
              >
                {getCopy("nav.assessment")}
              </Link>
              <Link
                href="/lane-diagnostic/landing"
                className="text-sky-600 hover:text-sky-800 transition-colors"
              >
                {getCopy("nav.laneDiagnostic")}
              </Link>
              <Link
                href="/course"
                className="text-sky-600 hover:text-sky-800 transition-colors"
              >
                {getCopy("nav.course")}
              </Link>
              <Link
                href="/coaching"
                className="text-sky-600 hover:text-sky-800 transition-colors"
              >
                {getCopy("nav.coaching")}
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-sky-600 hover:text-sky-800 transition-colors text-sm"
              >
                {getCopy("nav.signin")}
              </Link>
              <Link
                href="/assessment"
                className="strata-button text-sm px-4 py-2"
              >
                {getCopy("nav.assessment")}
              </Link>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="border-t border-sky-200/10 py-12 mt-24 bg-sky-800">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="font-display font-bold text-white mb-2">
                {getCopy("brand.name")}
              </div>
              <p className="text-sky-200">{getCopy("brand.tagline")}</p>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Links</div>
              <div className="flex flex-col gap-2 text-sky-200">
                <Link
                  href="/story"
                  className="hover:text-white transition-colors"
                >
                  {getCopy("footer.links.about")}
                </Link>
                <Link
                  href="/course"
                  className="hover:text-white transition-colors"
                >
                  {getCopy("nav.course")}
                </Link>
                <Link
                  href="/coaching"
                  className="hover:text-white transition-colors"
                >
                  {getCopy("nav.coaching")}
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  {getCopy("footer.links.privacy")}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">
                {getCopy("footer.newsletter.title")}
              </div>
              <p className="text-xs text-sky-200">
                {getCopy("footer.newsletter.description")}
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-8 text-xs text-sky-200 flex items-center justify-between">
            <span>
              {getCopy("footer.copyright", {
                year: new Date().getFullYear().toString(),
              })}
            </span>
            <span className="font-semibold text-white">
              {getCopy("footer.tagline")}
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
