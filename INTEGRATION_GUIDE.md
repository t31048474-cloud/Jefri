# 📖 Руководство по интеграции Open Library

## Что такое Open Library?

**Open Library** - это открытое хранилище информации о книгах, которое предоставляет:
- ✅ Бесплатный API без аутентификации
- ✅ Обложки книг в разных размерах
- ✅ Информацию о книгах (название, автор, рейтинг)
- ✅ Поиск по ISBN, названию, автору

Веб-сайт: https://openlibrary.org

## Как это работает в приложении?

### 1. Загрузка обложек по ISBN

Каждая книга имеет поле `isbn`. При загрузке карточки книги, система создает URL для обложки:

```typescript
// Из book-card.tsx
const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`

<Image
  src={coverUrl}
  alt={title}
  fill
  className="object-cover"
/>
```

### 2. Формат URL для обложек

```
https://covers.openlibrary.org/b/isbn/{ISBN}-{SIZE}.jpg
```

**Размеры обложек:**
- `S` - маленькая (120px) - для списков
- `M` - средняя (300px) - **используется в приложении**
- `L` - большая (400px) - для детального просмотра

**Примеры:**
```
https://covers.openlibrary.org/b/isbn/0199232768-M.jpg  ← Война и мир
https://covers.openlibrary.org/b/isbn/0486415619-L.jpg  ← Преступление и наказание
```

### 3. Получение информации о книге

Используется сервис `lib/book-service.ts`:

```typescript
// Пример использования
import { getOpenLibraryCoverUrl, getBookFromISBN } from '@/lib/book-service'

// Получить URL обложки
const coverUrl = getOpenLibraryCoverUrl('0199232768')

// Получить полную информацию о книге
const bookData = await getBookFromISBN('0199232768')
// Результат:
// {
//   isbn: '0199232768',
//   title: 'War and Peace',
//   author: 'Leo Tolstoy',
//   coverUrl: 'https://covers.openlibrary.org/b/isbn/0199232768-M.jpg',
//   rating: 4.8
// }
```

## Поиск ISBN книги

### Метод 1: На веб-сайте Open Library

1. Откройте https://openlibrary.org
2. Используйте поиск вверху
3. Найдите нужную книгу
4. На странице книги посмотрите ISBN (обычно слева)
5. Скопируйте ISBN без дефисов

### Метод 2: Через API Open Library

```bash
# Поиск по названию
curl "https://openlibrary.org/search.json?title=War+and+Peace"

# Результат содержит ISBN в поле docs[0].isbn[0]
```

### Метод 3: Через Google Books API

1. Откройте https://www.google.com/books
2. Найдите книгу
3. На странице найдите "Мой найдены в книгах" → ISBN
4. Скопируйте 13-значный ISBN (без дефисов)

## Как заменить ISBN в приложении

### Шаг 1: Найти ISBN

Например, для книги "Война и мир":
- Перейдите на https://openlibrary.org
- Найдите "War and Peace" в поиске
- Откройте первый результат
- Найдите ISBN (обычно: 0199232768)

### Шаг 2: Обновить код

Откройте файл `components/library.tsx`:

```typescript
const BOOKS_DATA: Record<string, Book[]> = {
  'Романы': [
    {
      title: 'Война и мир',
      author: 'Лев Толстой',
      isbn: '0199232768',  // ← Старый ISBN
      rating: 4.8,
      genre: 'Романы'
    }
  ]
}
```

Замените на новый ISBN:

```typescript
const BOOKS_DATA: Record<string, Book[]> = {
  'Романы': [
    {
      title: 'Война и мир',
      author: 'Лев Толстой',
      isbn: '0671722271',  // ← Новый ISBN
      rating: 4.8,
      genre: 'Романы'
    }
  ]
}
```

### Шаг 3: Сохранить и обновить страницу

1. Сохраните файл (Ctrl+S)
2. Откройте приложение в браузере
3. Обложка обновится автоматически

## Различия между ISBN-10 и ISBN-13

Open Library поддерживает оба формата:

**ISBN-10:** 10 цифр
- Пример: 0199232768
- Старый формат, используется реже

**ISBN-13:** 13 цифр
- Пример: 978-0199232765 или 9780199232765
- Новый стандарт

Вы можете использовать оба в приложении - Open Library их автоматически преобразует.

## Обработка ошибок при загрузке обложек

### Проблема: Обложка не загружается

**Причина 1: Неправильный ISBN**
```
ISBN: 0199232768 ✅ Правильно
ISBN: 19923276   ❌ Слишком коротко
ISBN: 0199232768X ❌ Неправильный формат
```

**Причина 2: Книга есть, но нет обложки на Open Library**
- Решение: Используйте ISBN из другого издания
- Например, для "Войны и мира" есть несколько ISBN разных изданий

**Причина 3: Ошибка сети**
- Сервис Open Library может быть недоступен временно
- Приложение показывает заглушку с иконкой книги

### Fallback механизм в приложении

Если обложка не загружается, компонент `BookCard` показывает заглушку:

```typescript
// book-card.tsx
<Image
  src={coverUrl}
  alt={title}
  fill
  className="object-cover"
  onError={(e) => {
    const img = e.target as HTMLImageElement
    img.style.display = 'none'  // Скрывает изображение
  }}
