import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      )
    }

    // Create subscription
    const subscription = await prisma.newsletter.create({
      data: { email, name },
    })

    return NextResponse.json(
      { message: 'Successfully subscribed', data: subscription },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}