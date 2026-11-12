import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import type { HealthResponse } from "../types";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => apiFetch<HealthResponse>("/health"),
  });
}
