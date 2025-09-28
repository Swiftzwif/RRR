import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lane Diagnostic Game",
  description: "Gamified assessment to discover your financial lane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0f9ff', 
        color: '#075985',
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        margin: 0,
        padding: 0
      }}>
        {children}
      </body>
    </html>
  );
}
