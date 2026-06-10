interface GoogleBooksVolume {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    pageCount?: number
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    infoLink?: string
    previewLink?: string
    canonicalVolumeLink?: string
  }
}

interface BookData {
  title: string
  author: string
  description: string
  pageCount: number
  previewUrl: string | null
  imageUrl: string | null
}

export async function getBookData(isbn: string): Promise<BookData | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )

    if (!response.ok) {
      console.error('[v0] Google Books API error:', response.status)
      return null
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      console.error('[v0] No book found for ISBN:', isbn)
      return null
    }

    const volume: GoogleBooksVolume = data.items[0]
    const volumeInfo = volume.volumeInfo

    return {
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors?.[0] || 'Unknown Author',
      description: volumeInfo.description || 'No description available',
      pageCount: volumeInfo.pageCount || 0,
      previewUrl: volumeInfo.previewLink || null,
      imageUrl: volumeInfo.imageLinks?.thumbnail || null,
    }
  } catch (error) {
    console.error('[v0] Error fetching book data:', error)
    return null
  }
}

export async function getBookPreview(isbn: string): Promise<string | null> {
  try {
    const bookData = await getBookData(isbn)
    if (!bookData || !bookData.previewUrl) {
      return null
    }
    return bookData.previewUrl
  } catch (error) {
    console.error('[v0] Error getting book preview:', error)
    return null
  }
}
