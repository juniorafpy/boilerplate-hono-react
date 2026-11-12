import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth";
import { healthRoutes } from "./routes/health";
import { noteRoutes } from "./routes/notes";
import { userRoutes } from "./routes/users";

export const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (c) => c.json({ name: "boilerplate-hono-react", ok: true }));

app.route("/api", authRoutes);
app.route("/api", healthRoutes);
app.route("/api", noteRoutes);
app.route("/api", userRoutes);

app.notFound((c) => c.json({ error: "Not found" }, 404));
