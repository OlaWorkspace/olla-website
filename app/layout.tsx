import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Olla — La fidélité sans carte",
  description:
    "Un seul système pour tous vos commerces : NFC, QR, avis Google et récompenses.",
  openGraph: {
    title: "Olla — La fidélité sans carte",
    description:
      "Un seul système pour tous vos commerces : NFC, QR, avis Google et récompenses.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://olla.app",
    siteName: "Olla",
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-white text-text antialiased">{children}</body>
    </html>
  );
}
