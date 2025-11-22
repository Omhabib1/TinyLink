import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const link = await prisma.link.findUnique({
      where: { code: params.code },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Increment click count and update last clicked only for real navigations
    // (ignore Next.js/RSC prefetch or data requests which use different Accept headers)
    const accept = request.headers.get('accept') || ''
    const secFetchMode = request.headers.get('sec-fetch-mode') || ''

    const isNavigation = accept.includes('text/html') || secFetchMode === 'navigate'

    if (isNavigation) {
      await prisma.link.update({
        where: { code: params.code },
        data: {
          clicks: { increment: 1 },
          lastClickedAt: new Date(),
        },
      })
    }

    // Return 302 redirect
    return NextResponse.redirect(link.url, { status: 302 })
  } catch (error) {
    console.error('Error redirecting:', error)
    return NextResponse.json(
      { error: 'Redirect failed' },
      { status: 500 }
    )
  }
}
