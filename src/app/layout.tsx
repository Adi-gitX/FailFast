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
  title: "FailFast",
  description: "Creative intelligence, on demand. Startups that fail fast, succeed faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ebGaramond.variable} ${inter.variable} antialiased min-h-screen`}
      >
        <div className="fixed inset-0 z-[-1]">
          <img
            src="/background.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
