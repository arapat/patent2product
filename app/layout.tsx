import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import { FutureModeProvider } from "@/lib/FutureModeContext";
import { CommandBar } from "@/components/CommandBar";
import { FutureModeIndicator } from "@/components/FutureModeIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "patent2product",
  description: "AI-Powered Invention Engine - Discover hidden gems in patent databases and visualize their commercial potential",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased font-sans selection:bg-purple-500/30 selection:text-white`}
      >
        <FutureModeProvider>
          <div className="relative min-h-screen text-white">
            <Background />
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
            <CommandBar />
            <FutureModeIndicator />
          </div>
        </FutureModeProvider>
      </body>
    </html>
  );
}
