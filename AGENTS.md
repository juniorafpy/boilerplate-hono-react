# Stack Tecnológico y Reglas del Proyecto

Este proyecto utiliza un stack moderno, fuertemente tipado y optimizado para escalabilidad. No utilices librerías ni tecnologías fuera de este stack a menos que se te indique explícitamente.

## 1. Stack Tecnológico
- **Runtime / Servidor:** Hono (TypeScript)
- **Base de Datos:** PostgreSQL
- **ORM / Migraciones:** Drizzle ORM (con nombres de columnas en snake_case estricto)
- **Autenticación:** Better Auth
- **Frontend:** React + Vite (TypeScript)
- **Estado Servidor / Caché:** TanStack Query
- **Estado Global:** Zustand
- **Formularios:** React Hook Form (+ Zod para validaciones)
- **Estilos:** Tailwind CSS

## 2. Convenciones de Código y Arquitectura
- **Tipado estricto:** Todo el código debe estar escrito en TypeScript estricto. Evita el uso de `any`.
- **Base de datos:**
  - Utiliza `snake_case` para los nombres de columnas y tablas en Drizzle.
  - Exporta los tipos inferidos de Drizzle (`InferSelectModel`, etc.) para compartirlos con el cliente si es necesario.
- **Backend (Hono):**
  - Mantén las rutas modulares dentro de `server/src/routes/`.
  - Protege las rutas privadas utilizando los middlewares de Better Auth (`server/src/middleware/auth.ts` → `requireAuth`).
  - Compón la app en `server/src/app.ts` y el arranque en `server/src/index.ts`.
- **Frontend (React):**
  - Separa la lógica de obtención de datos (Server State) usando **TanStack Query** en la carpeta `client/src/hooks/`.
  - Utiliza **Zustand** únicamente para estados puramente locales/globales del cliente (ej. UI, modales, preferencias).
  - Utiliza **React Hook Form** para cualquier formulario complejo.
  - Peticiones HTTP mediante el wrapper `client/src/api/client.ts` (credentials incluidas, rutas relativas `/api/*` vía proxy de Vite).
- **Estructura de carpetas:**
  - Backend: `server/src/{db,lib,middleware,routes}`
  - Frontend: `client/src/{api,hooks,stores,components,pages,types}`

## 3. Reglas de Comportamiento para la IA
- **Cero explicaciones redundantes:** Asume que ya conozco este stack. Ve directo al código funcional y limpio.
- **Coherencia:** Si creas una nueva entidad o tabla, genera en el mismo cambio: su esquema en Drizzle (`server/src/db/schema/`), su endpoint en Hono (`server/src/routes/`) y su hook de TanStack Query en el cliente (`client/src/hooks/`), siguiendo la estructura del boilerplate.
- **Comandos:**
  - `npm run dev` → API (:3000) + Vite (:5173)
  - `npm run typecheck` → validación TypeScript antes de terminar
  - `npm run db:generate` / `npm run db:migrate` → migraciones Drizzle
