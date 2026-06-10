import { NextRequest, NextResponse } from 'next/server'
import { getBookData } from '@/lib/google-books-service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ isbn: string }> }
) {
  try {
    const { isbn } = await params

    if (!isbn || isbn.length < 10) {
      return NextResponse.json(
        { error: 'Invalid ISBN' },
        { status: 400 }
      )
    }

    const bookData = await getBookData(isbn)

    if (!bookData) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(bookData, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (error) {
    console.error('[v0] Book API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
