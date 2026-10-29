import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CircleCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks, progress, achievements, today, addDays, tags, type Task } from "@/lib/tasks";
import ladybug from "@/assets/ladybug-small.png.asset.json";
import bigLadybug from "@/assets/ladybug.png.asset.json";
import addnotes from "@/assets/addnotes.png.asset.json";
import edit from "@/assets/edit.png.asset.json";
import remove from "@/assets/delete.png.asset.json";
import unchecked from "@/assets/checkbox-circle.png.asset.json";
import checked from "@/assets/property-1checked.png.asset.json";
import account from "@/assets/accountcircle.png.asset.json";
import settings from "@/assets/settings.png.asset.json";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Your tasks · NestTask" }, { name: "description", content: "Organize your active tasks, completed tasks, and daily progress with NestTask." },
    { property: "og:title", content: "Your tasks · NestTask" }, { property: "og:description", content: "Your tasks and daily progress, together in one comfortable place." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Dashboard,
});
function Dashboard() {
  const { tasks, movedId, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState("All");
  const [date, setDate] = useState(today());
  const dailyTasks = tasks.filter((task) => task.date === date);
  const filtered = dailyTasks.filter((task) => filter === "All" || task.tag === filter);
  const percent = progress(dailyTasks);
  const done = filtered.filter((task) => task.completed).length;
  const active = filtered.length - done;
  const doneToday = dailyTasks.filter((task) => task.completed).length;
  const [celebrated, setCelebrated] = useState(false);
  const clearedWatch = useRef<{ date: string; remaining: number } | null>(null);
  useEffect(() => {
    const remaining = dailyTasks.filter((task) => !task.completed).length;
    const previous = clearedWatch.current;
    clearedWatch.current = { date, remaining };
    if (previous && previous.date !== date) setCelebrated(false);
    else if (previous && previous.remaining > 0 && remaining === 0) setCelebrated(true);
  }, [dailyTasks, date]);
  const grouped = (filter === "All" ? tags : [filter as (typeof tags)[number]])
    .map((tag) => ({ tag, items: filtered.filter((task) => task.tag === tag) }))
    .filter((group) => group.items.length > 0);
  const upcoming = tasks
    .filter((task) => task.date > date && !task.completed)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  const stats = achievements(tasks, date);
  const news = stats.finished === 0
    ? "Tick your first task to start the tally."
    : stats.streak >= 2
      ? `${stats.streak} days cleared in a row — the habit is sticking.`
      : `${stats.finished} ${stats.finished === 1 ? "task" : "tasks"} done so far, and the list keeps going.`;

  const dateLabel = new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" }).toLowerCase();
  const dayLabel = (day: string) => day === addDays(today(), 1)
    ? "Tomorrow"
    : day === addDays(today(), -1)
      ? "Yesterday"
      : new Date(`${day}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  function row(task: Task) {
    return <div key={task.id} className={`task-row${task.completed ? " completed" : ""}${task.id === movedId ? " moved" : ""}`}>
      <Button variant="nestIcon" className="task-check" aria-label={`${task.completed ? "Reopen" : "Complete"} ${task.title}`} onClick={() => toggleTask(task.id)} title={task.completed ? "Reopen task" : "Complete task"}><img src={task.completed ? checked.url : unchecked.url} alt="" /></Button>
      <Button variant="nestText" className="task-title" aria-pressed={task.completed} onClick={() => toggleTask(task.id)} title={task.completed ? "Reopen task" : "Complete task"}>{task.title}</Button>
      <div className="task-actions">
        {!task.completed && <Button variant="nestIcon" className="nest-icon-small" asChild title="Edit task"><Link to="/create-task" search={{ id: task.id }} aria-label={`Edit ${task.title}`}><img src={edit.url} alt="" /></Link></Button>}
        <Button variant="nestIcon" className="nest-icon-small" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task"><img src={remove.url} alt="" /></Button>
      </div>
    </div>;
  }
  return <main className="dashboard">
    <header className="dashboard-header">
      <div className="date-chip"><img className="ladybug" src={ladybug.url} alt="" /><span>{dateLabel}</span></div>
      <div className="flex items-center gap-2">
        <input type="date" aria-label="View tasks for date" className="date-input" value={date} onChange={(event) => { if (event.target.value) setDate(event.target.value); }} />
        <Button variant="nestIcon" asChild title="Settings"><Link to="/settings" aria-label="Settings"><img src={settings.url} alt="" /></Link></Button>
        <Button variant="nestIcon" asChild title="Back to welcome"><Link to="/" aria-label="Back to welcome"><img src={account.url} alt="" /></Link></Button>
      </div>
    </header>
    <div className="dashboard-columns">
      <section>
        <div className="filter-bar" aria-label="Filter tasks by tag">{["All", "School", "Home", "Kids", ...(tasks.some((task) => task.tag === "Personal") ? ["Personal"] : [])].map((tag) => <Button key={tag} variant="nestTag" aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag}</Button>)}</div>
        <section className="task-list" aria-labelledby="active-heading">
          <div className="list-heading"><h2 id="active-heading">Active list <span className="list-count">{active}</span></h2><Button variant="nestIcon" asChild title="Create task"><Link to="/create-task" search={{}} aria-label="Create task"><img src={addnotes.url} alt="" /></Link></Button></div>
          {grouped.map((group) => {
            const items = group.items.filter((task) => !task.completed);
            if (!items.length) return null;
            return <section key={group.tag} className="tag-section" aria-label={`${group.tag} active tasks`}>
              <h3 className="tag-heading">{group.tag} <span className="list-count">{items.length}</span></h3>
              {items.map(row)}
            </section>;
          })}
          {!filtered.some((task) => !task.completed) && <p className="empty-list">No active tasks</p>}
        </section>
        <section className="task-list" aria-labelledby="completed-heading">
          <div className="list-heading"><h2 id="completed-heading">Completed list <span className="list-count">{done}</span></h2></div>
          {grouped.map((group) => {
            const items = group.items.filter((task) => task.completed);
            if (!items.length) return null;
            return <section key={group.tag} className="tag-section" aria-label={`${group.tag} completed tasks`}>
              <h3 className="tag-heading">{group.tag} <span className="list-count">{items.length}</span></h3>
              {items.map(row)}
            </section>;
          })}
          {!filtered.some((task) => task.completed) && <p className="empty-list">No completed tasks yet</p>}
        </section>
      </section>
      <div className="dashboard-side">
        <aside className="progress-panel"><div className="progress-heading"><h2>Day’s progress</h2><CircleCheck size={26} /></div><p className="progress-number">{percent}%</p><div className="progress-track" role="progressbar" aria-label="Day’s progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{ width: `${percent}%` }}><img className="ladybug progress-bug" src={ladybug.url} alt="" /></div></div><p className="progress-caption">{done} of {filtered.length} {filtered.length === 1 ? "task" : "tasks"} done</p></aside>
        <aside className="info-card" aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading">Coming up</h2>
          {upcoming.map((task) => <div key={task.id} className="upcoming-row">
            <span className="upcoming-day">{dayLabel(task.date)}</span>
            <span className="upcoming-title">{task.title}</span>
            <span className="upcoming-tag">{task.tag}</span>
          </div>)}
          {!upcoming.length && <p className="empty-list">Nothing scheduled after this day</p>}
        </aside>
        <aside className="info-card achievements-card" aria-labelledby="achievements-heading">
          <div className="progress-heading"><h2 id="achievements-heading">Achievements</h2><Trophy size={24} /></div>
          <p className="achievement-news">{news}</p>
          <div className="achievement-stats">
            <div className="achievement-stat"><span className="achievement-number">{stats.finished}</span><span className="achievement-caption">tasks done</span></div>
            <div className="achievement-stat"><span className="achievement-number">{stats.streak}</span><span className="achievement-caption">day streak</span></div>
            <div className="achievement-stat"><span className="achievement-number">{stats.clearedDays}</span><span className="achievement-caption">days cleared</span></div>
          </div>
          <h3 className="achievement-subhead">Recently finished</h3>
          {stats.recent.map((task) => <div key={task.id} className="upcoming-row">
            <span className="upcoming-day">{dayLabel(task.date)}</span>
            <span className="upcoming-title">{task.title}</span>
            <span className="upcoming-tag">{task.tag}</span>
          </div>)}
          {!stats.recent.length && <p className="empty-list">Nothing finished yet — tick a task to start your tally.</p>}
        </aside>
      </div>
      {celebrated && <div className="celebrate-overlay" role="dialog" aria-modal="true" aria-labelledby="celebrate-heading" onClick={() => setCelebrated(false)}>
        <div className="celebrate-card" onClick={(event) => event.stopPropagation()}>
          <img className="celebrate-bug" src={bigLadybug.url} alt="" />
          <h2 id="celebrate-heading">Day cleared!</h2>
          <p className="celebrate-news">{dateLabel}: every task on this day is ticked off — the list is all yours.</p>
          <div className="achievement-stats celebrate-stats">
            <div className="achievement-stat"><span className="achievement-number">{doneToday}</span><span className="achievement-caption">tasks done today</span></div>
            <div className="achievement-stat"><span className="achievement-number">{stats.streak}</span><span className="achievement-caption">day streak</span></div>
            <div className="achievement-stat"><span className="achievement-number">{stats.clearedDays}</span><span className="achievement-caption">days cleared</span></div>
          </div>
          <Button variant="nest" onClick={() => setCelebrated(false)}>Nice — keep going</Button>
        </div>
      </div>}
    </div>
  </main>;
}
