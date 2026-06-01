# macOS Porto - Complete Project Documentation

## 📌 Executive Summary

**macOS Porto** is a creative, interactive portfolio application that showcases professional work through a macOS-inspired desktop interface. Instead of a traditional static portfolio, visitors experience your skills and projects by interacting with draggable windows, a functional dock, and multiple application-style components—creating a memorable, immersive experience that demonstrates advanced React and animation capabilities.

---

## 🎯 Project Purpose & Goals

### Primary Purpose

To create an **innovative portfolio platform** that stands out from conventional portfolio websites by providing an interactive, desktop-like experience that:

- Engages visitors through interactive exploration
- Demonstrates technical expertise in React, animations, and UI design
- Creates lasting impressions through unique interactions
- Showcases professionalism and creativity

### Target Audience

- **Tech Recruiters & Hiring Managers** — Looking for developers with advanced UI/UX skills
- **Project Collaborators & Clients** — Exploring past work and capabilities
- **Tech Enthusiasts** — Appreciating creative design and interaction patterns
- **General Visitors** — Anyone who enjoys unique, interactive experiences

### Key Goals

1. **Memorability** — Visitors remember the interactive experience
2. **Showcase Technical Skills** — Demonstrate proficiency in React, GSAP, state management, and advanced CSS
3. **Engagement** — Keep visitors on the site longer through interactive exploration
4. **Uniqueness** — Stand out among hundreds of standard portfolio templates
5. **Professionalism** — Present a polished, production-ready application

---

## 📊 Technology Stack

| Category             | Technology    | Version | Purpose                                         |
| -------------------- | ------------- | ------- | ----------------------------------------------- |
| **Language**         | TypeScript    | 6.0.3   | Type-safe JavaScript                            |
| **Framework**        | React         | 19.2.5  | Component-based UI rendering                    |
| **Build Tool**       | Vite          | 8.0.10  | Fast HMR development & production bundling      |
| **Styling**          | Tailwind CSS  | 4.2.4   | Utility-first CSS framework (@tailwindcss/vite) |
| **State Management** | Zustand       | 5.0.13  | Lightweight global state with persist           |
| **State Helper**     | Immer         | 11.1.8  | Immutable state updates (middleware)            |
| **Animations**       | GSAP          | 3.15.0  | Advanced animations & interactions              |
| **GSAP React**       | @gsap/react   | 2.1.2   | React integration for GSAP (useGSAP hook)       |
| **Icons**            | Lucide React  | 1.3.0   | Icon library (Check, Flag, etc.)                |
| **Tooltips**         | react-tooltip | 6.0.2   | Tooltip functionality                           |
| **PDF Handling**     | react-pdf     | 10.4.1  | PDF viewing                                     |
| **PDF Export**       | react-to-pdf  | 3.2.2   | PDF download functionality                      |
| **Date Handling**    | dayjs         | 1.11.20 | Date/time formatting                            |
| **Class Merging**    | clsx          | 2.1.1   | Conditional CSS classes                         |
| **Code Quality**     | ESLint        | 10.2.1  | Code linting & standards                        |
| **Code Formatting**  | Prettier      | 3.8.3   | Code formatting                                 |

### Why These Technologies?

- **React 19**: Latest features, better performance, concurrent rendering
- **Vite**: Extremely fast dev server with HMR, optimized production builds
- **Tailwind CSS**: Rapid prototyping with utility-first approach, consistent design system
- **Zustand**: Lightweight alternative to Redux, perfect for this project's state needs
- **GSAP**: Industry-standard animation library with advanced physics and timeline control
- **Lucide React**: Modern, lightweight icon library with great TypeScript support

---

## 🗂️ Complete Project Structure

