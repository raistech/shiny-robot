import Link from 'next/link'
import Image from 'next/image'
import { calculateReadingTime, formatDate } from '@/lib/utils'

interface RelatedArticlesProps {
  posts: Array<{
    id: string
    slug: string
    title: string
    excerpt?: string | null
    image?: string | null
    content: string
    publishedAt?: Date | null
    createdAt: Date
  }>
}

export const RelatedArticles = ({ posts }: RelatedArticlesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article key={post.id} className="group bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all">
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="relative h-48 overflow-hidden">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-3xl">📖</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <span>•</span>
                <span>{calculateReadingTime(post.content)} min read</span>
              </div>
            </div>
          </Link>
        </article>
      ))}
      {posts.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground py-8">
          No related articles found.
        </div>
      )}
    </div>
  )
}