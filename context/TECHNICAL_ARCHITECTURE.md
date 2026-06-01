# macOS Porto - Technical Architecture & System Design

## 🏗️ System Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User Browser                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              React Application (App.tsx)                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│           │                                                         │
│           ├─── Components Layer ──────────────────────────┐         │
│           │    ├── Navbar (Navigation)                   │         │
│           │    ├── Dock (App Launcher)                   │         │
│           │    ├── Welcome (Splash Screen)               │         │
│           │    ├── Home (Desktop)                        │         │
│           │    └── WindowControls                        │         │
│           │                                              │         │
│           ├─── Windows Layer (Draggable Apps) ──────────┤         │
│           │    ├── Finder                                │         │
│           │    ├── Safari                                │         │
│           │    ├── Terminal                              │         │
│           │    ├── Resume                                │         │
│           │    ├── Contact                               │         │
│           │    ├── Photos                                │         │
│           │    ├── Text                                  │         │
│           │    └── Image                                 │         │
│           │                                              │         │
│           ├─── Hooks Layer (useWindow) ─────────────────┤         │
│           │    └── useWindow (Animation + Drag + State)  │         │
│           │                                              │         │
│           ├─── State Management Layer (Zustand) ────────┤         │
│           │    ├── Window Store                          │         │
│           │    │   ├── windows: {}                       │         │
│           │    │   ├── nextZIndex                        │         │
│           │    │   └── methods                           │         │
│           │    ├── Location Store                        │         │
│           │    │   ├── activeLocation                    │         │
│           │    │   └── methods                           │         │
│           │    │                                         │         │
│           │    └── Wallpaper Store                       │         │
│           │        ├── wallpaper path                    │         │
│           │        └── setWallpaper()                    │         │
│           │                                              │         │
│           ├─── Animation Layer (GSAP) ─────────────────┤         │
│           │    ├── Draggable Plugin                      │         │
│           │    ├── Desktop animations (0.35-0.5s)       │         │
│           │    ├── Mobile animations (0.25-0.35s)       │         │
│           │    └── useGSAP Hook integration              │         │
│           │                                              │         │
│           ├─── Styling Layer ──────────────────────────┤         │
│           │    ├── Tailwind CSS (v4.2.4)                │         │
│           │    └── CSS Modules (legacy)                  │         │
│           │                                              │         │
│           └─── Constants & Configuration ───────────────┤         │
│                ├── Window Config                         │         │
│                ├── Navigation Links                      │         │
│                ├── Blog Posts                            │         │
│                ├── Tech Stack                            │         │
│                ├── Photos                                │         │
│                ├── Contact/Socials                       │         │
│                └── Terminal Commands                     │         │
│                                                          │         │
└──────────────────────────────────────────────────────────────────┘

         │
         ▼

┌─────────────────────────────────────────────────────────────────────┐
│                   Static Assets (Public Folder)                    │
├─────────────────────────────────────────────────────────────────────┤
│  • Icons (WiFi, search, user, etc.)                                 │
│  • Images (wallpaper, app icons, gallery)                           │
│  • Files (resume.pdf)                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Architecture

### Component → Store → Render Cycle

