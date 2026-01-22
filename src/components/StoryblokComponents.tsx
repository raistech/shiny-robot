'use client'

import { storyblokEditable } from '@storyblok/react'
import Image from 'next/image'
import Link from 'next/link'

// Rich Text Renderer for Storyblok content
export const RichTextRenderer = ({ content }: { content: any }) => {
  if (!content) return null

  const renderNode = (node: any, key: string) => {
    switch (node.type) {
      case 'paragraph':
        return <p key={key} className="mb-4 leading-relaxed">{node.content?.map((child: any, i: number) => renderNode(child, `${key}-${i}`))}</p>
      case 'heading':
        const HeadingTag = `h${node.attrs.level}` as keyof JSX.IntrinsicElements
        const sizeClasses = {
          1: 'text-4xl font-bold mb-6 mt-8',
          2: 'text-3xl font-bold mb-5 mt-7',
          3: 'text-2xl font-semibold mb-4 mt-6',
          4: 'text-xl font-semibold mb-3 mt-5',
          5: 'text-lg font-medium mb-2 mt-4',
          6: 'text-base font-medium mb-2 mt-3',
        } as const
        return <HeadingTag key={key} className={sizeClasses[node.attrs.level as keyof typeof sizeClasses]}>{node.content?.map((child: any, i: number) => renderNode(child, `${key}-${i}`))}</HeadingTag>
      case 'text':
        let text = <span key={key}>{node.text}</span>
        
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            if (mark.type === 'bold') {
              text = <strong key={key}>{text}</strong>
            } else if (mark.type === 'italic') {
              text = <em key={key}>{text}</em>
            } else if (mark.type === 'strike') {
              text = <s key={key}>{text}</s>
            } else if (mark.type === 'underline') {
              text = <u key={key}>{text}</u>
            } else if (mark.type === 'code') {
              text = <code key={key} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">{text}</code>
            }
          })
        }
        
        return text
      case 'image':
        return (
          <div key={key} className="my-6">
            <Image
              src={node.attrs.src}
              alt={node.attrs.alt || ''}
              width={800}
              height={400}
              className="rounded-lg w-full h-auto"
            />
          </div>
        )
      case 'code_block':
        return (
          <pre key={key} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
            <code>{node.content?.[0]?.text}</code>
          </pre>
        )
      case 'blockquote':
        return (
          <blockquote key={key} className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
            {node.content?.map((child: any, i: number) => renderNode(child, `${key}-${i}`))}
          </blockquote>
        )
      case 'ordered_list':
        return (
          <ol key={key} className="list-decimal pl-6 mb-4">
            {node.content?.map((child: any, i: number) => renderNode(child, `${key}-${i}`))}
          </ol>
        )
      case 'bullet_list':
        return (
          <ul key={key} className="list-disc pl-6 mb-4">
            {node.content?.map((child: any, i: number) => renderNode(child, `${key}-${i}`))}
          </ul>
        )
      case 'list_item':
        return <li key={key}>{node.content?.map((child: any, i: number) => renderNode(child, `${key}-${i}`))}</li>
      case 'link':
        return (
          <Link
            key={key}
            href={node.attrs.href}
            target={node.attrs.target || '_self'}
            rel={node.attrs.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="text-primary hover:underline"
          >
            {node.content?.map((child: any, i: number) => renderNode(child, `${key}-${i}`))}
          </Link>
        )
      default:
        return <div key={key} className="text-muted-foreground">Unknown node type: {node.type}</div>
    }
  }

  return <div className="prose dark:prose-invert max-w-none">{content?.map((node: any, i: number) => renderNode(node, `node-${i}`))}</div>
}

// Storyblok Component Wrapper
export const StoryblokComponent = ({ blok }: any) => {
  if (!blok) return null
  
  const { component } = blok
  
  switch (component) {
    case 'post':
      return <PostComponent blok={blok} />
    case 'author':
      return <AuthorComponent blok={blok} />
    default:
      return <div {...storyblokEditable(blok)}>Component not found: {component}</div>
  }
}

const PostComponent = ({ blok }: any) => {
  const { title, excerpt, content, image, author, category, published_at } = blok
  
  return (
    <article {...storyblokEditable(blok)}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{excerpt}</p>
        <div className="flex items-center gap-4 mt-4">
          {image && (
            <Image src={image.filename} alt={title} width={48} height={48} className="rounded-full" />
          )}
          <div>
            <p className="font-medium">{author?.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">{new Date(published_at).toLocaleDateString()}</p>
          </div>
        </div>
      </header>
      
      {content && <RichTextRenderer content={content} />}
    </article>
  )
}

const AuthorComponent = ({ blok }: any) => {
  const { name, bio, avatar, social_links } = blok
  
  return (
    <div {...storyblokEditable(blok)} className="flex items-center gap-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
      {avatar && (
        <Image src={avatar.filename} alt={name} width={80} height={80} className="rounded-full" />
      )}
      <div>
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300">{bio}</p>
      </div>
    </div>
  )
}