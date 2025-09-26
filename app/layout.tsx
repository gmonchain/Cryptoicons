import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Configure Geist Sans font with Latin subset
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font with Latin subset
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the application, used by Next.js for SEO and browser tab info
export const metadata: Metadata = {
  title: "Crypto Icons Viewer",
  description: "A simple Next.js application to view crypto icons.",
};

// Root layout component for the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // React node representing the page content
}>) {
  return (
    <html lang="en"> {/* Set document language to English */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Apply font variables and antialiasing
      >
        {/* Header section with site title */}
        <header className="bg-gray-800 dark:bg-gray-950 text-white p-4 text-center shadow-md">
          <h1 className="text-2xl font-bold">Crypto Icons Viewer</h1>
        </header>
        
        {/* Main content area where pages will be rendered */}
        <main>
          {children}
        </main>
        
        {/* Footer section with copyright information */}
        <footer className="bg-gray-800 dark:bg-gray-950 text-white p-4 text-center mt-8 shadow-inner">
          <p>© {new Date().getFullYear()} Crypto Icons Viewer. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