```
┌──────────────────────────────────────────────────────────────────┐
│  USER INTERACTION                                                │
│  (Click dock icon, nav link, or folder)                          │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  COMPONENT DISPATCH                                              │
│  Example: Dock.tsx calls openWindow("finder")                   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  ZUSTAND STATE UPDATE                                            │
│  Window Store: windows.finder.isOpen = true                      │
│                windows.finder.zIndex = nextZIndex++              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  RE-RENDER (React)                                               │
│  Component receives updated state from Zustand                   │
│  useWindow hook dependencies trigger (isOpen, isMinimized)       │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  useWindow HOOK LOGIC                                            │
│  useGSAP detects state changes and runs appropriate animation    │
│  Animation type determined: open, restore, minimize, maximize    │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  GSAP ANIMATION                                                  │
│  useWindow hook triggers animation via useGSAP                   │
│  Desktop: scale 0.8→1, opacity 0→1 (0.35-0.5s, power3.out)      │
│  Mobile: slide from bottom y: 100dvh→0 (0.25s)                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  DRAGGABLE SETUP                                                 │
│  useWindow creates Draggable instance on window container        │
│  onPress triggers focusWindow() to bring to front               │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  WINDOW APPEARS                                                  │
│  User sees animated window on screen                             │
│  Window is now draggable and interactive                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 Component Dependency Tree

```
App.tsx (Root)
│
├── Layout Components
│   ├── Navbar.tsx
│   │   ├── dayjs (time formatting)
│   │   └── useWindowStore (openWindow)
│   │
│   ├── Welcome.tsx
│   │   └── useGSAP (font weight animation)
│   │
│   ├── Dock.tsx
│   │   ├── useWindowStore (windows state)
│   │   ├── useGSAP (icon hover scaling)
│   │   └── gsap (animations)
│   │
│   └── Home.tsx
│       ├── useLocationStore (folder navigation)
│       ├── useWindowStore (openWindow)
│       └── useGSAP (draggable folders)
│
├── Window Components
│   ├── Finder.tsx
│   │   ├── useWindow Hook
│   │   ├── WindowControls
│   │   ├── useLocationStore (folder hierarchy)
│   │   └── useWindowStore (open windows)
│   │
│   ├── Safari.tsx
│   │   ├── useWindow Hook
│   │   ├── WindowControls
│   │   └── lucide-react (icons)
│   │
│   ├── Terminal.tsx
│   │   ├── useWindow Hook
│   │   ├── WindowControls
│   │   └── techStack constants
│   │
│   ├── Resume.tsx
│   │   ├── useWindow Hook
│   │   ├── WindowControls
│   │   ├── react-pdf (PDF viewer)
│   │   └── lucide-react (download icon)
│   │
│   ├── Contact.tsx
│   │   ├── useWindow Hook
│   │   ├── WindowControls
│   │   └── socials constants
│   │
│   ├── Photos.tsx
│   │   ├── useWindow Hook
│   │   └── WindowControls
│   │
│   ├── Text.tsx
│   │   ├── useWindow Hook
│   │   └── WindowControls
│   │
│   └── Image.tsx
│       ├── useWindow Hook
│       └── WindowControls
│
├── Custom Hooks
│   ├── useWindow (Animation + Draggable + State)
│   │   ├── useGSAP for animations
│   │   ├── Draggable.create() for drag behavior
│   │   ├── useLayoutEffect for z-index
│   │   └── useDevice for responsive behavior
│   │
│   ├── useDevice (Mobile/responsive detection)
│   │
│   └── Hooks from @gsap/react
│
├── Global State (Zustand)
│   ├── Window.ts (useWindowStore)
│   │   ├── WINDOW_CONFIG (initial state)
│   │   ├── INITIAL_Z_INDEX
│   │   └── Immer middleware
│   │
│   ├── Location.ts (useLocationStore)
│   │   ├── activeLocation
│   │   └── Immer middleware
│   │
│   └── Wallpaper.ts (useWallpaperStore)
│       ├── wallpaper path
│       └── Persist middleware
│
├── Constants
│   ├── system.ts (INITIAL_Z_INDEX, WINDOW_CONFIG)
│   ├── finder.ts (location hierarchy, projects)
│   ├── safari.ts (blog posts)
│   ├── terminal.ts (tech stack)
│   ├── photos.ts (gallery categories)
│   ├── contact.ts (socials, email)
│   └── index.ts (re-exports)
│
├── Styling
│   ├── index.css (Tailwind + custom utilities)
│   └── App.css (legacy styles)
│
└── Assets
    └── src/assets/ (bundled images, fonts)
```

---

## 🎬 Animation State Machine

### Window Lifecycle with Animations

```
[CLOSED] ──────────────────────────────────────────────────────── [MINIMIZED]
  │                                                                  ▲
  │ openWindow(key)                                    minimizeWindow(key)
  │ • isOpen = true, isMinimized = false              • isMinimized = true
  │ • zIndex = nextZIndex++                           • animateToDock(): 0.4s
  │ • Animation: Desktop/Mobile                       • Saves lastPosition
  │                                                    │
  ▼                                                    │
