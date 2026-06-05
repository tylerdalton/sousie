import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";

export const dynamic = 'force-dynamic'
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
