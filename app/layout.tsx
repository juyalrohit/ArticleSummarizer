import type { Metadata } from "next";
import "./globals.css";
import { ArticulaProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Articula — Write, Search & Summarize with AI",
  description: "The modern platform for writing, discovering, and summarizing articles powered by AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <ArticulaProvider>
          {children}
        </ArticulaProvider>
      </body>
    </html>
  );
}