[OPENING ANIMATION]                                    │
  │                                                    │
  ├─ DESKTOP (not mobile, not maximized):            │
  │  • scale: 0.8 → 1 (0.35s)                        │
  │  • opacity: 0 → 1 (0.35s)                        │
  │  • y: depends on position (40px offset)          │
  │  • ease: power3.out                              │
  │                                                   │
  ├─ MOBILE: ─────────────────────────────────────────┤
  │  • slide up from bottom: y: 100dvh → 0           │
  │  • opacity: 0 → 1 (0.25s)                        │
  │  • width: 100dvw, height: calc(100dvh - navbar)  │
  │  • ease: power3.out                              │
  │                                                   │
  └─ or FROM DOCK (restore):                          │
     • animateFromDock(): 0.4s back to lastPosition   │
                                                       │
  ▼                                                   │
[OPEN - NORMAL]                                        │
  │ • isOpen = true, isMinimized = false             │
  │ • Draggable enabled                              │
  │ • User can drag window                           │
  │ • focusWindow(key) brings to front               │
  │ • zIndex = nextZIndex++ (on drag press)          │
  │                                                   │
  ├─ maximizeWindow(key)                             │
  │ • isMaximized = true                             │
  │ • Animation: 0.35s scale to fullscreen           │
  │ • Draggable disabled                             │
  ▼                                                   │
[OPEN - MAXIMIZED]                                    │
  │ • width: 100vw, height: 100vh                    │
  │ • position: 0, 0 (top-left)                      │
  │ • borderRadius: 12px                             │
  │ • Draggable disabled                             │
  │                                                   │
  ├─ Un-maximize by clicking green button             │
  │ • Restores to savedWindowConfig                  │
  │ • lastPosition retrieved                         │
  │ • Duration: 0.5s (power4.out)                    │
  │ • Draggable re-enabled                           │
  ▼                                                   │
[OPEN - NORMAL]                                       │
  │ Back to normal window mode ◄─────────────────────┘
  │
  │ Or: minimizeWindow(key)
  │ • isMinimized = true
  │ • animateToDock(): 0.4s
  │
  ├─ restoreWindow(key) ◄─────────────────────────────┤
  │ • isMinimized = false                             │ Minimized
  │ • zIndex = nextZIndex++                           │
  │ • animateFromDock(): 0.4s back to lastPosition    │
  │ • Duration: 0.4s (power3.out)                     │
  │
  └─────────────────────────────────────────────────→ [OPEN]
  │
  │ closeWindow(key)
  │ • isOpen = false
  │ • isMinimized = false
  │ • zIndex = INITIAL_Z_INDEX
  │ • data = null
  │
  ▼
[CLOSING ANIMATION]
  │
  ├─ DESKTOP: Reverses opening animation
  │  • scale: 1 → 0.8 (0.35s)
  │  • opacity: 1 → 0 (0.35s)
  │  • y: return to origin (0 → 40px offset)
  │  • ease: power3.out
  │
  └─ MOBILE: Slide down to bottom
     • y: 0 → 100dvh (0.25s)
     • opacity: 1 → 0
     • ease: power3.out
     • display: none, visibility: hidden
  │
  ▼
