import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import Image from "next/image";
import { Header } from "@/components/header";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bolhadev.chat',
  description: 'A free way to Brazilians developers improve your english skills',
  metadataBase: new URL('https://bolhadev.chat'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="dark relative flex h-screen flex-col ">
        <Header />
        <Image
          src="/light-ray.svg"
          alt="Purple light ray"
          width="1000"
          height="800"
          className="animate-in fade-in slide-in-from-bottom-1 absolute -z-10 size-full"
          style={{ color: "transparent", animationDuration: "10s" }}
        />
        <main className="h-full">{children}</main>
      </body>
      <GoogleAnalytics gaId="G-STY9BKWKT4" />
    </html>
  );
}
