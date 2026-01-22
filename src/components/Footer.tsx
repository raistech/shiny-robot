import Link from 'next/link'
import { Calendar, Tag, User, Rss } from 'lucide-react'
import { NewsletterForm } from './NewsletterForm'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Modern Blog</h3>
            <p className="text-sm text-muted-foreground">
              Blog modern dengan teknologi terkini untuk pengalaman membaca terbaik.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {['Technology', 'Design', 'Business', 'Lifestyle'].map((category) => (
                <Link
                  key={category}
                  href={`/categories/${category.toLowerCase()}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  {category}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Archive</h3>
            <div className="space-y-2">
              {[{ label: '2024', count: 24 }, { label: '2023', count: 18 }].map((year) => (
                <Link
                  key={year.label}
                  href={`/archive/${year.label}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  {year.label} ({year.count})
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Dapatkan update artikel terbaru langsung ke email Anda.
            </p>
            <NewsletterForm />
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {currentYear} Modern Blog. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="/rss" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              <Rss className="h-4 w-4" />
              RSS Feed
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}