import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: {
    default: "OxiPulse — Ultralight server monitoring agent",
    template: "%s | OxiPulse",
  },
  description:
    "Open-source telemetry agent written in Rust. Monitor your servers' vital signs with near-zero resource usage.",
  keywords: ["monitoring", "telemetry", "rust", "open-source", "observability", "grpc", "server"],
  authors: [{ name: "SecuryBlack", url: "https://securyblack.com" }],
  creator: "SecuryBlack",
  metadataBase: new URL("https://oxipulse.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oxipulse.dev",
    siteName: "OxiPulse",
    title: "OxiPulse — Ultralight server monitoring agent",
    description:
      "Open-source telemetry agent written in Rust. Monitor your servers' vital signs with near-zero resource usage.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OxiPulse — Ultralight server monitoring agent",
    description:
      "Open-source telemetry agent written in Rust. Monitor your servers' vital signs with near-zero resource usage.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0361X97VSE"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0361X97VSE');
          `}
        </Script>
      </body>
    </html>
  );
}
