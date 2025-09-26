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
  description: "A simple Next.js application to view crypto icons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-gray-800 dark:bg-gray-950 text-white p-4 text-center shadow-md">
          <h1 className="text-2xl font-bold">Crypto Icons Viewer</h1>
        </header>
        {children}
        <footer className="bg-gray-800 dark:bg-gray-950 text-white p-4 text-center mt-8 shadow-inner">
          <p>© {new Date().getFullYear()} Crypto Icons Viewer. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
