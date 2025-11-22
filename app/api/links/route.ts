import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { validateUrl, generateCode, validateCode } from '@/app/lib/validators'

// GET /api/links - List all links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    )
  }
}

// POST /api/links - Create new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, code } = body

    // Validate URL
    if (!url || !validateUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Generate or validate code
    let shortCode = code
    if (shortCode) {
      // Validate custom code format
      if (!validateCode(shortCode)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        )
      }

      // Check if code already exists
      const existing = await prisma.link.findUnique({
        where: { code: shortCode },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        )
      }
    } else {
      // Generate unique code
      let attempts = 0
      const maxAttempts = 10

      while (attempts < maxAttempts) {
        shortCode = generateCode()
        const existing = await prisma.link.findUnique({
          where: { code: shortCode },
        })

        if (!existing) break
        attempts++
      }

      if (attempts === maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        )
      }
    }

    // Create link
    const link = await prisma.link.create({
      data: {
        code: shortCode,
        url: url,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    )
  }
}