```
macos-porto/
│
├── 📄 index.html                 # Main HTML entry point
├── 📄 package.json               # Project dependencies & scripts
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 vite.config.js             # Vite configuration with path aliases
├── 📄 eslint.config.js           # ESLint configuration
├── 📄 README.md                  # Basic project info
│
├── 📁 context/                   # Documentation & analysis
│   ├── PROJECT_OVERVIEW.md       # High-level project guide
│   ├── ARCHITECTURE.md           # System architecture & patterns
│   ├── PROJECT_DOCUMENTATION.md  # Detailed feature documentation
│   ├── STYLING_ANALYSIS_AND_FEATURES.md
│   ├── progress-tracker.md       # Development progress notes
│   ├── rules.md                  # Project rules & conventions
│   ├── 📁 features/              # Feature-specific docs
│   └── 📁 update/                # Update logs
│
├── 📁 public/                    # Static assets served without processing
│   ├── 📁 icons/                 # System icons (wifi, search, user, mode, etc.)
│   ├── 📁 images/                # Images (wallpaper, app icons, gallery, blog)
│   └── 📁 files/                 # Downloadable files (resume.pdf)
│
└── 📁 src/                       # Application source code
    ├── 📄 main.jsx               # React app entry point
    ├── 📄 App.jsx                # Root component (registers GSAP, renders all components)
    ├── 📄 index.css              # Global styles & Tailwind imports
    ├── 📄 App.css                # App-specific styles (legacy)
    │
    ├── 📁 components/            # Shared UI components (layout & shell) - TSX
    │   ├── Navbar.tsx            # Top navigation bar
    │   ├── Welcome.tsx           # Landing/splash screen
    │   ├── Dock.tsx              # Application launcher dock
    │   ├── Home.tsx              # Desktop file browser/folder view
    │   ├── WindowControls.tsx    # Window control buttons (close, minimize, maximize)
    │   └── index.ts              # Component exports
    │
    ├── 📁 windows/               # Draggable window applications - TSX
    │   ├── Finder.tsx            # File explorer / project browser
    │   ├── Safari.tsx            # Blog/articles viewer
    │   ├── Terminal.tsx          # Tech stack display
    │   ├── Resume.tsx            # PDF viewer & download
    │   ├── Contact.tsx           # Contact form & social links
    │   ├── Photos.tsx            # Photo gallery
    │   ├── Text.tsx              # Text editor / notes
    │   ├── Image.tsx             # Image viewer
    │   └── index.ts              # Window exports
    │
    ├── 📁 store/                 # Zustand state management - TypeScript
    │   ├── Window.ts             # Window state (open/close/focus/minimize/maximize)
    │   ├── Location.ts           # Navigation/location state
    │   └── Wallpaper.ts          # Wallpaper selection state (with persist middleware)
    │
    ├── 📁 hooks/                 # Custom React hooks - TypeScript
    │   ├── useWindow.ts          # Animation & drag behavior hook (replaces HOC pattern)
    │   └── useDevice.ts          # Mobile detection and screen size detection
    │
    ├── 📁 constants/             # Configuration & data modules - TypeScript
    │   ├── system.ts             # Navigation links, dock apps, window config, INITIAL_Z_INDEX
    │   ├── finder.ts             # Finder folder structure & project data
    │   ├── safari.ts             # Blog posts
    │   ├── photos.ts             # Photo gallery data
    │   ├── terminal.ts           # Tech stack categories & technologies
    │   ├── contact.ts            # Contact information & social links
    │   └── index.ts              # Unified export of all constants
    │
    └── 📁 assets/                # Project assets (bundled into app)
        └── (images, fonts, etc.)
```

### Directory Responsibilities

| Directory         | Responsibility                                            | Owner              |
| ----------------- | --------------------------------------------------------- | ------------------ |
| `src/components/` | Shared UI layout components (Navbar, Dock, Welcome, Home) | Layout Shell       |
| `src/windows/`    | Individual draggable application windows (TSX)            | Window Features    |
| `src/store/`      | Global Zustand stores (Window, Location, Wallpaper)       | State Management   |
| `src/hooks/`      | Custom React hooks (useWindow for animations, useDevice)  | Window Behavior    |
| `src/constants/`  | Configuration split into modules (system.ts, finder.ts)   | Data Configuration |
| `src/assets/`     | Bundled static assets                                     | Static Content     |
| `public/`         | Served static files (icons, images, documents)            | Public Assets      |
| `context/`        | Documentation & architectural notes                       | Documentation      |

---

## 🏗️ Architecture Overview

### System Architecture Diagram

```
User Interaction (click dock/nav/folder)
    ↓
Component (Dock/Navbar/Home) dispatches action
    ↓
Zustand Store (Window or Location) updates state
    ↓
Component re-renders with new state
    ↓
WindowWrapper HOC detects isOpen/isMinimized change
    ↓
GSAP animations triggered (scale, opacity, position)
    ↓
Draggable.create() enables window drag interaction
    ↓
User sees animated, draggable window
```

