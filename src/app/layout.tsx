import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modern Blog - Next.js 14 & Storyblok',
  description: 'Blog modern dengan Next.js 14, PostgreSQL, dan Storyblok CMS',
  keywords: ['blog', 'next.js', 'storyblok', 'postgreSQL', 'modern'],
  authors: [{ name: 'Modern Blog Team' }],
  openGraph: {
    title: 'Modern Blog',
    description: 'Blog modern dengan Next.js 14, PostgreSQL, dan Storyblok CMS',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Blog',
    description: 'Blog modern dengan Next.js 14, PostgreSQL, dan Storyblok CMS',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}