# macOS Porto - Technical Architecture & System Design

## 🏗️ System Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User Browser                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              React Application (App.jsx)                     │  │
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
│           ├─── HOC Layer ────────────────────────────────┤         │
│           │    └── WindowWrapper (Animation + Drag)      │         │
│           │                                              │         │
│           ├─── State Management Layer (Zustand) ────────┤         │
│           │    ├── Window Store                          │         │
│           │    │   ├── windows: {}                       │         │
│           │    │   ├── nextZIndex                        │         │
│           │    │   └── methods                           │         │
│           │    │                                         │         │
│           │    └── Location Store                        │         │
│           │        ├── activeLocation                    │         │
│           │        └── methods                           │         │
│           │                                              │         │
│           ├─── Animation Layer (GSAP) ─────────────────┤         │
│           │    ├── Draggable Plugin                      │         │
│           │    ├── Timeline & Tweens                     │         │
│           │    └── useGSAP Hook                          │         │
│           │                                              │         │
│           ├─── Styling Layer ──────────────────────────┤         │
│           │    ├── Tailwind CSS                          │         │
│           │    └── CSS Modules                           │         │
│           │                                              │         │
│           └─── Constants & Configuration ───────────────┤         │
│                ├── Window Config                         │         │
│                ├── Navigation Links                      │         │
│                ├── Blog Posts                            │         │
│                ├── Tech Stack                            │         │
│                └── Socials                               │         │
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
│  Example: Dock.jsx calls openWindow("finder")                   │
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
│  Component receives new props from store                          │
│  WindowWrapper detects isOpen change                             │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  GSAP ANIMATION                                                  │
│  WindowWrapper triggers: scale 0.8→1, opacity 0→1               │
│  Duration: 0.45s, Easing: power3.out                            │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  WINDOW APPEARS                                                  │
│  User sees animated window on screen                             │
│  Window is now draggable (Draggable.create())                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 Component Dependency Tree

```
App.jsx (Root)
│
├── Layout Components
│   ├── Navbar.jsx
│   │   ├── dayjs (time formatting)
│   │   └── useWindowStore (openWindow)
│   │
│   ├── Welcome.jsx
│   │   └── useGSAP (font weight animation)
│   │
│   ├── Dock.jsx
│   │   ├── useWindowStore (windows state)
│   │   ├── useGSAP (icon hover scaling)
│   │   └── gsap (animations)
│   │
│   └── Home.jsx
│       ├── useLocationStore (folder navigation)
│       ├── useWindowStore (openWindow)
│       └── useGSAP (draggable folders)
│
├── Window Components
│   ├── Finder.jsx
│   │   ├── WindowWrapper HOC
│   │   ├── WindowControls
│   │   ├── useLocationStore (folder hierarchy)
│   │   └── useWindowStore (open windows)
│   │
│   ├── Safari.jsx
│   │   ├── WindowWrapper HOC
│   │   ├── WindowControls
│   │   └── lucide-react (icons)
│   │
│   ├── Terminal.jsx
│   │   ├── WindowWrapper HOC
│   │   └── WindowControls
│   │
│   ├── Resume.jsx
│   │   ├── WindowWrapper HOC
│   │   ├── WindowControls
│   │   ├── react-pdf (PDF viewer)
│   │   └── lucide-react (download icon)
│   │
│   ├── Contact.jsx
│   │   ├── WindowWrapper HOC
│   │   └── WindowControls
│   │
│   ├── Photos.jsx
│   │   ├── WindowWrapper HOC
│   │   └── WindowControls
│   │
│   ├── Text.jsx
│   │   ├── WindowWrapper HOC
│   │   └── WindowControls
│   │
│   └── Image.jsx
│       ├── WindowWrapper HOC
│       └── WindowControls
│
├── HOC Components
│   └── WindowWrapper.jsx
│       ├── useWindowStore (window state)
│       ├── useGSAP (animations)
│       ├── Draggable (drag behavior)
│       └── useLayoutEffect (visibility)
│
├── Global State (Zustand)
│   ├── Window.js
│   │   ├── WINDOW_CONFIG (initial state)
│   │   ├── INITIAL_Z_INDEX
│   │   └── Immer middleware
│   │
│   └── Location.js
│       ├── locations (from constants)
│       └── Immer middleware
│
├── Constants
│   └── index.js
│       ├── navLinks
│       ├── dockApps
│       ├── blogPosts
│       ├── techStack
│       ├── socials
│       ├── WINDOW_CONFIG
│       └── INITIAL_Z_INDEX
│
├── Styling
│   ├── index.css (Tailwind + custom)
│   └── App.css (legacy)
│
└── Assets
    └── src/assets/ (bundled images, fonts)
```