[CLOSED] ◄─────────────────────────────────────────────────────────────
```

**Key Animation Differences:**

| Scenario          | Duration  | Easing       | Platform       |
| ----------------- | --------- | ------------ | -------------- |
| Open (new)        | 0.35-0.5s | power3.out   | Desktop        |
| Open (mobile)     | 0.25s     | power3.out   | Mobile         |
| Restore from dock | 0.4s      | power3.out   | Desktop/Mobile |
| Minimize to dock  | 0.4s      | power3.out   | Desktop/Mobile |
| Maximize          | 0.35s     | power3.inOut | Desktop        |
| Un-maximize       | 0.5s      | power4.out   | Desktop        |
| Close             | 0.35-0.5s | power3.out   | Desktop/Mobile |

---

## 🧠 State Management Architecture

### Zustand Store Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     useWindowStore                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  windows: {                                                     │
│    finder: {                                                    │
│      isOpen: boolean,                                           │
│      zIndex: number,                                            │
│      isMinimized: boolean,                                      │
│      data: any,                                                 │
│      windowPosition: "top-10 left-20",                          │
│      windowSize: { width: 800, height: 600 }                    │
│    },                                                           │
│    safari: { ... },                                             │
│    terminal: { ... },                                           │
│    resume: { ... },                                             │
│    contact: { ... },                                            │
│    photos: { ... },                                             │
│    text: { ... },                                               │
│    image: { ... }                                               │
│  }                                                              │
│                                                                 │
│  nextZIndex: 11  (starts at INITIAL_Z_INDEX + 1)               │
│                                                                 │
│  Methods:                                                       │
│  ├── openWindow(key, data?) → Opens window, increments zIndex   │
│  ├── closeWindow(key) → Closes window, resets zIndex            │
│  ├── focusWindow(key) → Brings to front (increments zIndex)     │
│  ├── minimizeWindow(key) → Hides window                         │
│  └── restoreWindow(key) → Unhides window, increments zIndex     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   useLocationStore                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  activeLocation: {                                              │
│    id: "work",                                                  │
│    name: "My Projects",                                         │
│    icon: "/icons/folder.svg",                                   │
│    children: [                                                  │
│      {                                                          │
│        id: "project1",                                          │
│        name: "Project Name",                                    │
│        fileType: "folder",                                      │
│        icon: "/icons/folder.svg",                               │
│        position: "top-20 left-10"                               │
│      },                                                         │
│      // ... more items                                          │
│    ]                                                            │
│  }                                                              │
│                                                                 │
│  Methods:                                                       │
│  ├── setActiveLocation(location) → Navigate to folder           │
│  └── resetActiveLocation() → Go back to default                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  useWallpaperStore                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  wallpaper: "/images/wallpaper-3.webp"                         │
│  (Current background image path)                               │
│                                                                 │
│  Methods:                                                       │
│  └── setWallpaper(path) → Changes background wallpaper         │
│                                                                 │
│  Persistence:                                                   │
│  ├── Uses Zustand persist middleware                            │
│  ├── Stored in localStorage as "wallpaper-storage"             │
│  └── Survives page refresh                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Rendering Pipeline

### Component Rendering Sequence

```
1. App.tsx renders all window components directly
   ├── No wrapper or HOC pattern
   ├── Each window component imported and rendered
   ├── componentRef passed to useWindow hook
   └── All window components mounted (display: hidden initially)

2. Each Window Component → useWindow Hook
   ├── Subscribes to: isOpen, isMinimized, isMaximized, zIndex
   ├── Calls useWindow("windowKey") for containerRef and headerRef
   ├── containerRef gets ref for main container element
   └── headerRef gets ref for window header (for dragging)

3. useWindow Hook Setup
   ├── Sets up multiple useLayoutEffect hooks:
   │   ├── Z-index management
   │   ├── Pointer events (disabled when minimized)
   │   └── Draggable.create() setup
   │
   ├── useGSAP hook monitors dependencies:
   │   ├── isOpen, isMinimized, isMaximized
   │   ├── isMobile (responsive behavior)
   │   └── previousState tracking
   │
   └── Applies different animations based on state:
       ├── Desktop: scale 0.8→1, opacity 0→1 (0.35-0.5s)
       ├── Mobile: slide up from bottom (0.25-0.35s)
       ├── Maximize: full screen transition
       └── Minimize: animate to dock position

4. GSAP Animation Execution
   ├── gsap.killTweensOf() - cleans previous animations
   ├── Checks previousState vs current state
   ├── Gets target dock rect if minimizing/restoring
   ├── Runs appropriate animation sequence
   └── Calls draggable.update() or .enable()/.disable()

5. User Interaction
   ├── Click dock → toggleApp() in store
   ├── Store updates → component re-renders
   ├── useGSAP hook dependencies trigger
   ├── GSAP animation plays
   └── Window appears with smooth animation

6. Screen Update Complete
   ├── useLayoutEffect sets z-index
   ├── useLayoutEffect enables pointer events
   ├── Draggable makes window draggable
   └── User can interact with window
