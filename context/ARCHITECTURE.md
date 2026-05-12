# Architecture Context — macOS Porto

A macOS-inspired interactive portfolio application with draggable window management, built to showcase projects and professional content in an immersive, desktop-like environment.

---

## Stack

| Layer          | Technology                                  | Role                                                    |
|----------------|---------------------------------------------|---------------------------------------------------------|
| Framework      | React 19.2 + Vite 8                         | Component-based UI rendering with fast HMR             |
| Styling        | Tailwind CSS 4.2 + CSS Modules              | Utility-first styling + component-scoped styles        |
| State Management| Zustand 5.0 + Immer middleware             | Lightweight global state (windows, location tracking)  |
| Animations     | GSAP 3.15 + Draggable plugin                | Window animations, interactions, and drag handling     |
| UI Components  | Lucide React + React Tooltip                | Icons and tooltip interactions                         |
| Document Export| React-PDF + React-to-PDF                    | Resume PDF viewing and download functionality          |
| Build Tool     | Vite 8 + ESLint 10                          | Development server, production bundling, code quality  |
| Runtime        | React DOM 19.2                              | DOM rendering and React mounting                       |
| Utilities      | Clsx, DayJS, Immer                          | Class merging, date handling, immutable state updates   |

---

## System Boundaries

- **`src/components/`** — Shared UI components (Navbar, Welcome, Dock, Home, WindowControls). Responsible for top-level layout, navigation controls, and application chrome.

- **`src/windows/`** — Window applications (Finder, Safari, Terminal, Resume, Contact, Photos, Text, Image). Each is a draggable, independently managed window component that wraps actual content.

- **`src/store/`** — Global state management. `Window.js` controls window visibility, z-index stacking, and data passing. `Location.js` tracks active portfolio location/context.

- **`src/hoc/`** — `WindowWrapper.jsx` is a higher-order component that enhances window components with GSAP animations (open/close), draggable behavior, and z-index focus management.

- **`src/constants/`** — Configuration constants: window definitions, dock apps, nav links, icons, and z-index defaults.

- **`public/`** — Static assets (icons, images, files) served without processing.

- **`src/assets/`** — Project-specific assets bundled into the application.

---

## Storage Model

- **Application State (Zustand Stores)**: 
  - Window metadata: open/closed status, z-index stacking order, window-specific data
  - Location context: active portfolio section ("work", etc.)
  - State mutations use Immer to enable immutable, predictable updates

- **Static Configuration (Constants)**:
  - Window definitions (id, title, initial state)
  - Navigation links and dock apps
  - Icon mappings and z-index defaults

- **Static Assets (Files)**:
  - PNG/SVG icons and images (`public/icons/`, `public/images/`)
  - Static files for download (e.g., resume PDF in `public/files/`)

- **No Persistent Backend Storage**: This is a frontend-only portfolio. All state is ephemeral (lost on page refresh).

---

## Auth and Access Model

- **No Authentication**: This is a public portfolio site. No login required.
- **No Access Control**: All content is publicly accessible to all visitors.
- **Single User Context**: Portfolio owner's information and projects; no multi-user support.
- **No Data Persistence**: No user data, sessions, or accounts tracked.

---

## Key Patterns & Invariants

1. **Windows are managed by Zustand store** — Only `useWindowStore` can open, close, or focus windows. All window state mutations go through this single source of truth.

2. **Z-index is strictly managed** — The store maintains `nextZIndex` counter; each window focus increments it. Windows must not set z-index directly via CSS; they rely on store values.

3. **WindowWrapper HOC handles animation lifecycle** — Windows wrapped with `WindowWrapper()` automatically get GSAP animations on open/close and Draggable behavior. Raw window components should not implement these separately.

4. **Window data is immutable during transit** — Data passed to windows (e.g., via `openWindow(windowKey, data)`) is considered immutable; modifications inside windows should use local state, not mutate the store directly unless intended as global.

5. **Static assets are imported/referenced, not fetched** — Images and icons are referenced from `public/` and bundled by Vite. No runtime asset fetching.

6. **Location store is independent of window state** — Location (active portfolio section) can change without affecting window open/close state; they're orthogonal concerns.

7. **GSAP animations are cleanup-safe** — All GSAP contexts and Draggable instances must be killed in cleanup to prevent memory leaks and duplicate handlers.

8. **Tailwind + CSS Modules coexist** — Tailwind classes are used for utility styling; component-specific scoped styles use CSS modules for component isolation and reusability.

---

## Data Flow Diagram

```
User Interaction (click dock app / nav link)
         ↓
Dock.jsx / Navbar.jsx dispatches to useWindowStore
         ↓
useWindowStore updates window state (isOpen, zIndex, data)
         ↓
WindowWrapper HOC detects isOpen change
         ↓
GSAP animation triggers (scale, opacity, y)
         ↓
Draggable plugin enables window drag behavior
         ↓
focusWindow() increments zIndex on mouse press
         ↓
Visual z-index reflects focused window
```

---

## Performance & Scalability Considerations

- **GSAP Optimization**: Draggable instances are scoped per window and killed on unmount to prevent memory leaks.
- **Immer Middleware**: Simplifies state mutations but adds a small overhead; acceptable for this project's scale.
- **CSS-in-JS Overhead**: Tailwind's utility-first approach minimizes CSS bloat; scoped CSS modules prevent cascade issues.
- **Window Limit**: Currently ~10-12 windows are hardcoded. Adding dynamic window creation would require refactoring constants → config generator.

---

## Future Extension Points

1. **Persistent State**: Integrate localStorage or URL params to preserve window positions, open/close state across sessions.
2. **Dynamic Windows**: Load window definitions from JSON/API instead of hardcoded constants.
3. **Theme Switching**: Already has mode icon in navbar; could store theme preference in Location store or localStorage.
4. **Multi-Language Support**: i18n library could replace hardcoded strings in constants and components.
5. **Mobile Responsiveness**: Current drag/z-index model is desktop-only; would need touch event handling and responsive layout.
6. **Analytics**: Track which windows/sections users visit most (privacy-respecting).
7. **Content Management**: Decouple content from components (e.g., Markdown parser for Terminal output, JSON-driven contact form).
8. **PWA Features**: Offline caching, add-to-home-screen for mobile portfolio experience.