---

## 🎬 Animation State Machine

### Window Lifecycle with Animations

```
[CLOSED] ─────────────────────────────────────────────────── [MINIMIZED]
  │                                                              ▲
  │ openWindow(key)                                 minimizeWindow(key)
  │ • isOpen = true                                 • isMinimized = true
  │ • zIndex = nextZIndex++                         • Animation: 0.4s
  │                                                  • Animate to dock
  │                                                  │
  ▼                                                  │
[OPENING ANIMATION]                                  │
  │ scale: 0.8 → 1 (0.45s)                          │
  │ opacity: 0 → 1 (0.45s)                          │
  │ y: 40 → 0 (0.45s)                               │
  │ ease: power3.out                                │
  ▼                                                  │
[OPEN] ─────────────────────────────────────────────────── [RESTORING]
  │ • isOpen = true                                     restoreWindow(key)
  │ • isMinimized = false                              • isMinimized = false
  │ • Draggable enabled                                • Animation: 0.4s
  │ • User can drag window                             • Animate from dock
  │                                                     │
  │ focusWindow(key)                                   │
  │ • zIndex = nextZIndex++ ◄──────────────────────────┘
  │ (brings to front)
  │
  │ closeWindow(key)
  │ • isOpen = false
  │ • zIndex = INITIAL_Z_INDEX
  ▼
[CLOSING ANIMATION]
  │ Reverses opening animation
  │ scale: 1 → 0.8 (0.45s)
  │ opacity: 1 → 0 (0.45s)
  │ y: 0 → 40 (0.45s)
  │ ease: power3.out
  ▼
[CLOSED] ◄─────────────────────────────────────────────────────
```

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
```

---

## 🎨 Rendering Pipeline

### Component Rendering Sequence

```
1. App.jsx renders all components
   ├── Navbar
   ├── Welcome
   ├── Dock
   ├── Home
   └── All Window Components (wrapped with WindowWrapper)

2. Each Window Component → WindowWrapper HOC
   ├── Checks: isOpen, isMinimized, zIndex from store
   ├── Applies z-index: style={{ zIndex }}
   ├── Manages visibility: visibility/display
   └── Wraps with animation ref

3. WindowWrapper useGSAP Hook
   ├── Monitors: isOpen, isMinimized changes
   ├── Triggers: GSAP animations
   ├── Creates: Draggable instance
   └── Cleanup: Kill animations on unmount

4. User Interaction
   ├── Click dock → dispatch openWindow()
   ├── Store updates → component re-renders
   ├── GSAP animation plays
   └── Window appears with smooth animation
```

---

## 🔗 Event Flow Architecture

### User Action to Screen Update

```
User Clicks Dock Icon
│
├─ Event: onClick handler in Dock.jsx
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
│      state.windows.finder.zIndex = state.nextZIndex;
│      state.nextZIndex++;
│    })
│
├─ React Re-render:
│  │
│  ├─ Finder component receives new zIndex
│  ├─ WindowWrapper detects isOpen change
│  └─ Component updates visibility style
│
├─ useGSAP Hook Detects Change:
│  │
│  └─ [isOpen, isMinimized] dependency triggered
│
├─ GSAP Animation:
│  │
│  └─ gsap.fromTo(windowRef, {
│       scale: 0.8, opacity: 0, y: 40
│     }, {
│       scale: 1, opacity: 1, y: 0,
│       duration: 0.45, ease: "power3.out"
│     })
│
├─ Draggable.create():
│  │
│  └─ Window becomes draggable, onPress triggers focusWindow()
│
└─ Screen Update:
   │
   └─ User sees animated window appearing on screen
