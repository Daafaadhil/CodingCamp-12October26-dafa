# To-Do List Life Dashboard

> A clean, minimal personal dashboard to help you stay organized, focused, and productive all in one page.

---

## Project Overview

**Life Dashboard** is a browser-based productivity tool built with pure HTML, CSS, and Vanilla JavaScript. No frameworks, no backend, no setup just open and use.

It combines four core tools in one place:

- A live **clock & greeting** to start your day
- A **25-minute focus timer** (Pomodoro-style)
- A **to-do list** to track your tasks
- **Quick links** to your favorite websites

All data is stored locally in the browser using the **LocalStorage API**, so everything persists across sessions without needing a server.

---

## Technology Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Structure | HTML5                                   |
| Styling   | CSS3 (Custom Properties, Flexbox, Grid) |
| Logic     | Vanilla JavaScript (ES6+)               |
| Storage   | Browser LocalStorage API                |
| Hosting   | GitHub Pages                            |

---

## Project Structure

```
CodingCamp-12October26-dafa/
├── index.htm
├── css/
│   └── style.cs
├── js/
│   └── app.j
├── .kiro/
│   └── steering/
│       └── project.md
└── .gitignore
```

---

## eatures

### reeting & Clock

- Displays live time (HH:MM:SS) and full date
- Greeting message changes based on time of day:
  - **Good Morning** — 05:00 to 11:59
  - **Good Afternoon** — 12:00 to 16:59
  - **Good Evening** — 17:00 to 20:59
  - **Good Night** — 21:00 to 04:59

### Focus Timer

- Fixed **25-minute** Pomodoro timer
- **Start**, **Stop**, and **Reset** controls
- Alert notification when the session ends

### To-Do List

- Add new tasks with a single click or Enter key
- Edit existing tasks inline
- Mark tasks as complete with a checkbox
- Delete tasks individually
- All tasks saved to **LocalStorage**

### Quick Links

- Add custom links with a name and URL
- Auto-detects icon based on the website (Google, YouTube, GitHub, etc.)
- Default links: Google, YouTube, GitHub
- Delete links anytime
- Links saved to **LocalStorage**

---

## Design System

| Property      | Value                                |
| ------------- | ------------------------------------ |
| Primary Color | `#2ecc71` (Emerald Green)            |
| Primary Dark  | `#27ae60`                            |
| Primary Light | `#a8e6cf`                            |
| Background    | `#f0f9f4` (light) / `#1a1a2e` (dark) |
| Font          | Segoe UI, Tahoma, Verdana            |

---

## Challenges Implemented

| #   | Challenge          | Description                                                      |
| --- | ------------------ | ---------------------------------------------------------------- |
| 1   | Light / Dark Mode  | Toggle between light and green-dark theme, saved to localStorage |
| 2   | Custom Name        | User can set their name to personalize the greeting              |
| 3   | Prevent Duplicates | Warning shown if a task with the same name already exists        |

---

## Author

**Daafaadhil**
RevoU Coding Camp — October 2026
