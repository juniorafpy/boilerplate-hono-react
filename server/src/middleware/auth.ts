import { createMiddleware } from "hono/factory";
import { auth, type Session } from "../lib/auth";

declare module "hono" {
  interface ContextVariableMap {
    session: Session;
  }
}

export const requireAuth = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("session", session);
  await next();
});
