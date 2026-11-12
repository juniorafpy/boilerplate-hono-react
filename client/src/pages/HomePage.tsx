import { useHealth } from "../hooks/use-health";

export function HomePage() {
  const { data, isLoading, error } = useHealth();

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">API Status</h1>

      {isLoading && <p className="mt-4 text-sm text-gray-500">Consultando salud del servidor…</p>}

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {(error as Error).message}
        </p>
      )}

      {data && (
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-gray-500">Estado</dt>
            <dd className="font-medium text-green-600">{data.status}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Timestamp</dt>
            <dd className="font-medium">{data.timestamp}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Uptime (s)</dt>
            <dd className="font-medium">{Math.round(data.uptime)}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
