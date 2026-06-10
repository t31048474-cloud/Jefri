import type { Metadata } from 'next'
import { BookReader } from '@/components/book-reader'
import { BOOKS_DATA } from '@/lib/books-data'

interface PageProps {
  params: { isbn: string }
}

// Generate metadata for the book page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { isbn } = await params
  
  // Find book in BOOKS_DATA
  let bookTitle = 'Книга'
  let bookAuthor = 'Неизвестный автор'
  
  for (const genre in BOOKS_DATA) {
    const book = BOOKS_DATA[genre].find((b) => b.isbn === isbn)
    if (book) {
      bookTitle = book.title
      bookAuthor = book.author
      break
    }
  }

  return {
    title: `${bookTitle} - TB - INC`,
    description: `Читайте "${bookTitle}" автора ${bookAuthor} на TB - INC онлайн библиотеке`,
  }
}

export default async function BookPage({ params }: PageProps) {
  const { isbn } = await params

  // Find book info
  let bookTitle = 'Неизвестная книга'
  let bookAuthor = 'Неизвестный автор'

  for (const genre in BOOKS_DATA) {
    const book = BOOKS_DATA[genre].find((b) => b.isbn === isbn)
    if (book) {
      bookTitle = book.title
      bookAuthor = book.author
      break
    }
  }

  return <BookReader isbn={isbn} title={bookTitle} author={bookAuthor} />
}
