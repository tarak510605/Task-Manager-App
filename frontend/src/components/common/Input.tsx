import { forwardRef, type InputHTMLAttributes, type Ref } from "react";
import type { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  multiline?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ error, label, multiline, className = "", ...props }, ref) => {
  const inputClass = `w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-steel focus:ring-4 focus:ring-steel/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/35 ${className}`;

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink/80 dark:text-white/80">{label}</span>
      {multiline ? (
        <textarea ref={ref as Ref<HTMLTextAreaElement>} rows={4} className={inputClass} {...props} />
      ) : (
        <input ref={ref as Ref<HTMLInputElement>} className={inputClass} {...props} />
      )}
      {error ? <span className="text-xs font-medium text-red-600">{error.message}</span> : null}
    </label>
  );
  }
);

Input.displayName = "Input";
