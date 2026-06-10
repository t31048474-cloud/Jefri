# 📚 TB - INC | Полный указатель документации и кода

Добро пожаловать в документацию TB - INC - онлайн библиотеки с аутентификацией и реальными обложками из Open Library!

## 🚀 Быстрый старт

Новичок? Начните отсюда:
1. **[QUICK_START.md](./QUICK_START.md)** - Установка, запуск и базовое использование
2. **[README.md](./README.md)** - Обзор проекта и основные возможности

## 📖 Полная документация

### 1. 🔧 Технические детали

- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Как всё работает
  - Архитектура приложения
  - Описание компонентов
  - API маршруты
  - Структура данных
  - Безопасность
  - Оптимизация

### 2. 📚 Интеграция Open Library

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Полное руководство по обложкам
  - Как работает Open Library
  - Поиск ISBN
  - Обновление обложек
  - Обработка ошибок
  - Примеры ISBN
  - Оптимизация и кеширование

- **[ISBN_REFERENCE.md](./public/ISBN_REFERENCE.md)** - Справка по ISBN
  - Как найти ISBN
  - Текущие ISBN в приложении
  - Как обновить обложки

### 3. 🔌 API документация

- **[API_EXAMPLES.md](./API_EXAMPLES.md)** - Примеры для тестирования
  - Тестирование с curl
  - Примеры для Postman/Thunder Client
  - JavaScript/Fetch примеры
  - Полный цикл тестирования
  - Решение частых ошибок
  - Сценарии автоматизации

### 4. 🚀 Миграция на БД

- **[MIGRATION_TO_DATABASE.md](./MIGRATION_TO_DATABASE.md)** - Для production
  - Миграция на Neon (PostgreSQL)
  - Миграция на Supabase
  - Миграция на Vercel KV
  - Сравнение решений
  - Checklist миграции

## 📁 Структура проекта

```
/vercel/share/v0-project/
│
├── 📖 ДОКУМЕНТАЦИЯ
│   ├── README.md                     ← Начните отсюда
│   ├── QUICK_START.md               ← Установка и запуск
│   ├── IMPLEMENTATION.md            ← Как всё работает
│   ├── INTEGRATION_GUIDE.md          ← Open Library
│   ├── API_EXAMPLES.md              ← Примеры API
│   ├── MIGRATION_TO_DATABASE.md     ← На production
│   └── INDEX.md                     ← Этот файл
│
├── 🎨 КОМПОНЕНТЫ (app/)
│   ├── page.tsx                     ← Главная страница
│   ├── layout.tsx                   ← Root layout
│   └── globals.css                  ← Глобальные стили
│
├── 🔐 API МАРШРУТЫ (app/api/auth/)
│   ├── register/route.ts            ← POST регистрация
│   ├── login/route.ts               ← POST вход
│   └── session/route.ts             ← GET/POST сессия
│
├── 🧩 КОМПОНЕНТЫ (components/)
│   ├── library.tsx                  ← Главная библиотека
│   ├── book-card.tsx                ← Карточка книги
│   └── auth-modal.tsx               ← Модальное окно входа
│
├── 📚 УТИЛИТЫ (lib/)
│   ├── auth-store.ts                ← Zustand хранилище
│   ├── book-service.ts              ← Сервис Open Library
│   └── utils.ts                     ← Вспомогательные функции
│
├── 💾 ДАННЫЕ (data/)
│   └── users.json                   ← Хранилище пользователей
│
└── ⚙️ КОНФИГУРАЦИЯ
    ├── package.json                 ← Зависимости
    ├── tsconfig.json                ← TypeScript конфиг
    ├── tailwind.config.ts           ← Tailwind конфиг
    ├── next.config.mjs              ← Next.js конфиг
    └── components.json              ← Shadcn конфиг
```

## 🎯 По случаям использования

### "Я хочу запустить приложение"
→ Читайте [QUICK_START.md](./QUICK_START.md)

### "Я хочу понять как это работает"
→ Читайте [IMPLEMENTATION.md](./IMPLEMENTATION.md)

