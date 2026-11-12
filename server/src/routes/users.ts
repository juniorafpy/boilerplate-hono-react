import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";

export const userRoutes = new Hono()
  .use(requireAuth)
  .get("/users/me", (c) => {
    const { session } = c.var;
    return c.json({ user: session.user });
  });
