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
  title: "Crypto Icons Viewer",
  description: "A Next.js application to view crypto icons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <header className="bg-gray-800 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Crypto Icon Viewer</h1>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center text-sm">
          © {new Date().getFullYear()} Crypto Icon Viewer. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
