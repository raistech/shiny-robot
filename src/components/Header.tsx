'use client'

import Link from 'next/link'
import { Search, SearchIcon } from './Search'
import { ThemeToggle } from './ThemeToggle'
import { usePathname } from 'next/navigation'
import { Calendar, Tag, User } from 'lucide-react'

export const Header = () => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Modern Blog
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/categories' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Categories
            </Link>
            <Link
              href="/authors"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/authors' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Authors
            </Link>
            <Link
              href="/archive"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/archive' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Archive
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Search />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}