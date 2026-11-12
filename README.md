# Boilerplate Hono + React

Plantilla fullstack en TypeScript estricto lista para clonar y arrancar: **Hono + Drizzle + Better Auth** en el backend, **React + Vite + TanStack Query** en el frontend, con reglas de IA integradas (`AGENTS.md`).

> **Uso como plantilla:** [Use this template](https://github.com/juniorafpy/boilerplate-hono-react/generate) en GitHub, o clona y borra el `.git`.

---

## 1. Stack

| Capa | Tecnología |
|---|---|
| Servidor | Hono (TypeScript, `@hono/node-server`) |
| Base de datos | PostgreSQL 17 |
| ORM / migraciones | Drizzle ORM + drizzle-kit (columnas en **snake_case**) |
| Autenticación | Better Auth (email/password, sesiones en BD) |
| Frontend | React 19 + Vite (TypeScript) |
| Server state | TanStack Query (caché, mutaciones, invalidación) |
| Estado global | Zustand (solo UI/local) |
| Formularios | React Hook Form + Zod (`@hookform/resolvers`) |
| Validación backend | Zod + `@hono/zod-validator` |
| Estilos | Tailwind CSS 4 (plugin `@tailwindcss/vite`) |
| Tooling | TypeScript 7, tsx (watch), concurrently |

---

## 2. Requisitos previos

- **Node.js** ≥ 20
- **PostgreSQL** ≥ 16 corriendo en `localhost:5432`
- (Opcional) `gh` CLI para publicar en GitHub

---

## 3. Puesta en marcha

```bash
# 1. Base de datos (una sola vez)
psql -U postgres -c "CREATE DATABASE boilerplate;"

# 2. Variables de entorno
cp .env.example .env        # ajusta DATABASE_URL si es necesario

# 3. Dependencias
npm install

# 4. Migraciones
npm run db:generate         # genera el SQL desde los esquemas
npm run db:migrate          # lo aplica a la BD

# 5. Arranque (API :3000 + Vite :5173)
npm run dev
```

Abre **http://localhost:5173**. Crea una cuenta desde la UI (o con `POST /api/auth/sign-up/email`) y ya puedes crear notas.

### Variables de entorno (`.env`)

| Variable | Ejemplo | Descripción |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/boilerplate` | Conexión Drizzle / Better Auth |
| `PORT` | `3000` | Puerto del servidor Hono |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Origen permitido en CORS |

---

## 4. Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | API + cliente a la vez (concurrently) |
| `npm run dev:server` | Solo Hono con watch (`tsx watch`) |
| `npm run dev:client` | Solo Vite con HMR |
| `npm run typecheck` | `tsc --noEmit` (ejecutar antes de terminar cada tarea) |
| `npm run build` | Build de producción del cliente |
| `npm run db:generate` | Genera migración desde `server/src/db/schema/` |
| `npm run db:migrate` | Aplica migraciones pendientes |
| `npm run db:studio` | Drizzle Studio (explorar/editar datos) |

---

## 5. Estructura del proyecto

```
├── AGENTS.md                    # Reglas del proyecto para cualquier IA (fuente única)
├── CLAUDE.md                    # → apunta a AGENTS.md (Claude Code)
├── .github/copilot-instructions.md  # → apunta a AGENTS.md (Copilot)
├── drizzle.config.ts            # Config de migraciones
├── vite.config.ts               # React + Tailwind + proxy /api → :3000
├── tsconfig.json                # TypeScript estricto (server + client)
├── index.html                   # Entry del cliente
│
├── server/src/
│   ├── index.ts                 # Arranque (@hono/node-server)
│   ├── app.ts                   # Composición: CORS, logger, montaje de rutas
│   ├── db/
│   │   ├── index.ts             # Cliente Drizzle (postgres.js)
│   │   ├── schema/              # Esquemas (snake_case) ← generar aquí
│   │   │   ├── auth.ts          # user, session, account, verification
│   │   │   └── notes.ts         # Ejemplo de entidad completa
│   │   └── migrations/          # SQL generado por drizzle-kit
│   ├── lib/auth.ts              # Instancia Better Auth + adapter Drizzle
│   ├── middleware/auth.ts       # requireAuth (protege rutas)
│   └── routes/                  # Endpoints modulares ← crear aquí
│       ├── auth.ts              # /api/auth/*  (Better Auth)
│       ├── health.ts            # GET /api/health
│       ├── notes.ts             # CRUD /api/notes (ejemplo)
│       └── users.ts             # GET /api/users/me
│
└── client/src/
    ├── main.tsx                 # React root + QueryClientProvider
    ├── App.tsx                  # Layout y páginas
    ├── index.css                # @import "tailwindcss"
    ├── api/
    │   ├── client.ts            # apiFetch<T>() → /api/* con credentials
    │   └── auth-client.ts       # createAuthClient() (better-auth/react)
    ├── hooks/                   # Server state (TanStack Query) ← crear aquí
    │   ├── use-session.ts
    │   ├── use-health.ts
    │   └── use-notes.ts         # Ejemplo: query + mutaciones
    ├── stores/ui-store.ts       # Zustand (solo estado de UI)
    ├── components/              # Componentes presentacionales
    ├── pages/                   # Páginas
    │   ├── HomePage.tsx         # Monitor de salud de la API
    │   └── NotesPage.tsx        # Ejemplo con RHF + Zod
    └── types/index.ts           # Tipos compartidos (Note, ApiUser, …)
```

---

## 6. Endpoints

### Públicos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servidor (uptime, timestamp) |
| `POST` | `/api/auth/sign-up/email` | Registro `{email, password, name}` |
| `POST` | `/api/auth/sign-in/email` | Login `{email, password}` → cookie de sesión |
| `POST` | `/api/auth/sign-out` | Cierra sesión |
| `GET` | `/api/auth/get-session` | Devuelve la sesión actual (Better Auth) |

> Better Auth expone el resto de endpoints (reset password, OAuth, etc.) bajo `/api/auth/*`. Documentación: https://www.better-auth.com/docs

### Protegidas (requieren cookie de sesión → `401` sin ella)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/users/me` | Usuario de la sesión actual |
| `GET` | `/api/notes` | Notas del usuario autenticado |
| `POST` | `/api/notes` | Crea nota `{title, content}` → `201` |
| `PATCH` | `/api/notes/:id` | Actualiza (parcial) → `404` si no es tuya |
| `DELETE` | `/api/notes/:id` | Elimina → `404` si no es tuya |

Ejemplo con curl:

```bash
# Login y guardar cookie
curl -c cookies.txt -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Usar la cookie
curl -b cookies.txt http://localhost:3000/api/notes
```

---

## 7. Cómo añadir una entidad nueva (patrón obligatorio)

Toda entidad nueva se genera **completa en el mismo cambio** (regla de `AGENTS.md`). Copia el patrón de `notes`:

**1. Esquema** — `server/src/db/schema/<entidad>.ts`
```ts
export const project = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type Project = InferSelectModel<typeof project>;
```
Y exportarlo desde `db/schema/index.ts`.

**2. Endpoint** — `server/src/routes/<entidad>.ts`
```ts
export const projectRoutes = new Hono()
  .use(requireAuth)                       // siempre protegido
  .get("/projects", async (c) => { /* filtra por c.var.session.user.id */ })
  .post("/projects", zValidator("json", schemaZod), async (c) => { /* … */ });
