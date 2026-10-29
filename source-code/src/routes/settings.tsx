import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eraser, Moon, Palette, RotateCcw, Sun } from "lucide-react";
import { fonts, palettes, styles, useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/tasks";
import ladybug from "@/assets/ladybug-small.png.asset.json";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings · NestTask" }, { name: "description", content: "Manage your NestTask guest session, tidy completed tasks, and reset the starter list." },
    { property: "og:title", content: "Settings · NestTask" }, { property: "og:description", content: "Tune your comfortable home for tasks." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Settings,
});
function Settings() {
  const { tasks, clearCompleted, resetTasks } = useTasks();
  const { theme, setTheme, resetTheme } = useTheme();
  const swatch: Record<string, string> = { garden: "oklch(0.368 0.054 157)", ocean: "oklch(0.36 0.07 245)", blossom: "oklch(0.40 0.09 355)", sunset: "oklch(0.42 0.08 50)" };
  const completedCount = tasks.filter((task) => task.completed).length;
  return <main className="editor-page">
    <div className="settings-topbar">
      <Button variant="nestIcon" asChild title="Back to dashboard"><Link to="/dashboard" aria-label="Back to dashboard"><ArrowLeft size={26} /></Link></Button>
      <h1 className="editor-greeting settings-greeting">Settings<img className="ladybug" src={ladybug.url} alt="" /></h1>
    </div>
    <section className="editor-panel settings-panel" aria-labelledby="theme-heading">
      <h2 className="editor-label settings-heading" id="theme-heading">Personal theme</h2>
      <p className="settings-note">Appearance</p>
      <div className="theme-options">
        <Button variant="nestTag" aria-pressed={theme.mode === "light"} onClick={() => setTheme({ mode: "light" })}><Sun size={16} />Light</Button>
        <Button variant="nestTag" aria-pressed={theme.mode === "dark"} onClick={() => setTheme({ mode: "dark" })}><Moon size={16} />Dark</Button>
      </div>
      <p className="settings-note">Colour theme</p>
      <div className="theme-options">
        {palettes.map((p) => <Button key={p.id} variant="nestTag" aria-pressed={theme.palette === p.id} onClick={() => setTheme({ palette: p.id })}>
          <span className="theme-swatch" style={{ background: swatch[p.id] }} />{p.label}</Button>)}
      </div>
      <p className="settings-note">Font</p>
      <div className="theme-options">
        {fonts.map((f) => <Button key={f.id} variant="nestTag" aria-pressed={theme.font === f.id} style={{ fontFamily: f.family }} onClick={() => setTheme({ font: f.id })}>{f.label}</Button>)}
      </div>
      <p className="settings-note">Style</p>
      <div className="theme-options">
        {styles.map((st) => <Button key={st.id} variant="nestTag" aria-pressed={theme.style === st.id} onClick={() => setTheme({ style: st.id })}>{st.label}</Button>)}
      </div>
      <div className="settings-actions">
        <Button variant="nestSecondary" className="settings-action" onClick={resetTheme}><Palette size={20} />Restore original look</Button>
      </div>
    </section>
    <section className="editor-panel settings-panel" aria-labelledby="session-heading">
      <h2 className="editor-label settings-heading" id="session-heading">Guest session</h2>
      <p className="settings-note">You're using NestTask as a guest. Your tasks live in this browser session only — closing the tab starts fresh. Sign-in isn't part of this design yet.</p>
    </section>
    <section className="editor-panel settings-panel" aria-labelledby="tasks-heading">
      <h2 className="editor-label settings-heading" id="tasks-heading">Task list</h2>
      <p className="settings-note">{tasks.length} {tasks.length === 1 ? "task" : "tasks"} in your list, {completedCount} completed.</p>
      <div className="settings-actions">
        <Button variant="nestSecondary" className="settings-action" onClick={clearCompleted} disabled={completedCount === 0}>
          <Eraser size={20} />Clear completed tasks
        </Button>
        <Button variant="nestSecondary" className="settings-action" onClick={resetTasks}>
          <RotateCcw size={20} />Reset to starter tasks
        </Button>
      </div>
    </section>
  </main>;
}
