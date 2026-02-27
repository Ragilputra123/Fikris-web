import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import { getServerSession } from "next-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fikris - Sistem Informasi Remaja Masjid Sabilul Huda",
  description: "Kelola kegiatan, keuangan, dan keanggotaan remaja masjid dengan mudah dan modern.",
  keywords: ["Fikris", "Remaja Masjid", "Sabilul Huda", "Manajemen Masjid", "Islam"],
  authors: [{ name: "Fikris Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Fikris - Sistem Informasi Remaja Masjid",
    description: "Kelola kegiatan, keuangan, dan keanggotaan remaja masjid dengan mudah dan modern.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
