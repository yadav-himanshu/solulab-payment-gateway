import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StatusOverlay } from "@/components/StatusOverlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecurePay | Production-Grade Payment Gateway",
  description: "A secure, scalable, and premium payment gateway interface built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#050505] selection:bg-indigo-500/30`}>
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
          {children}
        </main>
        <StatusOverlay />
      </body>
    </html>
  );
}
