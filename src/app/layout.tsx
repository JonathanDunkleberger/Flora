import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bloom — Every Good Day Grows Your World",
  description: "Build positive habits and quit destructive ones. Watch your garden grow as you improve your life.",
  keywords: ["habit tracker", "quit smoking", "habit stacking", "self improvement", "garden"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4CAF50",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-cream-100 antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
