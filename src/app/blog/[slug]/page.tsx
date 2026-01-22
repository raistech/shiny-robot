import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { calculateReadingTime, formatDate, generateSocialShareUrl } from '@/lib/utils'
import { AuthorProfile } from '@/components/AuthorProfile'
import { SocialShare } from '@/components/SocialShare'
import { RelatedArticles } from '@/components/RelatedArticles'
import { Comments } from '@/components/Comments'
import { RichTextRenderer } from '@/components/StoryblokComponents'
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { tags: { include: { tag: true } } },
  })

  if (!post || !post.published) {
    return {
      title: 'Post Not Found | Modern Blog',
      description: 'The requested blog post could not be found.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  return {
    title: `${post.title} | Modern Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      images: post.image ? [post.image] : [`${siteUrl}/og-image.png`],
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.authorEmail ? [post.authorEmail] : [],
      tags: post.tags.map((t) => t.tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.image ? [post.image] : [`${siteUrl}/og-image.png`],
    },
    keywords: post.tags.map((t) => t.tag.name).join(', '),
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  }
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  })

  if (!post || !post.published) {
    return null
  }

  return {
    ...post,
    readingTime: calculateReadingTime(post.content || ''),
    formattedDate: formatDate(post.publishedAt || post.createdAt),
  }
}

async function getRelatedPosts(postId: string, tags: string[]) {
  if (tags.length === 0) return []

  const related = await prisma.post.findMany({
    where: {
      id: { not: postId },
      published: true,
      tags: {
        some: {
          tag: {
            id: {
              in: tags,
            },
          },
        },
      },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  })

  return related.map((post) => ({
    ...post,
    readingTime: calculateReadingTime(post.content || ''),
    formattedDate: formatDate(post.publishedAt || post.createdAt),
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.tags.map((t) => t.tag.id)
  )

  // Increment view count in background
  try {
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })
  } catch (error) {
    console.error('Failed to increment view count:', error)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const pageUrl = `${siteUrl}/blog/${post.slug}`
  const pageTitle = post.title

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        {post.category && (
          <>
            <Link
              href={`/search?category=${post.category}`}
              className="hover:text-primary transition-colors"
            >
              {post.category}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-foreground font-medium">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime} min read
          </span>
          <span>{post.views} views</span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/search?tag=${tag.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
              >
                <Tag className="h-3 w-3" />
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Social Share */}
        <div className="pt-4 border-t">
          <SocialShare url={pageUrl} title={pageTitle} />
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 900px"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none mb-12">
        {post.content && (
          <RichTextRenderer content={JSON.parse(post.content)} />
        )}
      </div>

      {/* Author Profile */}
      {post.authorEmail && (
        <div className="mb-12">
          <AuthorProfile email={post.authorEmail} />
        </div>
      )}

      {/* Social Share (Bottom) */}
      <div className="mb-12 pt-8 border-t">
        <h3 className="text-lg font-semibold mb-4">Share This Article</h3>
        <SocialShare url={pageUrl} title={pageTitle} layout="vertical" />
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <RelatedArticles posts={relatedPosts} />
        </div>
      )}

      {/* Comments */}
      <section className="pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <Comments postId={post.id} title={post.title} url={pageUrl} />
      </section>
    </article>
  )
}