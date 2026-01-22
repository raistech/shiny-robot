import Link from 'next/link'
import Image from 'next/image'
import { Clock, User, Calendar } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt?: string | null
    image?: string | null
    authorEmail?: string | null
    authorName?: string | null
    readingTime: number
    formattedDate: string
    tags?: Array<{
      tag: {
        id: string
        name: string
        slug: string
      }
    }>
  }
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <article className="group border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-card">
      {post.image && (
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.formattedDate}
          </span>
        </div>
        
        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {post.authorName || post.authorEmail?.split('@')[0] || 'Anonymous'}
            </span>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.slice(0, 2).map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/search?tag=${tag.slug}`}
                  className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}