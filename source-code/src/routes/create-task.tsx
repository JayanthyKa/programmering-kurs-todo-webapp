import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTasks, tags, today, type Tag } from "@/lib/tasks";
import ladybug from "@/assets/ladybug-small.png.asset.json";

export const Route = createFileRoute("/create-task")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () => ({ meta: [
    { title: "Create a task · NestTask" }, { name: "description", content: "Add a task on any day and organize it with a NestTask tag." },
    { property: "og:title", content: "Create a task · NestTask" }, { property: "og:description", content: "Give your next task a comfortable home." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: CreateTask,
});
function CreateTask() {
  const { id } = Route.useSearch();
  const { tasks, saveTask } = useTasks();
  const existing = tasks.find((task) => task.id === id);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [tag, setTag] = useState<Tag>(existing?.tag ?? "Personal");
  const [date, setDate] = useState(existing?.date ?? today());
  const [error, setError] = useState("");
  const navigate = useNavigate();
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) { setError("Please enter a task."); return; }
    saveTask({ title, tag, date }, existing?.id);
    void navigate({ to: "/dashboard" });
  }
  return <main className="editor-page">
    <h1 className="editor-greeting">Hi Guest,<img className="ladybug" src={ladybug.url} alt="" /></h1>
    <form className="editor-panel" onSubmit={submit}>
      <div className="editor-date">
        <span className="editor-label" id="task-date-label">Select date</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="nestSecondary" className="editor-date-trigger" aria-labelledby="task-date-label task-date-value">
              <CalendarIcon size={22} /><span id="task-date-value">{format(parseISO(date), "EEE d MMM yyyy")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={parseISO(date)} onSelect={(day) => day && setDate(format(day, "yyyy-MM-dd"))} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>
      <label className="editor-label" htmlFor="task-title">To-do List</label>
      <div className="editor-input-wrap"><input id="task-title" className="editor-input" value={title} autoComplete="off" onChange={(event) => { setTitle(event.target.value); setError(""); }} aria-invalid={!!error} aria-describedby={error ? "task-error" : undefined} /><Button variant="nestIcon" type="submit" title={existing ? "Save task" : "Create task"} aria-label={existing ? "Save task" : "Create task"}><PlusCircle size={26} /></Button></div>
      {error && <p className="form-error" id="task-error" role="alert">{error}</p>}
      <fieldset className="editor-tags"><legend className="editor-label">Tags</legend><div className="editor-tag-options">{tags.map((value) => <Button variant="nestTag" key={value} type="button" aria-pressed={tag === value} onClick={() => setTag(value)}>{value}</Button>)}</div></fieldset>
      <div className="editor-footer"><Button variant="nest" type="submit">{existing ? "Save" : "Create"}</Button><Button variant="ghost" asChild><Link to="/dashboard">Cancel</Link></Button></div>
    </form>
  </main>;
}
