import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const modes = ["light", "dark"] as const;
export const palettes = [
  { id: "garden", label: "Garden green" },
  { id: "ocean", label: "Ocean blue" },
  { id: "blossom", label: "Blossom pink" },
  { id: "sunset", label: "Sunset amber" },
] as const;
export const fonts = [
  { id: "jakarta", label: "Plus Jakarta Sans", family: '"Plus Jakarta Sans", sans-serif' },
  { id: "lora", label: "Lora", family: '"Lora", serif' },
  { id: "nunito", label: "Nunito", family: '"Nunito", sans-serif' },
  { id: "mono", label: "Space Mono", family: '"Space Mono", monospace' },
] as const;
export const styles = [
  { id: "soft", label: "Soft & rounded" },
  { id: "sharp", label: "Crisp & square" },
] as const;

export type Theme = {
  mode: (typeof modes)[number];
  palette: (typeof palettes)[number]["id"];
  font: (typeof fonts)[number]["id"];
  style: (typeof styles)[number]["id"];
};
const defaults: Theme = { mode: "light", palette: "garden", font: "jakarta", style: "soft" };
const KEY = "nesttask-theme";

const Ctx = createContext<{ theme: Theme; setTheme: (patch: Partial<Theme>) => void; resetTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, set] = useState<Theme>(defaults);
  useEffect(() => {
    try { const saved = localStorage.getItem(KEY); if (saved) set({ ...defaults, ...JSON.parse(saved) }); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme.mode === "dark");
    root.dataset["palette"] = theme.palette;
    root.dataset["style"] = theme.style;
    root.style.setProperty("--nest-font", fonts.find((f) => f.id === theme.font)!.family);
    localStorage.setItem(KEY, JSON.stringify(theme));
  }, [theme]);
  return <Ctx.Provider value={{ theme, setTheme: (p) => set((t) => ({ ...t, ...p })), resetTheme: () => set(defaults) }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be inside ThemeProvider");
  return v;
}