/>
<div className="hidden bg-gradient-to-br from-gray-300 to-gray-400 flex-col items-center justify-center">
  <BookOpen className="mb-2" size={32} />
  <p className="text-xs font-semibold text-gray-700">{title}</p>
</div>
```

## Оптимизация и кеширование

### Текущее решение
Обложки загружаются с CDN Open Library напрямую:
```
https://covers.openlibrary.org/b/isbn/{ISBN}-M.jpg
```

### Для больших проектов

Кешируйте обложки на своем сервере:

```typescript
// Пример с Vercel Blob
import { put } from '@vercel/blob'

export async function cacheBookCover(isbn: string) {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
  const response = await fetch(url)
  const blob = await response.blob()
  
  const { url: cachedUrl } = await put(
    `covers/${isbn}.jpg`,
    blob,
    { access: 'public' }
  )
  
  return cachedUrl
}
```

## Интеграция с другими API

### Получение данных о книге

```typescript
// Полная информация о книге
const response = await fetch(
  'https://openlibrary.org/api/books?bibkeys=ISBN:0199232768&format=json&jscmd=data'
)

const data = await response.json()
// {
//   "ISBN:0199232768": {
//     "title": "War and Peace",
//     "authors": [{"name": "Leo Tolstoy"}],
//     "cover": {
//       "small": "...-S.jpg",
//       "medium": "...-M.jpg",
//       "large": "...-L.jpg"
//     },
//     "ratings": {"average": 4.8}
//   }
// }
```

### Поиск книг

```typescript
// Поиск по названию
const response = await fetch(
  'https://openlibrary.org/search.json?title=War%20and%20Peace&limit=10'
)

const { docs } = await response.json()
// Результат содержит до 10 книг с полной информацией
```

## Лимиты API

Open Library не имеет жестких лимитов, но рекомендует:
- ✅ Не более 100 запросов в секунду
- ✅ Указывать User-Agent в заголовках
- ✅ Кешировать результаты

## Примеры ISBN популярных книг

### Русская классика
- Война и мир: 0199232768, 9785171056063
- Преступление и наказание: 0486415619, 9785171056148
- Анна Каренина: 0199232946, 9785171057169
- Мастер и Маргарита: 0679735259, 9785171061005

### Английская классика
- 1984: 0451526341, 9780451526342
- Pride and Prejudice: 0141439513, 9780141439518
- The Great Gatsby: 0743273567, 9780743273565

### Современная фантастика
- Harry Potter: 0439708184, 9780439708180
- The Hobbit: 0547928216, 9780547928211
- Dune: 0441172717, 9780441172719

## Заключение

Open Library делает легким добавление реальных обложек книг в приложение без:
- 💰 Платежей и подписок
- 🔐 Сложной аутентификации
- ⚠️ Строгих ограничений по использованию

Просто используйте ISBN и получайте обложки!

## Полезные ссылки

- 🌐 [Open Library](https://openlibrary.org)
- 📚 [API документация](https://openlibrary.org/dev/docs/api)
- 📖 [Covers API](https://openlibrary.org/dev/docs/api/covers)
- 🔍 [Search API](https://openlibrary.org/dev/docs/api/search)
