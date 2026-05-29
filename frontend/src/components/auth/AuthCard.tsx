import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export const AuthCard = ({
  children,
  subtitle,
  title
}: {
  children: ReactNode;
  subtitle: string;
  title: string;
}) => (
  <main className="grid min-h-screen place-items-center bg-paper px-4 py-10 text-ink dark:bg-ink dark:text-white">
    <section className="w-full max-w-md rounded-md border border-ink/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/10">
      <div className="mb-6 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-moss text-white">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-normal">{title}</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-white/60">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  </main>
);
