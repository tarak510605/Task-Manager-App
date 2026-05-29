import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";

export const NotFoundPage = () => (
  <main className="grid min-h-screen place-items-center bg-paper px-4 text-ink dark:bg-ink dark:text-white">
    <section className="max-w-md text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-coral">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">The page you opened does not exist.</p>
      <Button className="mt-5">
        <Link to="/">Back to board</Link>
      </Button>
    </section>
  </main>
);
