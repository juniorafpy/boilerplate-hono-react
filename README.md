# Boilerplate Hono + React

Stack: Hono (TS) · Drizzle ORM (PostgreSQL) · Better Auth · React + Vite · TanStack Query · Zustand · React Hook Form + Zod · Tailwind CSS.

## Estructura

```
server/src/
  index.ts          # arranque del servidor (@hono/node-server)
  app.ts            # composición de la app Hono (CORS, logger, rutas)
  db/               # cliente Drizzle + esquema (snake_case)
  lib/              # instancia de Better Auth
  middleware/       # requireAuth (Better Auth)
  routes/           # rutas modulares (/api/auth, /api/health, /api/users)
client/src/
  api/              # fetch wrapper + auth client de Better Auth
  hooks/            # server state con TanStack Query
  stores/           # estado de cliente con Zustand
  components/       # componentes UI
  pages/            # páginas
  types/            # tipos compartidos
```

## Uso

```bash
cp .env.example .env   # ajusta DATABASE_URL
npm install
npm run db:generate    # genera migraciones
npm run db:migrate     # aplica migraciones
npm run dev            # API (:3000) + Vite (:5173)
```

Reglas del proyecto en `.cursorrules/IA_RULES.md`.
