# 🔌 API примеры

## 📝 Как тестировать API

Используйте **curl**, **Postman**, или **Thunder Client** VS Code расширение.

## 🔐 Регистрация

### POST /api/auth/register

Создать нового пользователя.

**Curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "password": "SecurePassword123"
  }'
```

**Thunder Client (VS Code):**
```
POST http://localhost:3000/api/auth/register

Headers:
Content-Type: application/json

Body:
{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "SecurePassword123"
}
```

**JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Иван Петров',
    email: 'ivan@example.com',
    password: 'SecurePassword123',
  }),
})

const user = await response.json()
console.log(user)
// {
//   id: "abc123xyz",
//   name: "Иван Петров",
//   email: "ivan@example.com"
// }
```

**Успешный ответ (201):**
```json
{
  "id": "abc123xyz",
  "name": "Иван Петров",
  "email": "ivan@example.com"
}
```

**Ошибки:**

Missing fields (400):
```json
{
  "error": "Missing required fields"
}
```

Short password (400):
```json
{
  "error": "Password must be at least 6 characters"
}
```

User exists (400):
```json
{
  "error": "User already exists"
}
```

---

## 🔑 Вход

### POST /api/auth/login

Вход с email и пароль.

**Curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "SecurePassword123"
  }'
```

**JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'ivan@example.com',
    password: 'SecurePassword123',
  }),
})

const user = await response.json()
console.log(user)
// {
//   id: "abc123xyz",
//   name: "Иван Петров",
//   email: "ivan@example.com"
// }
```

**Успешный ответ (200):**
```json
{
  "id": "abc123xyz",
  "name": "Иван Петров",
  "email": "ivan@example.com"
}
```

**Ошибки:**

Invalid credentials (401):
```json
{
  "error": "Invalid credentials"
}
```

---

## 📋 Проверка сессии

### GET /api/auth/session

Получить информацию о текущей сессии.

**Curl (с cookies):**
```bash
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: session=..." \
  -b cookies.txt
```

**JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/session', {
  method: 'GET',
  credentials: 'include', // Отправить cookies
})

const user = await response.json()
console.log(user)
// {
//   id: "abc123xyz",
//   name: "Иван Петров",
//   email: "ivan@example.com"
// }
```

**Успешный ответ (200):**
```json
{
  "id": "abc123xyz",
  "name": "Иван Петров",
  "email": "ivan@example.com"
}
```

**Нет сессии (401):**
```json
{
  "error": "No session"
}
```

---

## 🚪 Выход

### POST /api/auth/session

Выход из аккаунта (удалить сессию).

**Curl:**
```bash
curl -X POST http://localhost:3000/api/auth/session
```

**JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/session', {
  method: 'POST',
  credentials: 'include',
})

const result = await response.json()
console.log(result)
// { success: true }
```

**Успешный ответ (200):**
```json
{
  "success": true
}
```

---

## 🧪 Полный цикл тестирования

### 1. Регистрация

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### 2. Проверка сессии

```bash
curl -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt
```

### 3. Выход

```bash
curl -X POST http://localhost:3000/api/auth/session \
  -b cookies.txt
```

### 4. Проверка что сессия удалена

```bash
curl -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt
# Должно вернуть 401
```

---

## 📊 Примеры для разных программ

### Postman Collection

```json
{
  "info": {
    "name": "TB - INC API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Test User\", \"email\": \"test@example.com\", \"password\": \"Password123\"}"
        },
        "url": {
          "raw": "http://localhost:3000/api/auth/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "register"]
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"test@example.com\", \"password\": \"Password123\"}"
        },
        "url": {
          "raw": "http://localhost:3000/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Check Session",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/api/auth/session",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "session"]
        }
      }
    },
    {
      "name": "Logout",
      "request": {
        "method": "POST",
        "url": {
          "raw": "http://localhost:3000/api/auth/session",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "session"]
        }
      }
    }
  ]
}
```

Импортируйте этот JSON в Postman (Ctrl+O → Paste Raw Text).

### Thunder Client Extension

Сохраните как `.http` файл:

```http
### Register
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPassword123"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123"
}

### Check Session
GET http://localhost:3000/api/auth/session

### Logout
POST http://localhost:3000/api/auth/session
```

---

## 🔍 Отладка

### Смотреть cookies в браузере

1. Откройте DevTools (F12)
2. Application → Cookies → http://localhost:3000
3. Найдите cookie с именем "session"

### Смотреть headers ответа

```bash
curl -X GET http://localhost:3000/api/auth/session \
  -v  # Verbose mode показывает headers
```

### Читать данные пользователя

```bash
curl -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt | jq .
# jq красиво выводит JSON
```

### Смотреть users.json

```bash
cat data/users.json | jq .
```

---

## 🚨 Частые ошибки

### Ошибка: "Missing required fields"

**Проблема:** Забыли отправить какое-то поле
```json
{
  "name": "User"
  // Забыли email и password
}
```

**Решение:** Отправите все поля
```json
{
  "name": "User",
  "email": "user@example.com",
  "password": "Password123"
}
```

### Ошибка: "Invalid credentials"

**Проблема:** Неверный пароль или email не существует
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email": "wrong@example.com", "password": "WrongPassword"}'
```

**Решение:** Проверьте email и пароль
```bash
# Сначала зарегистрируйте пользователя
curl -X POST http://localhost:3000/api/auth/register \
  -d '{"name": "Test", "email": "test@example.com", "password": "Password123"}'

# Потом используйте те же credentials для входа
```

### Ошибка: "User already exists"

**Проблема:** Пытаетесь зарегистрировать пользователя с существующим email
```json
{
  "email": "ivan@example.com"  // Этот email уже в базе
}
```

**Решение:** Используйте другой email
```json
{
  "email": "ivan2@example.com"
}
```

### Ошибка: "No session"

**Проблема:** Cookies не отправляются с запросом
```bash
curl -X GET http://localhost:3000/api/auth/session
# Без cookies
```

**Решение:** Используйте флаг `-b` для cookies
```bash
curl -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt
```

---

## 📚 Дополнительные примеры

### Сценарий: Проверить что пароль хеширован

```bash
# 1. Посмотрите данные пользователя
cat data/users.json | jq '.[0]'

# Вывод:
# {
#   "id": "abc123xyz",
#   "name": "Test User",
#   "email": "test@example.com",
#   "password": "$2a$10$..." ← Хеш, не оригинальный пароль
# }
```

### Сценарий: Добавить тестовых пользователей

```bash
# Создать 3 тестовых пользователей
for i in 1 2 3; do
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Test User $i\",
      \"email\": \"test$i@example.com\",
      \"password\": \"TestPassword123\"
    }"
done
```

### Сценарий: Автоматизированное тестирование

```bash
#!/bin/bash

# Регистрация
echo "Registering user..."
REGISTER=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }')

echo "Register response: $REGISTER"

# Проверка сессии
echo "Checking session..."
SESSION=$(curl -s -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt)

echo "Session response: $SESSION"

# Выход
echo "Logging out..."
LOGOUT=$(curl -s -X POST http://localhost:3000/api/auth/session \
  -b cookies.txt)

echo "Logout response: $LOGOUT"

# Проверка что сессия удалена
echo "Checking session after logout..."
AFTER_LOGOUT=$(curl -s -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt)

echo "After logout response: $AFTER_LOGOUT"
```

Сохраните как `test-api.sh` и запустите:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## ✅ Заключение

API полностью функционально для:
- ✅ Регистрации пользователей
- ✅ Входа в аккаунт
- ✅ Проверки сессии
- ✅ Выхода из аккаунта

Используйте примеры выше для тестирования и отладки.
