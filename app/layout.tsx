import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/src/trpc/client";
import RootProvider from "@/components/providers/RootProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bloom - AI-Powered Code Generation Platform",
  description: "Transform your ideas into production-ready code with Bloom's intelligent AI agents. Build applications faster with smart code generation, real-time collaboration, and seamless development workflows.",
  keywords: "AI code generation, code assistant, AI development tools, automated coding, intelligent code agents, rapid development, AI programming, code automation, developer tools, AI IDE",
  authors: [{ name: "Amardeep Lakshkar" }],
  creator: "Amardeep Lakshkar",
  publisher: "Amardeep Lakshkar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://bloom.amardeep.space"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bloom - AI-Powered Code Generation Platform",
    description: "Transform your ideas into production-ready code with Bloom's intelligent AI agents. Build faster, smarter, better.",
    url: "/",
    siteName: "Bloom",
    images: [
      {
        url: "https://bloom.amardeep.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bloom - AI-Powered Code Generation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloom - AI-Powered Code Generation Platform",
    description: "Transform your ideas into production-ready code with Bloom's intelligent AI agents. Build faster, smarter, better.",
    images: ["https://bloom.amardeep.space/og-image.png"],
    creator: "@AmardeepDevs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/media/favicon.ico" },
      { url: "/media/bloom.svg", type: "image/svg+xml" },
    ],
    shortcut: "/media/favicon.ico",
    apple: "/media/bloom.png",
  },
  manifest: "/manifest.json",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProvider>
        {children}
        </RootProvider>
      </body>
    </html>
    </TRPCReactProvider>
  );
}
