import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateNote, useDeleteNote, useNotes } from "../hooks/use-notes";
import { useSession } from "../hooks/use-session";

const noteSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200),
  content: z.string().max(5000),
});

type NoteForm = z.infer<typeof noteSchema>;

export function NotesPage() {
  const { data: session } = useSession();
  const { data, isLoading } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = (values: NoteForm) => {
    createNote.mutate(values, { onSuccess: () => reset() });
  };

  if (!session) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Notas</h2>
        <p className="mt-2 text-sm text-gray-500">Inicia sesión para ver tus notas.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Notas</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        <div>
          <input
            {...register("title")}
            placeholder="Título"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <textarea
            {...register("content")}
            placeholder="Contenido"
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
          {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
        </div>
        <button
          type="submit"
          disabled={createNote.isPending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {createNote.isPending ? "Guardando…" : "Crear nota"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-sm text-gray-500">Cargando notas…</p>}

        {data?.notes.length === 0 && (
          <p className="text-sm text-gray-500">No hay notas todavía.</p>
        )}

        {data?.notes.map((n) => (
          <article key={n.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-medium">{n.title}</h3>
              <button
                type="button"
                onClick={() => deleteNote.mutate(n.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
            {n.content && <p className="mt-1 text-sm text-gray-600">{n.content}</p>}
            <time className="mt-2 block text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </time>
          </article>
        ))}
      </div>
    </section>
  );
}
