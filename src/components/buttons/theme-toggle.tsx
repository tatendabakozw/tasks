import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync theme class with HTML element whenever theme changes
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  if (!mounted) {
    return null; // Don't render anything on the server
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-zim-cream-100 dark:bg-zim-cream-800 text-zim-cream-700 dark:text-zim-cream-300 transition-colors hover:bg-zim-cream-200 dark:hover:bg-zim-cream-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-zim-gold-500" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}

