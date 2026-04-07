import type { Metadata, Viewport } from "next";

export const dynamic = 'force-dynamic'
import "./globals.css";

export const metadata: Metadata = {
  title: "Sousie",
  description: "A digital butler for your pantry.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sousie",
  },
};

export const viewport: Viewport = {
  themeColor: "#2d7a4f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
