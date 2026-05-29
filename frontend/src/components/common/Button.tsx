import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-black dark:bg-paper dark:text-ink dark:hover:bg-white",
  secondary:
    "border border-ink/10 bg-white text-ink hover:bg-ink/5 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-ink hover:bg-ink/5 dark:text-white dark:hover:bg-white/10"
};

export const Button = ({
  children,
  className = "",
  disabled,
  isLoading,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    {...props}
  >
    {isLoading ? "Working..." : children}
  </button>
);