```

---

## 📁 Code Organization Pattern

### Directory Structure Responsibilities

```
src/
├── components/
│   └── Purpose: Shared, reusable UI components
│       ├── Navbar.jsx (Navigation bar at top)
│       ├── Dock.jsx (App launcher at bottom)
│       ├── Welcome.jsx (Splash screen)
│       ├── Home.jsx (Desktop folders)
│       ├── WindowControls.jsx (Window buttons)
│       └── index.js (Re-exports)
│
├── windows/
│   └── Purpose: Individual draggable window applications
│       ├── Finder.jsx (File browser)
│       ├── Safari.jsx (Browser/Articles)
│       ├── Terminal.jsx (Tech stack)
│       ├── Resume.jsx (PDF viewer)
│       ├── Contact.jsx (Contact + social)
│       ├── Photos.jsx (Gallery)
│       ├── Text.jsx (Notes)
│       ├── Image.jsx (Image viewer)
│       └── index.js (Re-exports)
│
├── store/
│   └── Purpose: Zustand global state management
│       ├── Window.js (Window lifecycle state)
│       ├── Location.js (Navigation state)
│       └── (Each store uses Immer for immutable updates)
│
├── hoc/
│   └── Purpose: Higher-order components for cross-cutting concerns
│       └── WindowWrapper.jsx
│           ├── Wraps window components
│           ├── Adds GSAP animations
│           ├── Adds Draggable behavior
│           └── Manages visibility & z-index
│
├── constants/
│   └── Purpose: Configuration and data
│       └── index.js
│           ├── Navigation configuration
│           ├── Window definitions
│           ├── Blog posts
│           ├── Tech stack
│           ├── Social media links
│           └── Gallery data
│
├── assets/
│   └── Purpose: Bundled static assets
│       └── (images, fonts, etc.)
│
└── Styling
    ├── index.css (Global styles, Tailwind, custom utilities)
    └── App.css (Legacy styles)
```

---

## 🔌 Integration Points

### External Dependencies Integration

```
React 19.2.5
│
├─ ReactDOM → Mounts app to DOM
├─ useRef, useState, useLayoutEffect → React hooks
└─ Concurrent rendering features

Vite 8.0.10
│
├─ Module resolution → Path aliases (#components, #store, etc.)
├─ Hot Module Replacement → Dev server updates
├─ Code splitting → Separate chunks for GSAP, PDF, vendor
└─ Build optimization → Production bundle

Tailwind CSS 4.2.4
│
├─ Utility classes → Styling
├─ Custom @theme → Custom fonts, breakpoints
├─ Custom @utility → flex-center, col-center, abs-center
└─ Responsive design → Mobile-first approach

Zustand 5.0.13
│
├─ Store creation → useWindowStore, useLocationStore
├─ Immer middleware → Immutable state updates
└─ Selector hooks → Component subscriptions

GSAP 3.15.0
│
├─ Tweens → Property animations (scale, opacity, etc.)
├─ Draggable → Window drag behavior
├─ useGSAP Hook → React integration
└─ Timeline → Sequenced animations

Lucide React 1.3.0
│
└─ Icon components → UI icons

react-pdf 10.4.1
│
└─ PDF viewing → Resume display

dayjs 1.11.20
│
└─ Date/time → Clock in navbar

clsx 2.1.1
│
└─ Conditional classes → Dynamic CSS

react-tooltip 6.0.2
│
└─ Tooltips → Dock icon labels

Other
├─ ESLint → Code quality
└─ Prettier → Code formatting
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

| Decision               | Why                              | Benefit                           |
| ---------------------- | -------------------------------- | --------------------------------- |
| **Zustand over Redux** | Lightweight, minimal boilerplate | Faster dev, smaller bundle        |
| **Immer middleware**   | Immutable updates pattern        | Predictable state changes         |
| **WindowWrapper HOC**  | DRY principle for animations     | Reusable animation logic          |
| **GSAP over CSS**      | Advanced physics, better control | Smooth, physics-based animations  |
| **Tailwind CSS**       | Utility-first approach           | Rapid styling, consistent design  |
| **Vite over Webpack**  | Fast HMR, optimized build        | Better dev experience             |
| **Code splitting**     | Load chunks on demand            | Smaller initial bundle            |
| **Immer + Zustand**    | Immutable state pattern          | Easier debugging, undo/redo ready |

---

## 📊 Complexity Analysis

### Component Complexity

```
Simple Components (No State)
├─ Welcome.jsx (animation only)
├─ Contact.jsx (static display)
└─ Terminal.jsx (static display)

Medium Complexity (Local State + Store)
├─ Navbar.jsx (store dispatch)
├─ Dock.jsx (store dispatch + local animation)
└─ Home.jsx (store dispatch + Draggable)

High Complexity (Store + HOC + Animation)
├─ All Window Components → Wrapped with WindowWrapper
├─ WindowWrapper → Animation + Draggable
└─ State management → Multiple concerns

Architectural Complexity
└─ Acceptable:
    • Clear separation of concerns
    • Single responsibility principle
    • DRY through HOCs
```

---

## 🎓 Conclusion

The macOS Porto architecture is designed for:

- **Clarity** — Each component has single responsibility
- **Reusability** — WindowWrapper prevents code duplication
- **Maintainability** — Clear data flow and state management
- **Performance** — Optimized animations and code splitting
- **Scalability** — Easy to add new windows or features

The architectural decisions favor **pragmatism** over theoretical purity, making it both powerful and easy to understand for new developers.
