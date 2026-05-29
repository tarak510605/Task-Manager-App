export const Spinner = ({ label = "Loading" }: { label?: string }) => (
  <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-ink/60 dark:text-white/60">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-ink dark:border-white/20 dark:border-t-white" />
    {label}
  </div>
);
