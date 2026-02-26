# Kanban Board

A responsive Kanban board built with React, TypeScript, and Vite. Tasks are organized into columns, support drag & drop, infinite scroll, local search, and are cached via React Query with shared state managed by Zustand.

---

## Tech Stack

| Layer                   | Library                      |
| ----------------------- | ---------------------------- |
| Framework               | React 18 + Vite + TypeScript |
| Styling                 | Tailwind CSS + MUI v5        |
| Data fetching & caching | TanStack React Query v5      |
| Global state            | Zustand                      |
| Drag & drop             | @dnd-kit                     |
| Animations              | Framer Motion                |
| Mock API                | json-server                  |

---

## Prerequisites

Make sure you have one of the following installed:

- **Node.js** v18+ with `npm` — [nodejs.org](https://nodejs.org)
- **Bun** (optional, faster) — [bun.sh](https://bun.sh)

---

## Getting Started

### 1. Clone or unzip the project

```bash
cd kanban-board
```

### 2. Install dependencies

```bash
# with npm
npm install

# or with bun
bun install
```

### 3. Start the mock API server

The app uses `json-server` as a local REST API on port **4000**. Open a terminal and run:

```bash
# with npm
npm run server

# or with bun
bun run server
```

You should see:

```
JSON Server started on PORT :4000
```

> Keep this terminal running. The server reads from `db.json` in the project root.

### 4. Start the development server

Open a **second terminal** and run:

```bash
# with npm
npm run dev

# or with bun
bun run dev
```

Then open your browser at:

```
http://localhost:5173
```

---

## Available Scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the Vite dev server (port 5173)  |
| `npm run server`  | Start json-server mock API (port 4000) |
| `npm run build`   | Type-check and build for production    |
| `npm run preview` | Preview the production build locally   |

---

## Project Structure

```
kanban-board/
├── db.json                        # Mock database (json-server)
├── src/
│   ├── main.tsx                   # App entry — QueryClient + providers
│   ├── app.tsx                    # Root component
│   ├── index.css                  # Global styles
│   ├── store/
│   │   └── use-board-store.ts     # Zustand store (search query)
│   ├── hooks/
│   │   ├── use-tasks.ts           # React Query hooks + local filtering
│   │   └── use-debounce.ts        # Debounce utility hook
│   ├── services/
│   │   └── task-service.ts        # Axios API calls
│   ├── types/
│   │   └── index.ts               # TypeScript types & constants
│   ├── pages/
│   │   └── board-page.tsx         # Main board page
│   └── components/
│       ├── board/
│       │   ├── navbar.tsx         # Header with search bar + task count
│       │   ├── kanban-board.tsx   # DnD context + column layout
│       │   └── kanban-column.tsx  # Column with infinite scroll
│       ├── task/
│       │   ├── task-card.tsx      # Draggable task card
│       │   └── add-task-form.tsx  # Inline task creation form
│       └── ui/
│           └── priority-badge.tsx # HIGH / MEDIUM / LOW badge
```

---

## Features

- **4 columns** — To Do, In Progress, In Review, Done
- **Drag & drop** — move and reorder tasks across columns
- **Infinite scroll** — loads 5 tasks at a time per column as you scroll
- **Search** — filters tasks by title or description locally (no API call on each keystroke)
- **Caching** — React Query caches each column's tasks for 5 minutes
- **Global state** — search query shared across components via Zustand
- **Priority badges** — HIGH, MEDIUM, LOW with color coding
- **Animations** — smooth transitions via Framer Motion

---

## How Search Works

Search is entirely **client-side**. When you type in the search bar:

1. The input is debounced (300ms) to avoid unnecessary work
2. The debounced value is written to the **Zustand store**
3. Each column reads the store and filters its **cached tasks** in memory by `title` or `description`
4. No new API requests are made — the full task list per column is already cached by React Query

---

## Troubleshooting

**Tasks not loading**
Make sure the json-server is running on port 4000 before starting the dev server.

**Port conflict on 4000 or 5173**
Change the port in `package.json` for json-server, or in `vite.config.ts` for the dev server.

**`bun` command not found**
Use `npm` instead — all scripts work with both package managers.
