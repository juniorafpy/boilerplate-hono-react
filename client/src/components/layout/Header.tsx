import { authClient } from "../../api/auth-client";
import { useSession } from "../../hooks/use-session";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
        <span className="text-lg font-semibold">Boilerplate Hono + React</span>

        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <button
              type="button"
              onClick={() => authClient.signOut()}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
            >
              Salir
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-500">No autenticado</span>
        )}
      </div>
    </header>
  );
}
