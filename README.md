# Роды и восстановление — платформа курсов

Три курса («Подготовка к родам», «Роды», «Восстановление после родов»), продаются по отдельности или пакетом. Оплата — GetPlatinum, видео — Кинескоп, вход в личный кабинет — по email и паролю, которые задаются при оформлении заказа.

## Оплата через GetPlatinum

Для каждого заказа сайт запрашивает у GetPlatinum отдельную страницу оплаты (`lib/getplatinum.ts`, метод `init-payment-url`). После оплаты GetPlatinum присылает подписанное уведомление на `/api/webhooks/getplatinum` (подпись — HMAC-SHA256 тела запроса с API-ключом, заголовок `X-Checksum`), и нужный курс (или все три для пакета) открывается автоматически.

Переменные окружения в Vercel:
- `GETPLATINUM_API_KEY` — ключ из GetPlatinum («Настройки» → настройки организации → API-ключ)
- `GETPLATINUM_VAT` (необязательно) — ставка НДС в чеке, по умолчанию `none` («не облагается»); должна соответствовать системе налогообложения организации

Пока `GETPLATINUM_API_KEY` не задан, покупателя отправляют на статические ссылки из `lib/config.ts`, а доступ открывается вручную:

```bash
PAID_EMAIL=buyer@example.com PAID_PRODUCT=rody npm run mark-paid
```

`PAID_PRODUCT` — slug курса (`podgotovka-k-rodam`, `rody`, `vosstanovlenie`) или `bundle`. Код под Продамус (`lib/prodamus.ts`, `/api/webhooks/prodamus`) не используется.

## Стек

Next.js (App Router) + TypeScript + Tailwind + Neon (Postgres, `@neondatabase/serverless`, без ORM). Тот же подход, что и в [`learning-tracker`](../learning-tracker).

## Настройка

1. Скопировать `.env.local.example` в `.env.local` и заполнить:
   - `DATABASE_URL` — строка подключения к Neon Postgres
   - `AUTH_JWT_SECRET` — `openssl rand -hex 32`
   - `PRODAMUS_SHOP_DOMAIN`, `PRODAMUS_SECRET_KEY` — из личного кабинета Продамус
2. Применить схему БД и наполнить демо-контентом:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
3. Запустить дев-сервер:
   ```bash
   npm run dev
   ```

## Структура

- `app/` — публичный лендинг, страницы курсов, чекаут, личный кабинет
- `lib/` — доступ к БД (`queries.ts`), сессии и пароли (`auth.ts`), интеграции (`prodamus.ts`)
- `db/schema.sql` — схема БД
- `scripts/seed.ts` — демо-наполнение курсов/модулей/уроков/материалов

⚠️ Точные названия полей и подпись webhook'а Продамуса в `lib/prodamus.ts` нужно свериться с личным кабинетом конкретного магазина перед запуском реальных платежей.
