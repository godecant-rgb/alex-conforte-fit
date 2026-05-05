import type { Metadata, Viewport } from "next";
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
  title: {
    default: "Alex Conforte Personal Trainer",
    template: "%s | Alex Conforte",
  },
  description:
    "Entrenamiento funcional, crosstraining y personalizado en Sauce, Canelones. Reservá tu clase online con Alex Conforte Personal Trainer.",
  keywords: [
    "Alex Conforte",
    "personal trainer",
    "entrenamiento funcional",
    "crosstraining",
    "gimnasio",
    "Sauce",
    "Canelones",
    "reservas online",
  ],
  authors: [{ name: "Alex Conforte Personal Trainer" }],
  creator: "Alex Conforte Personal Trainer",
  publisher: "Alex Conforte Personal Trainer",
  applicationName: "Alex Conforte Fit",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Alex Fit",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: false,
  },
  openGraph: {
    title: "Alex Conforte Personal Trainer",
    description:
      "Funcional, crosstraining y entrenamiento personalizado en Sauce, Canelones. Reservá tu clase online.",
    type: "website",
    locale: "es_UY",
    siteName: "Alex Conforte Personal Trainer",
  },
  icons: {
    icon: "/logo-alex.png",
    shortcut: "/logo-alex.png",
    apple: "/logo-alex.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  colorScheme: "dark",
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
    <html
      lang="es-UY"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">{children}</body>
    </html>
  );
}
