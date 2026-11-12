import { useQuery } from "@tanstack/react-query";
import { authClient } from "../api/auth-client";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
    staleTime: 60_000,
    retry: false,
  });
}
