'use client' 

import { DiscussionEmbed } from 'disqus-react'
import { useTheme } from 'next-themes'

interface CommentsProps { 
  postId: string 
  title: string 
  url: string } 

export const Comments = ({ postId, title, url }: CommentsProps) => {
  const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME

  if (!shortname) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Comments are disabled. Configure Disqus in environment variables.
      </div>
    )
  }

  return (
    <div className="mt-8">
      <DiscussionEmbed
        shortname={shortname}
        config={{
          url,
          identifier: postId,
          title,
        }}
      />
    </div>
  )
}