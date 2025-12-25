import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "block",
});

export const metadata: Metadata = {
  title: "Trajectory2.0 | Transform Your Life",
  description: "Unified webapp combining professional assessment system with beautiful animations. Transform into the commander of your life.",
  openGraph: {
    title: "Trajectory2.0 | Transform Your Life",
    description: "Unified webapp combining professional assessment system with beautiful animations. Transform into the commander of your life.",
    url: "https://trajectory2.example.com",
    siteName: "Trajectory2.0",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trajectory2.0 | Transform Your Life",
    description: "Unified webapp combining professional assessment system with beautiful animations.",
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
      <body className="antialiased font-body">
        <ErrorBoundary>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
