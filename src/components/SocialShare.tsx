'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Facebook, Share2 } from 'lucide-react'
import { generateSocialShareUrl } from '@/lib/utils'

interface SocialShareProps {
  url: string
  title: string
  layout?: 'horizontal' | 'vertical'
}

export const SocialShare = ({ url, title, layout = 'horizontal' }: SocialShareProps) => {
  const platforms = [
    { name: 'twitter', icon: Twitter, color: 'text-blue-400 hover:text-blue-500' },
    { name: 'linkedin', icon: Linkedin, color: 'text-blue-600 hover:text-blue-700' },
    { name: 'facebook', icon: Facebook, color: 'text-blue-500 hover:text-blue-600' },
  ] as const

  const containerClass = layout === 'horizontal' 
    ? 'flex items-center gap-3' 
    : 'flex flex-col gap-2'

  return (
    <div className={containerClass}>
      {platforms.map(({ name, icon: Icon, color }) => (
        <Link
          key={name}
          href={generateSocialShareUrl(name, url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background hover:bg-accent transition-colors ${color}`}
          aria-label={`Share on ${name}`}
        >
          <Icon className="h-4 w-4" />
          <span className="text-sm capitalize hidden md:inline">
            {name === 'twitter' ? 'Tweet' : name}
          </span>
        </Link>
      ))}

      <button
        onClick={() => {
          navigator.clipboard.writeText(url)
          alert('Link copied to clipboard!')
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background hover:bg-accent transition-colors"
        aria-label="Copy link"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  )
}