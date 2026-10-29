# NestTask

A comfortable home for your tasks — a to-do web app built as a school project.

This repository contains two copies of the same app:

| Folder | What it is | How to use it |
| --- | --- | --- |
| `website/` | The finished app, ready to open | Double-click `website/index.html` in any browser (Chrome, Edge, Firefox, Safari). No install, no internet needed. |
| `source-code/` | The original project it was built from | React + TypeScript + Tailwind CSS on TanStack Start. Run `bun install` then `bun run dev`. |

## What the app does

- **Welcome screen** — continue as a guest.
- **Dashboard** — tasks grouped under their tag (Personal, School, Home, Kids), with an Active list and a Completed list. Click a task's circle or its name to tick it off; it moves to the Completed list and the progress bar grows.
- **Day's progress** — a percentage and an animated bar for the day you are viewing.
- **Coming up** — the next three tasks after the day you are viewing.
- **Achievements** — tasks done, day streak, days cleared, and your last three finished tasks.
- **Day cleared pop-up** — when the last open task of a day is ticked, a celebration card appears with that day's tally.
- **Create / edit task** — pick a date from a calendar, write the task, choose a tag.
- **Settings** — light or dark mode, four colour themes, four fonts, rounded or square corners, plus clear-completed and reset actions.

## Screens in the source code

| Screen | File |
| --- | --- |
| Welcome | `source-code/src/routes/index.tsx` |
| Dashboard | `source-code/src/routes/dashboard.tsx` |
| Create / edit task | `source-code/src/routes/create-task.tsx` |
| Settings | `source-code/src/routes/settings.tsx` |
| All styling and themes | `source-code/src/styles.css` |
| Task data and scoring | `source-code/src/lib/tasks.tsx` |
| Theme handling | `source-code/src/lib/theme.tsx` |

## Running the source code

You need [Bun](https://bun.com) or Node.js.

```sh
cd source-code
bun install
bun run dev
```

Then open the address it prints (usually `http://localhost:8080`).

Tests: `bun run test`

## Notes

- Tasks live in the browser session, so the list starts fresh from the sample tasks each time you reopen the app.
- Sign-in is not connected — the app runs as a guest.
- The ladybug logo and all icons are in `website/images/` and `source-code/public/images/`.
