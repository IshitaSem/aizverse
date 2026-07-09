import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIZVerse — AI Stadium Intelligence",
  description: "AI-powered stadium intelligence platform for FIFA World Cup 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stadium-night font-body text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-floodlight focus:px-4 focus:py-2 focus:text-stadium-night"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