### State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Global State (Zustand)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Window Store (Window.js)           Location Store          │
│  ├── windows: {}                    ├── activeLocation      │
│  │   ├── [key].isOpen               └── methods             │
│  │   ├── [key].zIndex                   ├── setActiveLocation│
│  │   ├── [key].isMinimized              └── resetActiveLocation│
│  │   └── [key].data                                          │
│  ├── nextZIndex: number                                     │
│  └── methods                                                │
│      ├── openWindow(windowKey, data)                        │
│      ├── closeWindow(windowKey)                             │
│      ├── focusWindow(windowKey)                             │
│      ├── minimizeWindow(windowKey)                          │
│      └── restoreWindow(windowKey)                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App.jsx (Main Entry Point)
├── Navbar (Top menu bar with navigation)
│   └── navLinks trigger openWindow() → opens windows
├── Welcome (Landing/splash screen)
├── Dock (Application launcher)
│   └── dockApps trigger openWindow() → opens windows
├── Home (Desktop folder browser)
│   └── folders trigger setActiveLocation() → opens Finder
│
└── Windows (Draggable Applications)
    ├── Terminal (Tech Stack display)
    ├── Safari (Blog/Articles viewer)
    ├── Finder (Project/File browser)
    ├── Resume (PDF Viewer)
    ├── Contact (Contact + Social Links)
    ├── Photos (Photo Gallery)
    ├── Text (Text Editor/Notes)
    ├── Image (Image Viewer)
    └── Each wrapped with WindowWrapper HOC
        └── Adds GSAP animations & draggable behavior
