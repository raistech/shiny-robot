import { apiPlugin, storyblokInit } from '@storyblok/react'

const token = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN

if (!token) {
  console.warn('Storyblok access token not found in environment variables')
}

storyblokInit({
  accessToken: token || '',
  use: [apiPlugin],
})

export { storyblokInit }