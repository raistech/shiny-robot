import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { FeaturedPosts } from '@/components/FeaturedPosts'
import { prisma } from '@/lib/db'
import { calculateReadingTime, formatDate } from '@/lib/utils'
import { NewsletterForm } from '@/components/NewsletterForm'

export const revalidate = 60 // Revalidate every minute

export const metadata: Metadata = {
  title: 'Home | Modern Blog - Next.js 14 & Storyblok',
  description: 'Blog modern dengan artikel terbaru tentang teknologi, desain, dan gaya hidup modern',
}

async function getLatestPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 10,
      include: {
        tags: {
          include: { tag: true },
        },
      },
    })
    
    return posts.map((post) => ({
      ...post,
      readingTime: post.readTime || calculateReadingTime(post.content || ''),
      formattedDate: formatDate(post.publishedAt || post.createdAt),
    }))
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }
}

async function getFeaturedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true, featured: true },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      include: {
        tags: {
          include: { tag: true },
        },
      },
    })
    
    return posts.map((post) => ({
      ...post,
      readingTime: post.readTime || calculateReadingTime(post.content || ''),
      formattedDate: formatDate(post.publishedAt || post.createdAt),
    }))
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export default async function HomePage() {
  const [latestPosts, featuredPosts] = await Promise.all([
    getLatestPosts(),
    getFeaturedPosts(),
  ])

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Welcome to Modern
          <span className="block">Blog Platform</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Temukan artikel terbaik tentang teknologi, desain, dan gaya hidup modern
          dari para penulis terbaik di seluruh dunia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/archive"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Explore Articles
          </Link>
          <Link
            href="/categories"
            className="px-6 py-3 border border-input bg-background rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
          >
            Browse Categories
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Articles</h2>
            <Link
              href="/archive?filter=featured"
              className="text-primary hover:underline text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <FeaturedPosts posts={featuredPosts} />
        </section>
      )}

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Articles</h2>
          <Link
            href="/archive"
            className="text-primary hover:underline text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        
        <Suspense fallback={<div className="text-center py-8">Loading posts...</div>}>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found. Check back later!</p>
            </div>
          )}
        </Suspense>
      </section>

      {/* Newsletter CTA */}
      <section className="mt-12 md:mt-16 bg-secondary/50 rounded-2xl p-8 md:p-12 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Stay Updated</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Dapatkan artikel terbaru dan insights langsung ke inbox Anda setiap minggunya.
        </p>
        <div className="max-w-md mx-auto">
          <NewsletterForm />
        </div>
      </section>
    </main>
  )
}