```

---

## 🎨 Core Features

### 1. **macOS-Inspired Desktop Interface**

- Full draggable window system with z-index stacking
- Glassmorphic design elements (backdrop blur, transparency)
- System-like visual appearance with rounded corners, shadows
- macOS color scheme and styling conventions

### 2. **Navigation Bar (Navbar)**

- Logo and portfolio title display
- Navigation links: Projects, Contact, Resume
- System icons: WiFi, Search, User, Dark Mode toggle
- Real-time clock using dayjs
- Glassmorphic design with `backdrop-blur-3xl`

### 3. **Dock**

- Bottom-aligned application launcher (like macOS dock)
- Hover-based interactive icon scaling with exponential intensity
- Visual indicators showing which apps are open
- Animated icon physics using GSAP
- Tooltips on icon hover

### 4. **Welcome Screen**

- Landing screen with project title
- Variable font weight animation on hover
- "Small screen" warning for mobile users
- Centered, full-viewport design

### 5. **Home (Desktop)**

- Shows folder icons for different projects
- Draggable folder positioning
- Click to navigate to project details
- Grid layout with custom positioning

### 6. **Window System** (9+ Application Windows)

- **Terminal** — Tech stack display with formatted output
- **Safari** — Blog/articles viewer with post cards
- **Finder** — File explorer showing projects and folders
- **Resume** — PDF viewer and download functionality
- **Contact** — Contact form with social media links
- **Photos** — Photo gallery with category browser
- **Text** — Text editor/notes interface
- **Image** — Image viewer for single images

### 7. **Window Management**

- Open/Close animations
- Z-index stacking (focus brings window to front)
- Minimize/Restore functionality
- Drag and drop anywhere on screen
- Window data passing between components

### 8. **State Management**

- **Window Store**: Controls window lifecycle (open/close/focus)
- **Location Store**: Tracks active portfolio section (for Finder navigation)
- Uses Zustand + Immer for immutable, predictable updates

### 9. **Responsive Design**

- Mobile detection and warnings
- Tailwind responsive classes (`max-sm:`, `sm:`, `md:`, etc.)
- Dock hidden on mobile (`max-sm:hidden`)
- Flexible grid layouts

### 10. **Animation System**

- GSAP-powered smooth window open/close
- Dock icon hover scaling with exponential physics
- Window minimize-to-dock animation
- Draggable behavior with automatic focus
- Variable font-weight animations on hover

---

## 💾 State Management (Zustand + TypeScript)

### Window Store (`src/store/Window.ts`)

```typescript
useWindowStore provides:
- windows: WindowConfig                // Object of all windows with their state
- nextZIndex: number                   // Counter for z-index stacking
- openWindow(windowKey, data?)         // Opens window, sets z-index
- closeWindow(windowKey)               // Closes window, resets z-index
- focusWindow(windowKey)               // Brings window to front
- minimizeWindow(windowKey)            // Hides window, animates to dock
- maximizeWindow(windowKey)            // Maximizes window to fullscreen
- restoreWindow(windowKey)             // Unhides minimized/maximized window
```

**Window Object Structure:**

```typescript
{
  windowKey: {
    isOpen: boolean,              // Is window visible?
    zIndex: number,               // Stacking order (higher = on top)
    isMinimized: boolean,         // Is window minimized?
    isMaximized: boolean,         // Is window maximized?
    data: any,                    // Data passed to window
  }
}
```

**Key Patterns:**

1. Window state is the single source of truth
2. Z-index incremented on focus to maintain stacking order
3. Immer middleware allows "mutation-like" syntax for immutable updates
4. Minimize animates window to dock; restore brings it back
5. Maximize expands to fullscreen; restore returns to saved position

### Location Store (`src/store/Location.ts`)

```typescript
useLocationStore provides:
- activeLocation: object               // Current folder/section in Finder
- setActiveLocation(location)          // Navigate to folder
- resetActiveLocation()                // Go back to default location
```

Used primarily by **Finder** window for hierarchical navigation.

### Wallpaper Store (`src/store/Wallpaper.ts`)

```typescript
useWallpaperStore provides:
- wallpaper: string                    // Current wallpaper path
- setWallpaper(path)                   // Change wallpaper
```

**Features:**
- Uses `persist` middleware to save wallpaper choice in localStorage
- Default wallpaper: `/images/wallpaper-3.webp`
- Persists across browser sessions
- Integrated with main App background

### Why Zustand?

- Lightweight and minimal boilerplate
- Great TypeScript support
- Immer middleware for immutable updates
- Persist middleware for local storage
- Minimal bundle size impact
- Perfect for this project's state needs (not Redux-level complexity)

---

## 🪟 Window System & Animation Behavior

### useWindow Hook (`src/hooks/useWindow.ts`)

The `useWindow` hook encapsulates all window animation and drag behavior logic for individual window components. This custom hook approach is more flexible and testable than the HOC pattern.

**Key Features:**

1. **Animation Lifecycle**
   - **Open Animation** (Desktop): Scale 0.8→1, opacity 0→1, from doc target to final position (0.45s)
   - **Open Animation** (Mobile): Slide up from bottom with fade-in (0.35s)
   - **Minimize Animation**: Animates to dock location and hides window
   - **Restore Animation**: Smoothly returns from dock to last saved position
   - **Maximize Animation**: Expands to full screen
   - **Restore from Maximize**: Returns to saved window size/position

2. **Drag Behavior**
   - Uses GSAP Draggable plugin for GPU-accelerated dragging
   - Saves last position in refs for restore functionality
   - Only enabled on desktop (automatically disabled on mobile)
   - Automatic focus on drag (brings window to front)

3. **Z-Index Management**
   - Applies correct z-index from Window Store
   - `focusWindow()` increments z-index counter
   - Window always renders at correct stacking order

4. **Visibility & Pointer Events**
   - Sets `pointerEvents: "none"` when closed/minimized
   - Sets `display: block` only when open
   - Prevents interaction with hidden windows

5. **Responsive Behavior**
   - Desktop: Full draggability, smooth animations
   - Mobile: Full-screen windows, slide-up animations
   - Uses `useDevice()` hook for responsive detection

**Usage in Window Component:**

```tsx
import { useWindow } from "#hooks/useWindow";
import { WindowControls } from "#components";

const MyWindow = () => {
  const { containerRef, headerRef } = useWindow("mywindow");

  return (
    <section ref={containerRef} id="mywindow" className="window">
      <div ref={headerRef} id="window-header">
        <WindowControls target="mywindow" />
        <h2>My Window</h2>
      </div>
      {/* Window content */}
    </section>
  );
};

export default MyWindow;
```

**Hook Returns:**

- `containerRef` — Attach to window container (receives all animations)
- `headerRef` — Attach to window header (drag handle)

### Window Lifecycle

```
1. User clicks dock app or nav link
2. openWindow(windowKey) called in Window Store
3. useWindow hook detects isOpen change
4. Animation plays based on context (minimize, restore, new open)
5. Window becomes draggable (on desktop only)
6. On minimize: animates to dock, sets isMinimized = true
7. On restore: animates from dock back to saved position
8. On close: reverses opening animation, hides window
```

---

## 🎨 Styling Architecture

### Layer Structure

The styling uses a **three-layer approach**:

1. **Base Layer** (`@layer base`)
   - HTML elements (nav, main, etc.)
   - Global typography rules
   - Fundamental reset styles

2. **Components Layer** (`@layer components`)
   - `.icon` — Icon styling for hover effects
   - `#welcome` — Welcome screen styling
   - `#dock` — Dock container and icons
   - `#window-controls` — Close/minimize/maximize buttons
   - `#window-header` — Window title bar
   - Window-specific styles (`#safari`, `#finder`, etc.)