```

---

## 🔗 Event Flow Architecture

### User Action to Screen Update

```
User Clicks Dock Icon
│
├─ Event: onClick handler in Dock.tsx
│
├─ Action Dispatch: toggleApp({ id: "finder", canOpen: true })
│  │
│  ├─ If window.isOpen && !isMinimized → closeWindow("finder")
│  │
│  ├─ If window.isOpen && isMinimized → restoreWindow("finder")
│  │
│  └─ If !window.isOpen → openWindow("finder")
│
├─ Store Mutation (Immer):
│  │
│  └─ set((state) => {
│      state.windows.finder.isOpen = true;
│      state.windows.finder.isMinimized = false;
│      state.windows.finder.zIndex = state.nextZIndex;
│      state.nextZIndex++;
│    })
│
├─ React Re-render:
│  │
│  ├─ Finder component receives updated state from useWindowStore
│  ├─ useWindow hook dependencies trigger (isOpen, isMinimized)
│  └─ Component updates via useState/useLayoutEffect in hook
│
├─ useWindow Hook Detects Change:
│  │
│  ├─ previousStateRef tracks: wasOpen, wasMinimized
│  ├─ getTargetRect() finds dock element for animation origin
│  └─ Determines animation type (open, restore, maximize, minimize)
│
├─ GSAP Animation:
│  │
│  ├─ Desktop (not minimized): scale 0.8→1, opacity 0→1, duration 0.35-0.5s
│  │
│  ├─ Mobile: slide from bottom (y: 100dvh→0), duration 0.25s
│  │
│  ├─ Maximize: full screen transition, duration 0.35s
│  │
│  └─ Minimize: animate from current position to dock, duration 0.4s
│
├─ Draggable Setup:
│  │
│  ├─ Creates Draggable instance on window container
│  ├─ onPress triggers focusWindow(key) to bring to front
│  ├─ Stores lastPositionRef for restore/un-maximize
│  └─ Enable/disable based on state
│
├─ Z-Index Update:
│  │
│  └─ useLayoutEffect applies z-index: style={{ zIndex }}
│
├─ Pointer Events:
│  │
│  └─ useLayoutEffect sets: pointerEvents = "auto" or "none"
│
└─ Screen Update:
   │
   └─ User sees animated window appearing on screen with smooth physics-based animation
```

---

## 📁 Code Organization Pattern

### Directory Structure Responsibilities

```
src/
├── components/
│   └── Purpose: Shared, reusable UI components
│       ├── Navbar.tsx (Navigation bar at top)
│       ├── Dock.tsx (App launcher at bottom)
│       ├── Welcome.tsx (Splash screen)
│       ├── Home.tsx (Desktop folders)
│       ├── WindowControls.tsx (Window buttons)
│       └── index.ts (Re-exports)
│
├── windows/
│   └── Purpose: Individual draggable window applications
│       ├── Finder.tsx (File browser)
│       ├── Safari.tsx (Browser/Articles)
│       ├── Terminal.tsx (Tech stack)
│       ├── Resume.tsx (PDF viewer)
│       ├── Contact.tsx (Contact + social)
│       ├── Photos.tsx (Gallery)
│       ├── Text.tsx (Notes)
│       ├── Image.tsx (Image viewer)
│       └── index.ts (Re-exports)
│
├── store/
│   └── Purpose: Zustand global state management
│       ├── Window.ts (Window lifecycle state)
│       ├── Location.ts (Navigation state)
│       ├── Wallpaper.ts (Wallpaper selection with persist)
│       └── (Each store uses Immer for immutable updates)
│
├── hooks/
│   └── Purpose: Custom React hooks for reusable logic
│       ├── useWindow.ts (Window animation, drag, state - core hook)
│       ├── useDevice.ts (Mobile/responsive detection)
│       └── (Integrated with @gsap/react)
│
├── constants/
│   └── Purpose: Configuration and data
│       ├── system.ts (WINDOW_CONFIG, INITIAL_Z_INDEX)
│       ├── finder.ts (Project folders, files hierarchy)
│       ├── safari.ts (Blog posts data)
│       ├── terminal.ts (Tech stack categories)
│       ├── photos.ts (Gallery categories and images)
│       ├── contact.ts (Social links, email)
│       └── index.ts (Re-exports)
│
├── types.ts
│   └── Purpose: TypeScript type definitions
│       ├── FileItem (file type definition)
│       ├── FolderItem (folder type definition)
│       ├── WindowState (window state shape)
│       ├── WindowConfig (windows collection type)
│       └── LocationItem (location hierarchy type)
│
├── assets/
│   └── Purpose: Bundled static assets
│       └── (images, fonts, etc.)
│
├── index.css (Global styles, Tailwind, custom utilities)
├── App.css (Legacy styles)
├── App.tsx (Root component)
├── main.tsx (Entry point)
└── vite-env.d.ts (Vite type definitions)
```

**Key Design Principle:**

- **No HOC pattern** — Replaced with `useWindow` custom hook for better composability
- **Direct hook usage** — Each window component calls `useWindow(windowKey)` directly
- **Separation of concerns** — Animation logic in hook, UI in component
- **TypeScript throughout** — Type-safe codebase

---

## 🔌 Integration Points

### External Dependencies Integration

```
React 19.2.5
│
├─ ReactDOM → Mounts app to DOM
├─ useRef, useLayoutEffect → Custom hook integration
└─ Concurrent rendering features

