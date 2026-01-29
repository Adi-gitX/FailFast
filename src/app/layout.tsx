import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premortem - AI Startup Failure Intelligence",
  description: "Know how your startup will fail before it does. AI-powered premortem analysis for founders and investors.",
  keywords: ["startup", "validation", "AI", "failure analysis", "premortem", "risk assessment"],
  openGraph: {
    title: "Premortem - AI Startup Failure Intelligence",
    description: "Know how your startup will fail before it does.",
    type: "website",
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
        className={`${ebGaramond.variable} ${inter.variable} font-sans antialiased min-h-screen bg-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