3. **Utilities Layer** (`@layer utilities`)
   - Custom Tailwind utilities
   - `flex-center` — Flexbox with centered content
   - `col-center` — Column flex with centered content
   - `abs-center` — Absolute positioning centered

### Custom Theme (`src/index.css`)

```css
@theme {
  --font-georama: "Georama", sans-serif; /* Decorative headings */
  --font-inter: "Inter", sans-serif; /* Primary UI font */
  --font-roboto: "Roboto", sans-serif; /* Secondary font */
  --font-roboto-mono: "Roboto Mono", monospace; /* Code/terminal */
  --breakpoint-3xl: 1920px; /* Ultra-wide screens */
}
```

### Tailwind Configuration

- **Utility-first approach** for rapid styling
- **Responsive design** with mobile-first breakpoints
- **Custom utilities** defined via `@utility` directive
- **Custom fonts** via `@import` from Google Fonts
- **CSS Nesting** for organized selectors

### Design System

**Colors:**

- Primary: White/Blue (buttons, borders)
- Accent: Gray (text, icons)
- Special: Pink, Red, Green (for category indicators)
- Transparency: Heavy use of `bg-white/50`, `text-gray-200`

**Glassmorphism:**

- `backdrop-blur-3xl` with `bg-white/50` on navbar
- Creates frosted glass effect over wallpaper
- Modern, Apple-inspired aesthetic

**Spacing:**

- Tailwind default scale (4px base unit)
- `p-` classes for padding
- `gap-` for flex gaps
- `m-` for margins

**Typography:**

- `font-inter` — Default UI text
- `font-georama` — Decorative headers
- `font-roboto-mono` — Terminal/code text
- Variable font weights via CSS `fontVariationSettings`

---

## ✨ Animation System (GSAP)

### GSAP Integration

The project uses **GSAP 3.15** with React integration via `@gsap/react`:

1. **Draggable Plugin** — Enables window dragging
2. **useGSAP Hook** — React-integrated GSAP context
3. **Timelines** — For complex, sequenced animations
4. **Easing Functions** — `power1.out`, `power3.out`, `power3.in`

### Key Animations

#### 1. **Window Open Animation** (WindowWrapper)

```javascript
gsap.fromTo(
  windowElement,
  {
    scale: 0.8,
    opacity: 0,
    y: 40,
  },
  {
    scale: 1,
    opacity: 1,
    y: 0,
    duration: 0.45,
    ease: "power3.out",
  },
);
```

Creates a smooth scale-up with fade-in effect.

#### 2. **Dock Icon Scaling** (Dock)

```javascript
gsap.to(icon, {
  scale: 1 + 0.25 * intensity,
  y: -15 * intensity,
  duration: 0.2,
  ease: "power1.out",
});
```

- Uses mouse distance to calculate intensity
- Exponential formula: `Math.exp(-(distance ** 2.8) / 8000)`
- Creates physics-based scaling effect

#### 3. **Minimize Animation** (WindowWrapper)

```javascript
gsap.to(windowElement, {
  scale: 0.3,
  opacity: 0,
  x: offsetX, // To dock center
  y: offsetY, // To dock center
  duration: 0.4,
  ease: "power3.in",
});
```

Animates window shrinking and moving to dock.

#### 4. **Variable Font Weight** (Welcome)

```javascript
gsap.to(letter, {
  duration: 0.5,
  ease: "power2.out",
  fontVariationSettings: `"wght" ${targetWeight}`,
});
```

Animates font weight on mouse hover for interactive text effect.

### Animation Cleanup

All GSAP instances are properly killed on unmount to prevent memory leaks:

```javascript
useGSAP(() => {
  const [instance] = Draggable.create(element);
  return () => instance.kill(); // Cleanup
}, []);
```

---

## 📂 Component Details

### Navbar Component

**File:** [src/components/Navbar.jsx](src/components/Navbar.jsx)

