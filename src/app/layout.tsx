import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'

import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import NetworkHealthBanner from '@/components/layouts/NetworkHealthBanner'
import { cn } from '@/lib/utils'

import WagmiProviderWrapper from '../components/WagmiProviderWrapper'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Story Staking Dashboard',
  description: 'Story Staking Dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, archivo.variable, inter.variable)}>
        <WagmiProviderWrapper>
          <div className="flex min-h-screen w-full flex-col">
            <header className="border-b border-white/20 px-8 py-4">
              <Header />
            </header>
            <main className="mx-auto mb-8 w-full flex-1 flex-col px-8 lg:px-16">
              {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
              <div className="my-8">
                <NetworkHealthBanner />
              </div>
              {children}
            </main>
            <Footer />
          </div>
        </WagmiProviderWrapper>
      </body>
      <GoogleAnalytics gaId="G-PXEQZ642TY" />
    </html>
  )
}
