import { createContext, useContext, useState, type ReactNode } from "react";

export const tags = ["Personal", "School", "Home", "Kids"] as const;
export type Tag = (typeof tags)[number];
export type Task = { id: string; title: string; tag: Tag; date: string; completed: boolean };
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function starterTasks(): Task[] {
  const date = today();
  return [
    { id: "past-1", title: "Take out the recycling", tag: "Home", date: addDays(date, -1), completed: true },
    { id: "past-2", title: "Return the library books", tag: "Personal", date: addDays(date, -1), completed: true },
    { id: "past-3", title: "Pay the electricity bill", tag: "Personal", date: addDays(date, -2), completed: true },
    { id: "past-4", title: "Tidy the hall cupboard", tag: "Home", date: addDays(date, -3), completed: true },
    { id: "starter-1", title: "Pack the kids' school bags", tag: "Kids", date, completed: true },
    { id: "starter-2", title: "Water the tomato plants", tag: "Home", date, completed: false },
    { id: "starter-3", title: "Finish the design brief", tag: "School", date, completed: false },
    { id: "starter-4", title: "Book the dentist appointment", tag: "Personal", date, completed: true },
    { id: "starter-5", title: "Fold the laundry", tag: "Home", date, completed: false },
    { id: "starter-6", title: "Read twenty pages of the novel", tag: "Personal", date, completed: false },
    { id: "starter-7", title: "Help with maths homework", tag: "Kids", date: addDays(date, 1), completed: false },
    { id: "starter-8", title: "Submit the history essay", tag: "School", date: addDays(date, 1), completed: false },
    { id: "starter-9", title: "Morning yoga session", tag: "Personal", date: addDays(date, 1), completed: false },
    { id: "starter-10", title: "Clean the kitchen shelves", tag: "Home", date: addDays(date, 2), completed: false },
    { id: "starter-11", title: "Revise for the science quiz", tag: "School", date: addDays(date, 2), completed: false },
    { id: "starter-12", title: "Plan the weekend picnic", tag: "Kids", date: addDays(date, 3), completed: false },
  ];
}
export function progress(tasks: Task[]) {
  return tasks.length ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0;
}
export function achievements(tasks: Task[], date: string) {
  const finished = tasks.filter((task) => task.completed);
  const days = [...new Set(tasks.map((task) => task.date))].sort();
  const clearedDays = days.filter((day) => tasks.filter((task) => task.date === day).every((task) => task.completed));
  let streak = 0;
  let cursor = addDays(date, -1);
  while (clearedDays.includes(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  const recent = finished
    .filter((task) => task.date <= date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  return { finished: finished.length, clearedDays: clearedDays.length, streak, recent };
}
type TasksContextValue = {
  tasks: Task[];
  movedId: string | null;
  saveTask: (task: Omit<Task, "id" | "completed">, id?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
  resetTasks: () => void;
};
const TasksContext = createContext<TasksContextValue | null>(null);
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [movedId, setMovedId] = useState<string | null>(null);
  const saveTask: TasksContextValue["saveTask"] = (task, id) => {
    if (!task.title.trim()) return;
    const clean = { ...task, title: task.title.trim() };
    setTasks((previous) => id
      ? previous.map((item) => item.id === id ? { ...item, ...clean } : item)
      : [...previous, { ...clean, id: crypto.randomUUID(), completed: false }]);
  };
  const markMoved = (id: string) => {
    setMovedId(id);
    window.setTimeout(() => setMovedId((current) => (current === id ? null : current)), 700);
  };
  return <TasksContext.Provider value={{ tasks, movedId, saveTask,
    toggleTask: (id) => {
      setTasks((previous) => previous.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
      markMoved(id);
    },
    deleteTask: (id) => setTasks((previous) => previous.filter((task) => task.id !== id)),
    clearCompleted: () => setTasks((previous) => previous.filter((task) => !task.completed)),
    resetTasks: () => setTasks(starterTasks()),
  }}>{children}</TasksContext.Provider>;
}
export function useTasks() {
  const value = useContext(TasksContext);
  if (!value) throw new Error("Tasks must be used inside TasksProvider");
  return value;
}