- Displays logo, title, and navigation links
- Navigation links (Projects, Contact, Resume) trigger `openWindow()`
- System icons area on the right
- Real-time clock using `dayjs().format("ddd MMM D h:mm A")`
- Glassmorphic styling with backdrop blur

### Dock Component

**File:** [src/components/Dock.jsx](src/components/Dock.jsx)

- Bottom-aligned application launcher
- Hover-based exponential scaling physics
- App state indicators (white/gray dot below icon)
- Open/Close/Minimize/Restore functionality
- Tooltips on hover
- Disabled apps (like trash) show reduced opacity

### Finder Component

**File:** [src/windows/Finder.jsx](src/windows/Finder.jsx)

- File explorer showing projects and folders
- Sidebar navigation with location breadcrumbs
- Grid view of files/folders in active location
- Click handlers for different file types:
  - PDF → Opens Resume window
  - Folder → Changes location via `setActiveLocation()`
  - URL/FIG → Opens in new browser tab
  - Other → Opens in specific window type

### Terminal Component

**File:** [src/windows/Terminal.jsx](src/windows/Terminal.jsx)

- Displays tech stack in terminal-like format
- Shows categories and technologies
- Styled to look like a command-line interface
- Uses `roboto-mono` font for authenticity

### Contact Component

**File:** [src/windows/Contact.jsx](src/windows/Contact.jsx)

- Email display
- Social media links with colors
- Each link opens in new tab
- Uses predefined social data from constants

### Safari Component

**File:** [src/windows/Safari.jsx](src/windows/Safari.jsx)

- Browser-like interface
- Displays blog posts
- Browser controls (back, forward, search)
- Click "Read More" to open article in new tab

### Resume Component

**File:** [src/windows/Resume.jsx](src/windows/Resume.jsx)

- Uses `react-pdf` to display PDF
- Multi-page support with page numbers
- Download button using native HTML `download` attribute
- Scrollable content area

### Home Component

**File:** [src/components/Home.jsx](src/components/Home.jsx)

- Desktop view showing project folders
- Draggable folders (GSAP Draggable)
- Click to navigate to project in Finder
- Position-based layout via `item.position` class

---

## 🔧 Constants & Configuration

### File: `src/constants/index.js`

#### Navigation Links

```javascript
navLinks = [
  { id: 1, name: "Projects", type: "finder" },
  { id: 3, name: "Contact", type: "contact" },
  { id: 4, name: "Resume", type: "resume" },
];
```

#### Dock Apps

```javascript
dockApps = [
  { id: "finder", name: "Portfolio", icon: "finder.png", canOpen: true },
  { id: "safari", name: "Articles", icon: "safari.png", canOpen: true },
  { id: "photos", name: "Gallery", icon: "photos.png", canOpen: true },
  { id: "contact", name: "Contact", icon: "contact.png", canOpen: true },
  { id: "terminal", name: "Skills", icon: "terminal.png", canOpen: true },
  { id: "trash", name: "Archive", icon: "trash.png", canOpen: false },
];
```

#### Blog Posts

```javascript
blogPosts = [
  {
    id: 1,
    date: "Sep 2, 2025",
    title: "TypeScript Explained...",
    image: "/images/blog1.png",
    link: "https://jsmastery.com/...",
  },
  // ... more posts
];
```

#### Tech Stack

```javascript
techStack = [
  { category: "Frontend", items: ["React.js", "Next.js", "TypeScript"] },
  { category: "Mobile", items: ["React Native", "Expo"] },
  // ... more categories
];
```

#### Social Links

```javascript
socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/...",
  },
  // ... more socials
];
```

#### Window Configuration

```javascript
WINDOW_CONFIG = {
  finder: { isOpen: false, zIndex: 0, isMinimized: false, ... },
  safari: { isOpen: false, zIndex: 0, isMinimized: false, ... },
  // ... all windows
}

INITIAL_Z_INDEX = 10
```

---

## 🚀 Development & Deployment

### Development Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

   - Server runs at `http://localhost:5173`
   - Hot Module Replacement (HMR) enabled
   - Fast refresh on file changes

3. **Lint Code**

   ```bash
   npm run lint
   ```

   - Runs ESLint on all files
   - Checks for code quality issues

### Production Build

1. **Build for Production**

   ```bash
   npm run build
   ```

   - Optimized bundle in `dist/` folder
   - Code splitting for GSAP and react-pdf
   - Minified and optimized assets

