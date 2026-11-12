import { zValidator } from "@hono/zod-validator";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db";
import { note } from "../db/schema";
import { requireAuth } from "../middleware/auth";

const noteInput = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(5000).default(""),
});

const noteParams = z.object({
  id: z.string().uuid(),
});

export const noteRoutes = new Hono()
  .use(requireAuth)
  .get("/notes", async (c) => {
    const { session } = c.var;
    const notes = await db
      .select()
      .from(note)
      .where(eq(note.userId, session.user.id))
      .orderBy(desc(note.createdAt));
    return c.json({ notes });
  })
  .post("/notes", zValidator("json", noteInput), async (c) => {
    const { session } = c.var;
    const data = c.req.valid("json");
    const [created] = await db
      .insert(note)
      .values({ ...data, userId: session.user.id })
      .returning();
    return c.json({ note: created }, 201);
  })
  .patch("/notes/:id", zValidator("param", noteParams), zValidator("json", noteInput.partial()), async (c) => {
    const { session } = c.var;
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const [updated] = await db
      .update(note)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(note.id, id), eq(note.userId, session.user.id)))
      .returning();
    if (!updated) {
      return c.json({ error: "Note not found" }, 404);
    }
    return c.json({ note: updated });
  })
  .delete("/notes/:id", zValidator("param", noteParams), async (c) => {
    const { session } = c.var;
    const { id } = c.req.valid("param");
    const deleted = await db
      .delete(note)
      .where(and(eq(note.id, id), eq(note.userId, session.user.id)))
      .returning({ id: note.id });
    if (deleted.length === 0) {
      return c.json({ error: "Note not found" }, 404);
    }
    return c.json({ ok: true });
  });
