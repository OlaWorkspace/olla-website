import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/common/ConditionalLayout";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Olla — La fidélité sans carte",
  description:
    "Un seul système pour tous vos commerces : NFC, QR, avis Google et récompenses.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.ollafidelite.com"),
  openGraph: {
    title: "Olla — La fidélité sans carte",
    description:
      "Un seul système pour tous vos commerces : NFC, QR, avis Google et récompenses.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://www.ollafidelite.com",
    siteName: "Olla",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/logo-fond-bleu.png",
        width: 1200,
        height: 630,
        alt: "Olla - La fidélité sans carte",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Olla — La fidélité sans carte",
    description: "Un seul système pour tous vos commerces : NFC, QR, avis Google et récompenses.",
    images: ["/logo-fond-bleu.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-white text-text antialiased">
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);
          `
        }} />
      </body>
    </html>
  );
}
