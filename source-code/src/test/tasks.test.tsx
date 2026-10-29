import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { TasksProvider, useTasks, progress, achievements, today, addDays } from "@/lib/tasks";

describe("Guest tasks", () => {
  it("creates, edits, completes, reopens and deletes a task", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksProvider });
    act(() => result.current.saveTask({ title: "  Write a design brief  ", tag: "School", date: "2026-10-28" }));
    const id = result.current.tasks.find((task) => task.title === "Write a design brief")?.id;
    if (!id) throw new Error("Task was not created");
    expect(result.current.tasks.find((task) => task.id === id)).toMatchObject({ title: "Write a design brief", tag: "School", date: "2026-10-28", completed: false });
    act(() => result.current.saveTask({ title: "Updated brief", tag: "Home", date: "2026-10-29" }, id));
    expect(result.current.tasks.find((task) => task.id === id)).toMatchObject({ title: "Updated brief", tag: "Home", date: "2026-10-29" });
    act(() => result.current.toggleTask(id));
    expect(result.current.tasks.find((task) => task.id === id)?.completed).toBe(true);
    act(() => result.current.toggleTask(id));
    expect(result.current.tasks.find((task) => task.id === id)?.completed).toBe(false);
    act(() => result.current.deleteTask(id));
    expect(result.current.tasks.find((task) => task.id === id)).toBeUndefined();
    expect(result.current.tasks).toHaveLength(16);
  });
  it("does not create whitespace-only tasks", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksProvider });
    act(() => result.current.saveTask({ title: "  ", tag: "Personal", date: "2026-10-28" }));
    expect(result.current.tasks).toHaveLength(16);
    expect(result.current.tasks.some((task) => task.title.trim() === "")).toBe(false);
  });
  it("spreads starter tasks over the three days before and after today", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksProvider });
    expect(result.current.tasks).toHaveLength(16);
    expect(result.current.tasks.filter((task) => task.completed)).toHaveLength(6);
    expect(result.current.tasks.filter((task) => task.date === today())).toHaveLength(6);
    const days = new Set(result.current.tasks.map((task) => task.date));
    expect(days).toEqual(new Set([-3, -2, -1, 0, 1, 2, 3].map((offset) => addDays(today(), offset))));
    expect(progress(result.current.tasks)).toBe(38);
  });
  it("moves a completed task into the completed list and lifts progress", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksProvider });
    const active = result.current.tasks.find((task) => !task.completed);
    if (!active) throw new Error("No active task to complete");
    act(() => result.current.toggleTask(active.id));
    expect(result.current.tasks.filter((task) => task.completed)).toHaveLength(7);
    expect(result.current.tasks.filter((task) => !task.completed)).toHaveLength(9);
    expect(result.current.tasks.find((task) => task.id === active.id)?.completed).toBe(true);
    expect(result.current.movedId).toBe(active.id);
    expect(progress(result.current.tasks)).toBe(44);
  });
  it("counts finished tasks, cleared days and the current streak for the achievements card", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksProvider });
    const stats = achievements(result.current.tasks, today());
    expect(stats.finished).toBe(6);
    expect(stats.clearedDays).toBe(3);
    expect(stats.streak).toBe(3);
    expect(stats.recent.map((task) => task.date)).toEqual([today(), today(), addDays(today(), -1)]);
    const todaysOpen = result.current.tasks
      .filter((task) => task.date === today() && !task.completed)
      .map((task) => task.id);
    todaysOpen.forEach((id) => act(() => result.current.toggleTask(id)));
    expect(achievements(result.current.tasks, today()).clearedDays).toBe(4);
    expect(achievements(result.current.tasks, today()).streak).toBe(3);
  });
  it("saves a task on the day picked in the form", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksProvider });
    const chosen = addDays(today(), 5);
    const todaysBefore = result.current.tasks.filter((task) => task.date === today()).length;
    act(() => result.current.saveTask({ title: "Sort the garage shelves", tag: "Home", date: chosen }));
    const saved = result.current.tasks.find((task) => task.title === "Sort the garage shelves");
    expect(saved?.date).toBe(chosen);
    expect(result.current.tasks.filter((task) => task.date === chosen)).toHaveLength(1);
    expect(result.current.tasks.filter((task) => task.date === today())).toHaveLength(todaysBefore);
  });
  it("clears completed tasks and resets back to the starter list", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksProvider });
    act(() => result.current.clearCompleted());
    expect(result.current.tasks).toHaveLength(10);
    expect(result.current.tasks.every((task) => !task.completed)).toBe(true);
    act(() => result.current.resetTasks());
    expect(result.current.tasks).toHaveLength(16);
    expect(result.current.tasks.filter((task) => task.completed)).toHaveLength(6);
  });
});
