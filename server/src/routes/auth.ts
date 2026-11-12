import { Hono } from "hono";
import { auth } from "../lib/auth";

export const authRoutes = new Hono().on(["GET", "POST"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});
