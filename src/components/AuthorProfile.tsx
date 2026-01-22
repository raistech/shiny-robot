import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Twitter, Linkedin, Github, Globe } from 'lucide-react'

interface AuthorProfileProps {
  email: string
}

export const AuthorProfile = async ({ email }: AuthorProfileProps) => {
  const author = await prisma.author.findUnique({
    where: { email },
  })

  const socialLinks = [
    { platform: 'twitter', icon: Twitter, baseUrl: 'https://twitter.com/' },
    { platform: 'linkedin', icon: Linkedin, baseUrl: 'https://linkedin.com/in/' },
    { platform: 'github', icon: Github, baseUrl: 'https://github.com/' },
    { platform: 'website', icon: Globe, baseUrl: '' },
  ]

  if (!author) {
    return (
      <div className="flex items-center gap-4 p-6 bg-secondary rounded-xl">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-2xl">👤</span>
        </div>
        <div>
          <h3 className="font-semibold">Unknown Author</h3>
          <p className="text-sm text-muted-foreground">Author information not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-secondary rounded-xl">
      {author.avatar ? (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-2xl sm:text-3xl">{author.name.charAt(0).toUpperCase()}</span>
        </div>
      )}
      
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold mb-2">{author.name}</h3>
        <p className="text-muted-foreground mb-4">{author.bio || 'No bio available'}</p>
        
        {(author.twitter || author.linkedin || author.github || author.website) && (
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            {socialLinks.map(({ platform, icon: Icon, baseUrl }) => {
              const url = author[platform as keyof typeof author]
              if (!url) return null
              
              return (
                <a
                  key={platform}
                  href={platform === 'website' ? url : `${baseUrl}${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background hover:bg-accent transition-colors"
                  aria-label={`${author.name} on ${platform}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}