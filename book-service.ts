import axios from 'axios'

export interface BookData {
  title: string
  author: string
  isbn: string
  rating: number
  coverUrl: string
  genre: string
}

const OPEN_LIBRARY_API = 'https://openlibrary.org/api'

/**
 * Get cover URL for a book by ISBN from Open Library
 */
export function getOpenLibraryCoverUrl(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
}

/**
 * Get book info from Open Library by ISBN
 */
export async function getBookFromISBN(isbn: string): Promise<Partial<BookData>> {
  try {
    const response = await axios.get(
      `${OPEN_LIBRARY_API}/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    )

    const key = `ISBN:${isbn}`
    if (!response.data[key]) {
      return {
        isbn,
        coverUrl: getOpenLibraryCoverUrl(isbn),
      }
    }

    const bookData = response.data[key]
    return {
      isbn,
      title: bookData.title || '',
      author: bookData.authors?.[0]?.name || 'Unknown',
      coverUrl: getOpenLibraryCoverUrl(isbn),
      rating: bookData.ratings?.average ?? 0,
    }
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn}:`, error)
    return {
      isbn,
      coverUrl: getOpenLibraryCoverUrl(isbn),
    }
  }
}

/**
 * Get multiple books info by ISBN list
 */
export async function getBooksFromISBNList(
  isbns: string[]
): Promise<Partial<BookData>[]> {
  try {
    const bibkeys = isbns.map((isbn) => `ISBN:${isbn}`).join(',')
    const response = await axios.get(
      `${OPEN_LIBRARY_API}/books?bibkeys=${bibkeys}&format=json&jscmd=data`
    )

    return isbns.map((isbn) => {
      const key = `ISBN:${isbn}`
      const bookData = response.data[key]

      if (!bookData) {
        return {
          isbn,
          coverUrl: getOpenLibraryCoverUrl(isbn),
        }
      }

      return {
        isbn,
        title: bookData.title || '',
        author: bookData.authors?.[0]?.name || 'Unknown',
        coverUrl: getOpenLibraryCoverUrl(isbn),
        rating: bookData.ratings?.average ?? 0,
      }
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    return isbns.map((isbn) => ({
      isbn,
      coverUrl: getOpenLibraryCoverUrl(isbn),
    }))
  }
}
