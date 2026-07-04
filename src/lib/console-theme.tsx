import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ConsoleTheme = "stripe-light" | "stripe-dark";

const STORAGE_KEY = "argos-console-theme";

interface ThemeContextValue {
  theme: ConsoleTheme;
  setTheme: (theme: ConsoleTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ConsoleTheme {
  if (typeof window === "undefined") return "stripe-light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "stripe-dark" || stored === "stripe-light") return stored;
  return "stripe-light";
}

export function ConsoleThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ConsoleTheme>("stripe-light");

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  const setTheme = (next: ConsoleTheme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const toggleTheme = () => {
    setTheme(theme === "stripe-light" ? "stripe-dark" : "stripe-light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useConsoleTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useConsoleTheme must be used within ConsoleThemeProvider");
  return ctx;
}

export function themeClassName(theme: ConsoleTheme): string {
  return theme === "stripe-dark" ? "theme-stripe-dark" : "theme-stripe-light";
}
