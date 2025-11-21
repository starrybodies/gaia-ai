import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GAIA AI - Environmental Intelligence Platform",
  description:
    "Open-source platform providing universal access to Earth's environmental data through AI-powered visualization and analysis. Monitor climate, weather, air quality, biodiversity, and more.",
  keywords: [
    "environmental data",
    "climate monitoring",
    "earth observation",
    "AI visualization",
    "open source",
    "sustainability",
    "solarpunk",
  ],
  authors: [{ name: "GAIA AI Community" }],
  openGraph: {
    title: "GAIA AI - Environmental Intelligence Platform",
    description:
      "Universal access to Earth's vital environmental data through AI-powered dashboards",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
