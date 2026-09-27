import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clauseguard-labs.vercel.app"),

  title: {
    default: "ClauseGuard — Evidence-first contract analysis",
    template: "%s | ClauseGuard",
  },

  description:
    "Evidence-first AI contract risk analysis that detects risky clauses, tracks obligations, and verifies findings against the original contract text.",

  applicationName: "ClauseGuard",

  keywords: [
    "ClauseGuard",
    "contract analysis",
    "AI contract analysis",
    "legal tech",
    "legal AI",
    "contract risk",
    "AI safety",
    "contract review",
  ],

  authors: [
    {
      name: "ClauseGuard",
    },
  ],

  creator: "ClauseGuard",

  openGraph: {
    type: "website",
    url: "https://clauseguard-labs.vercel.app",
    siteName: "ClauseGuard",
    title: "ClauseGuard — Evidence-first contract analysis",
    description:
      "AI-powered contract risk analysis with deterministic evidence verification.",
  },

  twitter: {
    card: "summary_large_image",
    title: "ClauseGuard — Evidence-first contract analysis",
    description:
      "AI-powered contract risk analysis with deterministic evidence verification.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}