# 🚀 Миграция на реальную БД

Это руководство описывает как заменить JSON хранилище на настоящую базу данных.

## 📌 Текущее решение (JSON)

```
Пользователи сохраняются в → data/users.json
```

**Проблемы:**
- ❌ Не масштабируется для больших объемов
- ❌ Одновременные операции могут повредить файл
- ❌ Нет гарантии ACID
- ❌ Медленно для поиска

**Когда подходит:**
- ✅ Небольшой прототип
- ✅ Локальное тестирование
- ✅ Менее 100 пользователей

## 🔄 Миграция на Neon (PostgreSQL)

Neon - рекомендуемый выбор для Next.js приложений.

### Шаг 1: Создать аккаунт Neon

1. Откройте https://neon.tech
2. Нажмите "Sign Up"
3. Используйте GitHub для входа
4. Создайте новый проект

### Шаг 2: Получить connection string

1. В Neon dashboard найдите "Connection string"
2. Выберите "psycopg2" или "prisma"
3. Скопируйте строку подключения

### Шаг 3: Установить зависимости

```bash
pnpm add pg @neondatabase/serverless drizzle-orm drizzle-kit
```

### Шаг 4: Создать схему БД

Файл: `lib/db.ts`

```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export default db
```

### Шаг 5: Обновить API маршруты

#### Регистрация (POST /api/auth/register)

```typescript
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Валидация
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Проверка существующего пользователя
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создание пользователя
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id, name: users.name, email: users.email })

    // Установка cookie
    const response = NextResponse.json(newUser, { status: 201 })
    response.cookies.set('session', JSON.stringify(newUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

#### Вход (POST /api/auth/login)

```typescript
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Поиск пользователя
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Установка cookie
    const response = NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      { status: 200 }
    )

    response.cookies.set('session', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Шаг 6: Добавить environment variable

Файл: `.env.local`

```
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-1.neon.tech/dbname"
```

### Шаг 7: Протестировать

```bash
pnpm dev
```

## 🔄 Миграция на Supabase

### Шаг 1: Создать проект Supabase

1. Откройте https://supabase.com
2. Нажмите "Sign In"
3. Создайте новый проект
4. Выберите PostgreSQL

### Шаг 2: Получить credentials

1. В Project Settings найдите "API Keys"
2. Скопируйте `anon` ключ и `service_role` ключ
3. Скопируйте Database URL

### Шаг 3: Установить зависимости

```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs pg
```

### Шаг 4: Создать таблицу в Supabase

В SQL editor выполните:

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создать индекс для быстрого поиска по email
CREATE INDEX users_email_idx ON users(email);
```

### Шаг 5: Обновить код

```typescript
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Регистрация
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    const response = NextResponse.json(
      {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
      },
      { status: 201 }
    )

    response.cookies.set('session', JSON.stringify({
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Шаг 6: Добавить env variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 🚀 Миграция на Vercel KV (Redis)

**Когда использовать:** Для сессий, кеширования, очередей

**НЕ рекомендуется для:** Постоянного хранения пользовательских данных

### Шаг 1: Создать Vercel KV

1. В Vercel dashboard нажмите "Storage"
2. Выберите "KV"
3. Создайте новое хранилище

### Шаг 2: Установить зависимости

```bash
pnpm add @vercel/kv
```

### Шаг 3: Использовать для сессий

```typescript
import { kv } from '@vercel/kv'

// Сохранить сессию в Redis (вместо cookies)
await kv.set(
  `session:${sessionId}`,
  JSON.stringify(user),
  { ex: 60 * 60 * 24 * 7 } // 7 дней
)

// Получить сессию
const session = await kv.get(`session:${sessionId}`)
```

⚠️ **Важно:** Redis выгружает данные, поэтому используйте с основной БД!

## 📊 Сравнение решений

| Критерий | JSON | Neon | Supabase | Vercel KV |
|----------|------|------|----------|-----------|
| Масштабируемость | ❌ | ✅ | ✅ | ✅ |
| Надежность | ❌ | ✅ | ✅ | ⚠️ |
| Цена | ✅ | ✅ | ✅ | ⚠️ |
| Простота | ✅ | ⚠️ | ✅ | ✅ |
| Полнотекстовый поиск | ❌ | ✅ | ✅ | ❌ |
| Persistence | ❌ | ✅ | ✅ | ❌ |

## 🎯 Рекомендуемый стек

**Для разработки (текущее):**
- JSON файл для прототипирования

**Для production:**
- **Neon** + **Drizzle ORM** для основной БД
- **Vercel KV** для сессий и кеширования
- **Vercel Blob** для изображений обложек

## ⚙️ Миграция данных

Если у вас уже есть пользователи в JSON, скопируйте их в БД:

```typescript
import { readFileSync } from 'fs'
import path from 'path'
import { db, users } from '@/lib/db'

async function migrateUsers() {
  const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
  const usersData = JSON.parse(readFileSync(usersFilePath, 'utf-8'))

  for (const user of usersData) {
    await db.insert(users).values(user)
  }

  console.log(`Migrated ${usersData.length} users`)
}

migrateUsers()
```

Запустить: `node scripts/migrate.ts`

## 🔒 Безопасность при миграции

1. **Backup перед началом**
   ```bash
   cp data/users.json data/users.backup.json
   ```

2. **Протестировать на dev
   - Используйте dev БД для тестирования
   - Убедитесь что все работает

3. **Постепенная миграция**
   - Сначала новые пользователи в БД
   - Потом мигрируйте старых пользователей

4. **Проверить данные**
   - Убедитесь что все пользователи скопировались
   - Проверьте что пароли хешированы

## ✅ Checklist миграции

- [ ] Создан аккаунт в БД сервисе (Neon/Supabase)
- [ ] Получены credentials (URL, keys, passwords)
- [ ] Установлены новые зависимости
- [ ] Создана схема БД (таблица users)
- [ ] Обновлены API маршруты
- [ ] Добавлены environment variables
- [ ] Протестирована регистрация
- [ ] Протестирован вход
- [ ] Протестирована сессия
- [ ] Скопированы старые данные (если есть)
- [ ] Удален файл data/users.json после миграции
- [ ] Обновлены .gitignore

## 📚 Дополнительные ресурсы

- [Neon Docs](https://neon.tech/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)

## 🎯 Заключение

Миграция на настоящую БД требует:
1. Выбрать БД сервис
2. Создать таблицу users
3. Обновить код в API маршрутах
4. Добавить environment variables
5. Протестировать

Все современные решения (Neon, Supabase) имеют бесплатный tier достаточный для начала.
