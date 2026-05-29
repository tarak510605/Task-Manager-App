import { ClipboardList } from "lucide-react";

export const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <div className="flex min-h-40 flex-col items-center justify-center rounded-md border border-dashed border-ink/15 bg-white/50 p-6 text-center dark:border-white/15 dark:bg-white/5">
    <ClipboardList className="mb-3 h-8 w-8 text-ink/35 dark:text-white/35" aria-hidden="true" />
    <p className="text-sm font-semibold text-ink dark:text-white">{title}</p>
    <p className="mt-1 text-sm text-ink/60 dark:text-white/60">{message}</p>
  </div>
);
