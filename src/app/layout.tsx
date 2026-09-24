import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060d1c",
};

export const metadata: Metadata = {
  title: "Novel Axis Solutions — Digital Engineering Studio",
  description:
    "Novel Axis Solutions is a digital engineering studio. We design and build Shopify ecosystems, modern websites, web applications, and custom digital products — engineered to perform.",
  keywords: [
    "Shopify development",
    "web development",
    "React",
    "Next.js",
    "UI UX design",
    "custom applications",
    "digital products",
  ],
  authors: [{ name: "Novel Axis Solutions" }],
  openGraph: {
    type: "website",
    title: "Novel Axis Solutions — Digital Engineering Studio",
    description:
      "We design and engineer high-performance digital experiences — from Shopify ecosystems to custom applications.",
    siteName: "Novel Axis Solutions",
  },
  twitter: {
    card: "summary_large_image",
    title: "Novel Axis Solutions — Digital Engineering Studio",
    description:
      "We design and engineer high-performance digital experiences — from Shopify ecosystems to custom applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${instrument.variable}`}>
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}