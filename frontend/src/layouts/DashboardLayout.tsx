import { LogOut, Moon, Sun } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../hooks/useDarkMode";

export const DashboardLayout = () => {
  const { isDark, setIsDark } = useDarkMode();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-paper text-ink transition dark:bg-ink dark:text-white">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur dark:border-white/10 dark:bg-ink/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss dark:text-emerald-300">
              Task Manager
            </p>
            <h1 className="text-lg font-bold sm:text-xl">Hello, {user?.name || "there"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Toggle dark mode"
              className="h-10 w-10 px-0"
              onClick={() => setIsDark(!isDark)}
              title="Toggle dark mode"
              variant="secondary"
            >
              {isDark ? (
                <Sun className="h-9 w-9" strokeWidth={2.5} />
              ) : (
                <Moon className="h-9 w-9" strokeWidth={2.5} />
              )}
            </Button>
            <Button onClick={logout} variant="secondary">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};