```
Montarlo en `server/src/app.ts` (`app.route("/api", projectRoutes)`) y en `routes/index.ts`.

**3. Hook** — `client/src/hooks/use-<entidad>.ts`
```ts
export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: () => apiFetch<{ projects: Project[] }>("/projects") });
}
export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectInput) => apiFetch<{ project: Project }>("/projects", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}
```

**4. Tipos** — añadir la interfaz en `client/src/types/index.ts`.

**5. Página/componente** — formulario con `useForm` + `zodResolver`, lista con el hook.

**6. Migración y validación**
```bash
npm run db:generate && npm run db:migrate
npm run typecheck
```
Probar el endpoint (signup/login/CRUD) antes de dar por terminada la tarea.

---

## 8. Convenciones (resumen de AGENTS.md)

- TypeScript estricto: **nada de `any`**.
- Columnas y tablas en Drizzle: **snake_case** (`userId` → `user_id`).
- Rutas solo en `server/src/routes/`, protegidas con `requireAuth`.
- Server state → **TanStack Query** en `client/src/hooks/`; estado de UI → **Zustand** en `client/src/stores/`.
- Formularios complejos → **React Hook Form + Zod**.
- HTTP desde el cliente → siempre `apiFetch()` de `client/src/api/client.ts`.
- Antes de terminar cada tarea: `npm run typecheck`.

Los archivos de reglas se mantienen sincronizados apuntando a `AGENTS.md`:
`CLAUDE.md` y `.github/copilot-instructions.md` solo lo referencian — **edita siempre `AGENTS.md`**.

---

## 9. Despliegue (notas)

- **Cliente:** `npm run build` → estáticos en `dist/` (Nginx, Vercel, etc.). Ajusta el proxy/`apiFetch` a la URL absoluta de la API.
- **Servidor:** `tsx server/src/index.ts` detrás de un process manager (PM2, systemd, Docker). Define `DATABASE_URL`, `PORT`, `CLIENT_ORIGIN` y `BETTER_AUTH_URL`.
- **BD:** `npm run db:migrate` en el release; nunca tocar migraciones ya aplicadas.

---

## 10. Troubleshooting

| Síntoma | Solución |
|---|---|
| `ECONNREFUSED :5432` | PostgreSQL no corre: `Start-Service postgresql-x64-17` |
| `password authentication failed` | Revisa `DATABASE_URL` en `.env` |
| `401` inesperado en rutas protegidas | No hay cookie: hace login primero (`sign-in/email`) |
| El servidor no arranca tras tocar rutas | Mira la consola de `npm run dev`; reinicia si `tsx watch` murió (p. ej. por import inexistente) |
| `Better Auth: Base URL is not set` | Warning inocuo en dev; en producción define `BETTER_AUTH_URL` |
| Puerto ocupado | Cambia `PORT` (API) o el puerto en `vite.config.ts` (cliente) |
| Migración no refleja el esquema | `npm run db:generate` tras editar `db/schema/` |

---

## Licencia

Úsalo libremente en tus proyectos.
