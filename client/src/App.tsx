import { Header } from "./components/layout/Header";
import { HomePage } from "./pages/HomePage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <HomePage />
      </main>
    </div>
  );
}
