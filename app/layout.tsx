import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/common/ConditionalLayout";

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
    icon: [
      {
        url: "/logo-fond-bleu.png",
        type: "image/png",
      }
    ],
    apple: [
      {
        url: "/logo-fond-bleu.png",
        type: "image/png",
      }
    ],
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
        <ConditionalLayout>{children}</ConditionalLayout>
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