@gsap/react 2.1.2
│
├─ useGSAP hook → Safe GSAP integration with React
├─ Dependency tracking → Triggers animations on state change
└─ Cleanup → Automatic animation killing on unmount

Vite 8.0.10
│
├─ Module resolution → Path aliases (#components, #store, hooks, etc.)
├─ Hot Module Replacement → Dev server updates
├─ Code splitting → Separate chunks for GSAP, PDF, vendor
└─ Build optimization → Production bundle

@tailwindcss/vite 4.2.4 + tailwindcss 4.2.4
│
├─ Utility classes → Styling
├─ Custom @theme → Custom fonts, colors, breakpoints
├─ Custom @utility → Responsive flex layouts
└─ Mobile-first approach → Desktop and mobile optimizations

Zustand 5.0.13
│
├─ Store creation → useWindowStore, useLocationStore, useWallpaperStore
├─ Immer middleware → Immutable state updates
├─ Persist middleware → localStorage persistence (wallpaper)
└─ Selector hooks → Component subscriptions

Immer 11.1.8
│
└─ Immutable state management → Zustand integration for safe mutations

GSAP 3.15.0
│
├─ Draggable Plugin → Window drag behavior
├─ Tweens → Property animations (scale, opacity, x, y, width, height)
├─ Physics-based easing → power3.out, power4.out, power3.inOut
└─ Animation timelines → Complex sequenced animations

Lucide React 1.3.0
│
└─ Icon components → UI icons (Check, Flag, etc.)

react-pdf 10.4.1
│
├─ PDF viewing → Resume window display
├─ Multi-page support → Document navigation
└─ On-demand loading → Only loaded when Resume opens

react-to-pdf 3.2.2
│
└─ PDF export → Download/print functionality

dayjs 1.11.20
│
└─ Date/time → Real-time clock in navbar

clsx 2.1.1
│
└─ Conditional classes → Dynamic CSS class generation

react-tooltip 6.0.2
│
└─ Tooltips → Dock icon labels on hover

ESLint & Prettier
├─ ESLint → Code quality and consistency
├─ react-hooks plugin → Hook dependency validation
└─ Prettier → Code formatting (v3.8.3)

TypeScript 6.0.3
│
└─ Type safety → Full codebase type checking
```

---

## 🚀 Performance Architecture

### Optimization Strategies

```
Code Splitting (Vite)
├─ GSAP in separate chunk → Loaded when needed
├─ react-pdf in separate chunk → Loaded when Resume opens
├─ Vendor chunk → React, React-DOM, utilities
└─ Main chunk → Application code

Asset Optimization
├─ Icons as SVG → Scalable, small file size
├─ Images in public/ → Lazy loaded with loading="lazy"
├─ Wallpaper optimized → Single background image
└─ PDF on-demand → Only loaded when Resume window opens

Rendering Optimization
├─ useGSAP for animation → GPU acceleration
├─ Transform & opacity for animations → Smooth 60fps
├─ CSS containment → Isolate reflow/repaint
└─ Memoization → Prevent unnecessary re-renders

Bundle Size
├─ React: ~42KB (gzipped)
├─ Tailwind: ~60KB (gzipped)
├─ GSAP: ~40KB (gzipped)
├─ Zustand: ~2KB (gzipped)
└─ Total: ~200KB (gzipped)
```

---

## 🔐 Data Security Architecture

### Data Flow Security

```
User Input
├─ No sensitive data collected
├─ No form submissions
└─ Only static content

External Links
├─ All links open in new tabs
├─ target="_blank" for safety
└─ rel="noopener noreferrer" for security

PDF Download
├─ Local file download only
├─ No server-side processing
└─ Native HTML download attribute

Static Assets
├─ Served from public/ folder
├─ No dynamic content generation
└─ No server-side rendering
```

---

## 🎯 Key Architectural Decisions

### Why This Architecture?

| Decision                   | Why                                 | Benefit                              |
| -------------------------- | ----------------------------------- | ------------------------------------ |
| **Zustand over Redux**     | Lightweight, minimal boilerplate    | Faster dev, smaller bundle           |
| **Immer middleware**       | Immutable updates pattern           | Predictable state changes            |
| **useWindow Hook Pattern** | DRY principle, better composability | Shared animation logic, testable     |
| **GSAP over CSS**          | Advanced physics, better control    | Smooth, physics-based animations     |
| **Tailwind CSS**           | Utility-first approach              | Rapid styling, consistent design     |
| **Vite over Webpack**      | Fast HMR, optimized build           | Better dev experience                |
| **TypeScript**             | Type safety throughout              | Fewer runtime errors, better DX      |
| **@gsap/react useGSAP**    | Safe React integration              | Automatic cleanup, dependency track. |
| **Persist middleware**     | Browser storage for preferences     | Wallpaper choice persists            |
| **Mobile-first CSS**       | Responsive from ground up           | Works on all devices                 |

---

## 📊 Complexity Analysis

### Component Complexity

```
Simple Components (Static UI)
├─ Welcome.tsx (animation only, no state)
├─ Contact.tsx (static display with links)
├─ Terminal.tsx (static tech stack display)
└─ Photos.tsx (static gallery display)

Medium Complexity (State + Store Dispatch)
├─ Navbar.tsx (store dispatch + time formatting)
├─ Dock.tsx (store dispatch + icon hover animation)
└─ Home.tsx (store dispatch + folder interaction)

High Complexity (Multiple States + Store + Animations)
├─ Finder.tsx (useWindow + location state + nested navigation)
├─ Resume.tsx (useWindow + PDF viewing state)
├─ Safari.tsx (useWindow + article filtering)
└─ All Window Components (useWindow hook integration)

useWindow Hook Complexity
├─ Multiple useLayoutEffect hooks for z-index, pointer events
├─ useGSAP with complex conditional animation logic
├─ Draggable instance creation and state management
├─ Mobile vs desktop responsive behavior
├─ Maximize/restore functionality
├─ Minimize to dock with target position tracking
└─ Acceptable complexity justified by reusability

Architectural Complexity Assessment
└─ Well-managed:
    • Clear separation of concerns (UI vs animation vs state)
    • Single responsibility principle maintained
    • DRY through useWindow custom hook
    • Type-safe with TypeScript throughout
    • Testable logic isolated in hook
```

---

## 🎓 Conclusion

The macOS Porto architecture is designed for:

- **Clarity** — Each component has clear responsibilities
- **Reusability** — useWindow hook prevents code duplication across windows
- **Maintainability** — Clear data flow and centralized state management
- **Performance** — GPU-accelerated animations and optimized rendering
- **Scalability** — Easy to add new windows or features
- **Type Safety** — Full TypeScript coverage prevents runtime errors
- **Responsiveness** — Mobile-first CSS and adaptive animations

The architectural decisions favor **pragmatism** over theoretical purity, using modern React patterns (hooks over HOCs) while maintaining both power and clarity for new developers.