2. **Preview Production Build**

   ```bash
   npm preview
   ```

   - Serves the built production version locally

### Deployment Options

**Vercel (Recommended)**

```bash
vercel
```

- Automatic deployments from Git
- Free tier available
- Great performance and CDN

**Netlify**

```bash
netlify deploy
```

**GitHub Pages**

- Build and push to `gh-pages` branch

---

## 📱 Responsive Design

### Breakpoints Used

- `max-sm:` — Hide dock, adjust layout on mobile
- `sm:` — Default small screens (640px+)
- `md:` — Medium screens (768px+)
- `lg:` — Large screens (1024px+)
- `3xl:` — Ultra-wide screens (1920px+)

### Mobile Considerations

- Dock hidden on mobile (`max-sm:hidden`)
- Navigation adjusted for small screens
- Welcome screen warning for small screens
- Touch-friendly hit targets (icons, buttons)
- Full viewport height/width for immersion

---

## 🔐 Security & Access

### Authentication

- **None** — This is a public portfolio
- No login required
- No user accounts or sessions

### Data Protection

- No sensitive data stored
- No backend authentication
- Static content only
- Safe for public deployment

### Privacy

- No analytics tracking (unless added separately)
- No data collection
- Purely informational

---

## 📈 Performance Optimization

### Code Splitting (Vite)

```javascript
// vite.config.js
rollupOptions: {
  output: {
    manualChunks(id) {
      if (id.includes("react-pdf")) return "pdf";
      if (id.includes("gsap")) return "gsap";
      if (id.includes("react/")) return "vendor";
    }
  }
}
```

### Asset Optimization

- Images served from `public/` with lazy loading
- Icons optimized as SVG where possible
- PDF served on-demand only
- Wallpaper background optimized for web

### Bundle Size

- React 19: ~42KB (gzipped)
- Tailwind CSS: ~60KB (gzipped)
- GSAP: ~40KB (gzipped)
- Zustand: ~2KB (gzipped)
- Other: ~30KB

### Performance Tips

1. Use Tailwind for utility styling (already minified)
2. Lazy load images with `loading="lazy"`
3. Keep animations smooth with GPU acceleration (transforms, opacity)
4. Use CSS containment for performance-heavy areas
5. Minimize GSAP timeline complexity

---

## 🐛 Known Limitations & Future Work

### Not Implemented

- ❌ Window minimize/maximize/close controls (UI exists, not functional)
- ❌ Keyboard shortcuts (Cmd+Q, Cmd+W, Tab navigation)
- ❌ Right-click context menus
- ❌ Trash/Recycle bin functionality
- ❌ Spotlight search (Cmd+Space)
- ❌ System notifications
- ❌ Settings/Preferences window
- ❌ Dark mode toggle (icon exists, not functional)
- ❌ Full mobile responsiveness (mainly desktop-focused)

### Future Enhancements

1. **Keyboard Navigation** — Cmd+Q to close, Cmd+W for windows, Tab for focus
2. **Touch Support** — Better mobile experience with touch-dragging
3. **Right-Click Menus** — Context menus on files/windows
4. **Search** — Spotlight-like search functionality
5. **Animations** — More complex transition effects
6. **Accessibility** — ARIA labels, keyboard navigation
7. **Themes** — Light/dark mode toggle
8. **Backend Integration** — Contact form submission
9. **Analytics** — Google Analytics or similar
10. **Progressive Web App** — Install as standalone app

---

## 🏗️ Architecture Patterns

### Design Patterns Used

#### 1. **Higher-Order Component (HOC) Pattern**

```javascript
// WindowWrapper is a HOC
const WrappedComponent = WindowWrapper(Component, "windowKey");
```

- Adds animation and drag behavior to windows
- Keeps window logic separate from presentation

#### 2. **Store Pattern (Zustand)**

```javascript
// Single store for window state
const useWindowStore = create(immer((set) => ({...})));
```

- Centralized state management
- Immutable updates with Immer

#### 3. **Configuration Pattern**

```javascript
// All data in constants
export const dockApps = [...];
export const blogPosts = [...];
```

- Separates data from logic
- Easy to update content

#### 4. **Render Function Pattern (Finder)**

```javascript
const renderList = (name, items) => <div>{/* rendered list */}</div>;
```

- Reusable rendering logic
- Keeps component clean

