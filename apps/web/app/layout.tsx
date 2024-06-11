import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import Link from 'next/link'
import { Header } from '@/components/header'
import { GoogleAnalytics } from '@next/third-parties/google'
import GithubCorner from './components/github-corner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bolhadev.chat',
  description: 'Free English Language Development for Coders',
  metadataBase: new URL('https://bolhadev.chat'),
}

const IBMPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en" className={IBMPlexSans.className}>
      <body className="dark relative flex h-auto flex-col ">
        <Header />
        <Link
          href="https://github.com/brunocroh/bolhadev.chat"
          target="_blank"
          className="absolute right-0 top-0"
        >
          <GithubCorner />
        </Link>
        {children}
      </body>
      <GoogleAnalytics gaId="G-STY9BKWKT4" />
    </html>
  )
}
