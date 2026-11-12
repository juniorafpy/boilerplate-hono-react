import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import type { Note } from "../types";

export interface NoteInput {
  title: string;
  content: string;
}

export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: () => apiFetch<{ notes: Note[] }>("/notes"),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NoteInput) =>
      apiFetch<{ note: Note }>("/notes", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ ok: boolean }>(`/notes/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}