### "Я хочу заменить ISBN обложек"
→ Читайте [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

### "Я хочу тестировать API"
→ Читайте [API_EXAMPLES.md](./API_EXAMPLES.md)

### "Я готов к production"
→ Читайте [MIGRATION_TO_DATABASE.md](./MIGRATION_TO_DATABASE.md)

### "Я хочу понять безопасность"
→ Читайте раздел "Безопасность" в [IMPLEMENTATION.md](./IMPLEMENTATION.md)

### "У меня есть ошибка"
→ Читайте раздел "Решение проблем" в [QUICK_START.md](./QUICK_START.md)

## 🔑 Основные технологии

| Технология | Назначение |
|------------|-----------|
| **Next.js 16** | Фреймворк |
| **React 19** | UI компоненты |
| **Zustand** | Управление состоянием |
| **Tailwind CSS** | Стилизация |
| **bcryptjs** | Хеширование паролей |
| **axios** | HTTP запросы |
| **Lucide React** | Иконки |
| **Open Library API** | Обложки книг |

## ✨ Основные возможности

✅ **Модальное окно входа** - Вместо отдельной страницы  
✅ **Регистрация пользователей** - С хешированием паролей  
✅ **Аутентификация** - Email + пароль  
✅ **Сессии** - В HTTP-only cookies + localStorage  
✅ **Реальные обложки** - Из Open Library по ISBN  
✅ **Библиотека с книгами** - 32 книги в 4 разделах  
✅ **Интерактивный интерфейс** - Горизонтальная прокрутка  
✅ **Поиск** - Подготовлен для расширения  

## 🔄 Архитектура данных

```
Браузер (Client)
    ↓
└─→ Zustand Store (состояние пользователя)
    ↓
    ├─→ localStorage (восстановление сессии)
    └─→ HTTP cookies (безопасная сессия)
        ↓
        API Routes (/api/auth/*)
        ↓
        ├─→ Bcryptjs (хеширование паролей)
        ├─→ File System (data/users.json)
        └─→ Open Library API (обложки по ISBN)
```

## 🚀 Процесс запуска

1. **Установка**
   ```bash
   pnpm install
   ```

2. **Запуск dev сервера**
   ```bash
   pnpm dev
   ```

3. **Открыть в браузере**
   ```
   http://localhost:3000
   ```

4. **Регистрация / Вход**
   - Используйте модальное окно
   - Создайте новый аккаунт или войдите

5. **Просмотр библиотеки**
   - Скролльте горизонтально по разделам
   - Смотрите реальные обложки книг
   - Выходите кнопкой в верхнем углу

## 🧪 Тестирование

### Через браузер
- Откройте http://localhost:3000
- Используйте модальное окно для регистрации/входа
- Проверьте что все работает

### Через API
- Используйте примеры из [API_EXAMPLES.md](./API_EXAMPLES.md)
- Тестируйте с curl/Postman/Thunder Client
- Проверьте все endpoint'ы

### Проверка файла пользователей
```bash
cat data/users.json | jq .
```

## 🔐 Безопасность

✅ HTTP-only cookies (защита от XSS)  
✅ Bcryptjs (защита от перебора)  
✅ Валидация на сервере  
✅ Проверка email на уникальность  

⚠️ Для production нужна реальная БД!

## 📊 Статистика

- **Строк кода:** ~2000
- **Компонентов:** 5
- **API маршрутов:** 3
- **Книг:** 32
- **Разделов:** 4
- **Зависимостей:** 8

## 📞 Поддержка

### Если что-то не работает:
1. Проверьте [QUICK_START.md](./QUICK_START.md) раздел "Решение проблем"
2. Посмотрите console браузера (F12)
3. Проверьте что Dev сервер запущен (pnpm dev)

### Если хотите расширить:
1. Прочитайте [MIGRATION_TO_DATABASE.md](./MIGRATION_TO_DATABASE.md) для production
2. Посмотрите примеры API в [API_EXAMPLES.md](./API_EXAMPLES.md)
3. Измените ISBN в [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## 🎓 Обучающие материалы

Документация организована по уровню детализации:

1. **QUICK_START.md** - Самый простой уровень
2. **README.md** - Обзор функций
3. **IMPLEMENTATION.md** - Глубокое погружение
4. **INTEGRATION_GUIDE.md** - Специализированная информация
5. **API_EXAMPLES.md** - Практические примеры
6. **MIGRATION_TO_DATABASE.md** - Advanced уровень

## 📚 Дополнительные ресурсы

- [Open Library](https://openlibrary.org)
- [Next.js документация](https://nextjs.org/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)

## 🎉 Что дальше?

**Если вы новичок:**
1. Запустите проект ([QUICK_START.md](./QUICK_START.md))
2. Переходите по интерфейсу и используйте
3. Прочитайте [README.md](./README.md) для понимания

**Если вы разработчик:**
1. Изучите [IMPLEMENTATION.md](./IMPLEMENTATION.md)
2. Посмотрите код компонентов
3. Экспериментируйте с API ([API_EXAMPLES.md](./API_EXAMPLES.md))
4. Планируйте миграцию ([MIGRATION_TO_DATABASE.md](./MIGRATION_TO_DATABASE.md))

**Если вы готовы к production:**
1. Читайте [MIGRATION_TO_DATABASE.md](./MIGRATION_TO_DATABASE.md)
2. Выбирайте БД сервис (Neon/Supabase)
3. Мигрируйте код
4. Деплойте на Vercel

---

**Версия:** 1.0  
**Последнее обновление:** Июнь 2026  
**Статус:** ✅ Готово к использованию
