import type { Metadata } from 'next'
import Image from 'next/image'
import { GeistSans } from 'geist/font/sans'
import { Header } from '@/components/header'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bolhadev.chat',
  description: 'Free English Language Development for Coders',
  metadataBase: new URL('https://bolhadev.chat'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="dark relative flex h-auto flex-col ">
        <Header />
        <Image
          src="/light-ray.svg"
          alt="Purple light ray"
          width="1000"
          height="800"
          className="absolute -z-10 size-full animate-in fade-in slide-in-from-bottom-1"
          style={{ color: 'transparent', animationDuration: '10s' }}
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-STY9BKWKT4" />
    </html>
  )
}
