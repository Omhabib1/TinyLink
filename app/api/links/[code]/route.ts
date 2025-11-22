import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/links/:code - Get specific link
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

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error fetching link:', error)
    return NextResponse.json(
      { error: 'Failed to fetch link' },
      { status: 500 }
    )
  }
}

// DELETE /api/links/:code - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await prisma.link.delete({
      where: { code: params.code },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    console.error('Error deleting link:', error)
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    )
  }
}