### Key Invariants

1. **Windows managed by store only** — No local window state
2. **Z-index strictly managed** — Store controls stacking order
3. **WindowWrapper handles animation** — No inline animation logic
4. **Data immutable during transit** — Use local state for modifications
5. **Static assets imported, not fetched** — Vite bundling
6. **Location independent of windows** — Orthogonal concerns
7. **GSAP properly cleaned up** — No memory leaks
8. **Tailwind + CSS Modules coexist** — Global + scoped styling

---

## 📚 File Dependencies Map

```
App.jsx
├── imports all windows (Terminal, Safari, Finder, etc.)
├── imports layout components (Navbar, Dock, Home)
└── registers GSAP Draggable

Navbar.jsx
├── useWindowStore → openWindow()
└── dayjs → time formatting

Dock.jsx
├── useWindowStore → windows, openWindow, closeWindow, restoreWindow
├── GSAP → icon hover animations
└── constants → dockApps data

Home.jsx
├── useLocationStore → setActiveLocation()
├── useWindowStore → openWindow()
└── GSAP → Draggable for folders

Windows (Finder, Safari, etc.)
├── WindowWrapper (HOC)
├── WindowControls component
└── window-specific constants data

WindowWrapper.jsx
├── GSAP → animations and Draggable
└── useWindowStore → focus, z-index

Stores
├── Window.js → manages window state
└── Location.js → manages navigation state

Constants
├── navLinks, dockApps, blogPosts
├── techStack, socials, photosLinks
├── gallery, WINDOW_CONFIG
└── INITIAL_Z_INDEX

CSS
├── index.css → global styles, fonts, custom utilities
├── App.css → legacy styles
└── component-specific CSS (in components)
```

---

## 🎓 Learning Outcomes

Working with this codebase teaches:

1. **React Concepts**
   - Component composition
   - Hooks (useState, useRef, useLayoutEffect, useGSAP)
   - HOCs for cross-cutting concerns
   - Event handling and state management

2. **Advanced Animations**
   - GSAP timeline and easing
   - Physics-based animations
   - Draggable behavior
   - Animation cleanup

3. **State Management**
   - Zustand for lightweight state
   - Immer for immutable updates
   - Multiple stores for separation of concerns

4. **Styling**
   - Tailwind CSS utility-first approach
   - CSS Modules for scoped styling
   - Responsive design patterns
   - Glassmorphism and modern CSS

5. **Build Tools**
   - Vite configuration and optimization
   - Code splitting strategies
   - Asset bundling and optimization

6. **UI/UX Patterns**
   - macOS interface conventions
   - Window management and z-index stacking
   - Interaction design and feedback
   - Responsive design considerations

---

## 🤝 Contributing & Customization

### Customizing Content

1. **Update Social Links** — Edit `src/constants/index.js`
2. **Add Blog Posts** — Add to `blogPosts` array
3. **Modify Tech Stack** — Update `techStack` array
4. **Change Gallery Images** — Update `gallery` and `photosLinks` arrays
5. **Update Resume** — Replace `public/files/resume.pdf`

### Adding New Windows

1. Create new window component in `src/windows/`
2. Export using WindowWrapper HOC
3. Add window key to `WINDOW_CONFIG` in constants
4. Add to `dockApps` array to make it launchable
5. Import in `App.jsx`

### Styling Customization

1. Modify `src/index.css` for global styles
2. Edit Tailwind theme in `@theme` section
3. Add custom utilities via `@utility` directive
4. Update component-specific CSS as needed

---

## 📞 Support & Resources

### Official Documentation

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [GSAP Documentation](https://gsap.com/docs)
- [Vite Documentation](https://vitejs.dev)

### Related Projects

- Original Inspiration: macOS Desktop UI
- Similar: Vercel Portfolio, Framer Portfolio Templates

---

## 📝 Conclusion

**macOS Porto** is a sophisticated portfolio application that demonstrates modern React development practices, advanced animation techniques, and thoughtful UI design. It's both a functional portfolio platform and a showcase of technical expertise. The clean architecture, proper state management, and animation system make it a great learning resource for aspiring React developers.

The modular structure makes it easy to customize, extend, and maintain. Whether you're looking to deploy it as your own portfolio or learn from its implementation, this project provides a solid foundation for interactive, engaging web applications.

---

**Last Updated:** 2024
**Version:** 1.0
**Status:** Production-Ready
