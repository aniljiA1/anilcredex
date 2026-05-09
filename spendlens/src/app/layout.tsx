import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — Free AI Tool Spend Audit",
  description:
    "Find out if you're overpaying for AI tools. Get an instant audit of your Cursor, Claude, ChatGPT, and GitHub Copilot spend. Free, no login required.",
  openGraph: {
    title: "SpendLens — Free AI Tool Spend Audit",
    description: "Find out if you're overpaying for AI tools in under 2 minutes.",
    url: "https://spendlens.app",
    siteName: "SpendLens",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — Free AI Tool Spend Audit",
    description: "Find out if you're overpaying for AI tools in under 2 minutes.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
