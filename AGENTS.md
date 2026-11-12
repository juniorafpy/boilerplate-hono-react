# Project Stack and Rules

This project uses a modern, strongly typed stack designed for scalability. Do not use libraries or technologies outside this stack unless explicitly told to do so.

## 1. Technology Stack
- **Runtime / Server:** Hono (TypeScript)
- **Database:** PostgreSQL
- **ORM / Migrations:** Drizzle ORM (strict snake_case column names)
- **Authentication:** Better Auth
- **Frontend:** React + Vite (TypeScript)
- **Server State / Cache:** TanStack Query
- **Global State:** Zustand
- **Forms:** React Hook Form (+ Zod for validation)
- **Styling:** Tailwind CSS

## 2. Code and Architecture Conventions
- **Strict typing:** All code must be written in strict TypeScript. Avoid `any`.
- **Database:**
  - Use `snake_case` for Drizzle column and table names.
  - Export Drizzle inferred types (`InferSelectModel`, etc.) to share them with the client when needed.
- **Backend (Hono):**
  - Keep routes modular inside `server/src/routes/`.
  - Protect private routes using Better Auth middleware (`server/src/middleware/auth.ts` → `requireAuth`).
  - Compose the app in `server/src/app.ts` and the boot file in `server/src/index.ts`.
- **Frontend (React):**
  - Keep data-fetching logic (server state) in **TanStack Query** hooks under `client/src/hooks/`.
  - Use **Zustand** only for purely local/global client state (e.g. UI, modals, preferences).
  - Use **React Hook Form** for any complex form.
  - Perform HTTP requests through the `client/src/api/client.ts` wrapper (credentials included, relative `/api/*` paths via the Vite proxy).
- **Folder structure:**
  - Backend: `server/src/{db,lib,middleware,routes}`
  - Frontend: `client/src/{api,hooks,stores,components,pages,types}`

## 3. AI Behavior Rules
- **No redundant explanations:** Assume this stack is already known. Go straight to functional, clean code.
- **Coherence:** When creating a new entity or table, generate in the same change: its Drizzle schema (`server/src/db/schema/`), its Hono endpoint (`server/src/routes/`), and its TanStack Query hook on the client (`client/src/hooks/`), following the boilerplate structure.
- **Commands:**
  - `npm run dev` → API (:3000) + Vite (:5173)
  - `npm run typecheck` → TypeScript validation before finishing a task
  - `npm run db:generate` / `npm run db:migrate` → Drizzle migrations
