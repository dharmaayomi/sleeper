# macOS Porto - Developer Quick Reference

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

---

## 📁 File Structure at a Glance

```
src/
├── components/       # Navbar, Dock, Welcome, Home, WindowControls
├── windows/          # Finder, Safari, Terminal, Resume, Contact, Photos, Text, Image
├── store/            # Window.js, Location.js (Zustand state)
├── hoc/              # WindowWrapper.jsx (animation + drag HOC)
├── constants/        # Configuration & data
└── assets/           # Static assets
```

---

## 🔧 Common Tasks

### Add a New Window

1. Create `src/windows/MyWindow.jsx`:

```jsx
import WindowWrapper from "#hoc/WindowWrapper";
import { WindowControls } from "#components";

const MyWindow = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="mywindow" />
        <h2>My Window</h2>
      </div>
      <div>Content here</div>
    </>
  );
};

const MyWindowWrapped = WindowWrapper(MyWindow, "mywindow");
export default MyWindowWrapped;
```

2. Update `src/constants/index.js`:

```javascript
// Add to WINDOW_CONFIG
mywindow: { isOpen: false, zIndex: 0, isMinimized: false, data: null }

// Add to dockApps
{ id: "mywindow", name: "My App", icon: "myapp.png", canOpen: true }
```

3. Import in `src/App.jsx`:

```jsx
import { MyWindow } from "#windows";
// Add to JSX: <MyWindow />
```

### Update Social Links

Edit `src/constants/index.js`:

```javascript
const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/yourprofile",
  },
  // Add more...
];
```

### Add Blog Posts

Edit `src/constants/index.js`:

```javascript
const blogPosts = [
  {
    id: 1,
    date: "Sep 2, 2025",
    title: "Your Post Title",
    image: "/images/blog1.png",
    link: "https://yourblog.com/post",
  },
  // Add more...
];
```

### Modify Tech Stack

Edit `src/constants/index.js`:

```javascript
const techStack = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "TypeScript"],
  },
  // Update as needed
];
```

### Change Colors & Styling

Edit `src/index.css`:

- Custom theme in `@theme { ... }`
- Component styles in `@layer components`
- Utilities in `@layer utilities`

### Add Navigation Link

Edit `src/constants/index.js`:

```javascript
const navLinks = [
  { id: 1, name: "Projects", type: "finder" },
  { id: 2, name: "My New Link", type: "mywindow" }, // Add this
];
```

---

## 🎨 Styling Quick Reference

### Tailwind Classes

```jsx
// Layout
<div className="flex items-center justify-center gap-4">

// Colors
<div className="bg-white/50 text-gray-200">

// Responsive
<div className="max-sm:hidden sm:block md:flex">

// Animation helpers (handled by GSAP, not CSS)
```

### Custom Utilities

```jsx
// Flex centered
<div className="flex-center">

// Column centered
<div className="col-center">

// Absolute centered
<div className="abs-center">
```

### Font Families

```jsx
<p className="font-inter">Regular UI text</p>
<h1 className="font-georama">Decorative heading</h1>
<code className="font-roboto-mono">Code/terminal</code>
```

---

## 🪟 Window Management

### Open Window

```jsx
import useWindowStore from "#store/Window";

const { openWindow } = useWindowStore();

// Open window
openWindow("finder");

// Open with data
openWindow("finder", { folder: "projects" });
```

### Close Window

```jsx
import useWindowStore from "#store/Window";

const { closeWindow } = useWindowStore();
closeWindow("finder");
```

### Focus Window (bring to front)

```jsx
const { focusWindow } = useWindowStore();
focusWindow("finder");
```

### Minimize/Restore

```jsx
const { minimizeWindow, restoreWindow } = useWindowStore();
minimizeWindow("finder");
restoreWindow("finder");
```

---

## 📍 Navigation (Location Store)

### Change Active Location

```jsx
import useLocationStore from "#store/Location";

const { setActiveLocation } = useLocationStore();
setActiveLocation(newLocation);
```

### Get Current Location

```jsx
import useLocationStore from "#store/Location";

const { activeLocation } = useLocationStore();
```

### Reset to Default

```jsx
const { resetActiveLocation } = useLocationStore();
resetActiveLocation();
```

---

## ✨ Animation with GSAP

### Window Animation (in WindowWrapper HOC)

```javascript
// Open animation
gsap.fromTo(
  el,
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

### Custom Animation in Component

```jsx
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MyComponent = () => {
  useGSAP(() => {
    gsap.to(".element", {
      duration: 1,
      x: 100,
      ease: "power2.out",
    });
  }, []);

  return <div className="element">Animated</div>;
};
```

### Draggable

```jsx
import { Draggable } from "gsap/Draggable";
import gsap from "gsap";

// In useGSAP hook:
gsap.registerPlugin(Draggable);
const [instance] = Draggable.create(".element");

// Cleanup
return () => instance.kill();
```

---

## 🔄 State Flow

```
User clicks dock app
    ↓
Dock.jsx calls openWindow("finder")
    ↓
useWindowStore updates: windows.finder.isOpen = true
    ↓
WindowWrapper detects change
    ↓
GSAP animation plays
    ↓
Window appears on screen
```

---

## 🧪 Debugging Tips

### Check Window State

```jsx
import useWindowStore from "#store/Window";

const windows = useWindowStore((state) => state.windows);
console.log(windows);
```

### Check Location State

```jsx
import useLocationStore from "#store/Location";

const activeLocation = useLocationStore((state) => state.activeLocation);
console.log(activeLocation);
```

### GSAP Debugging

```javascript
// Log all active tweens
console.log(gsap.to(".element"));

// Kill all animations
gsap.killAll();

// Check Draggable instances
console.log(Draggable.getAll());
```

---

## 🚨 Common Issues & Solutions

### Window not appearing?

- Check if `isOpen` is `true` in store
- Verify window key matches in WINDOW_CONFIG
- Ensure WindowWrapper is applied correctly

### Animation not working?

- Check if useGSAP hook is properly set up
- Verify ref is attached to element
- Make sure GSAP cleanup is done
- Check console for errors

### Dock icon not scaling?

- Verify dock event listeners are attached
- Check mouse coordinates calculation
- Ensure icons have `.dock-icon` class

### Navigation not working?

- Check navLinks in constants
- Verify window key matches window component id
- Ensure openWindow is called with correct key

---

## 📦 Build & Deploy

### Local Build

```bash
npm run build
```

Outputs to `dist/` folder

### Preview Build

```bash
npm run preview
```

Serves production build locally

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## 🎯 Important Patterns

### Always wrap windows with WindowWrapper

```jsx
// ✅ Correct
const MyWindowWrapped = WindowWrapper(MyWindow, "mywindow");
export default MyWindowWrapped;

// ❌ Wrong
export default MyWindow;
```

### Use store methods, not direct state mutation

```jsx
// ✅ Correct
openWindow("finder");

// ❌ Wrong
useWindowStore.setState((state) => {
  state.windows.finder.isOpen = true;
});
```

### Clean up GSAP instances

```jsx
// ✅ Correct
useGSAP(() => {
  const [instance] = Draggable.create(el);
  return () => instance.kill();
}, []);

// ❌ Wrong
Draggable.create(el); // Memory leak!
```

---

## 📚 Useful Links

- [React Docs](https://react.dev)
- [GSAP Docs](https://gsap.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)

---

## 🔑 Key Files to Know

| File                        | Purpose                           |
| --------------------------- | --------------------------------- |
| `src/App.jsx`               | Main component, renders all parts |
| `src/store/Window.js`       | Window state management           |
| `src/store/Location.js`     | Navigation state                  |
| `src/hoc/WindowWrapper.jsx` | Animation & drag HOC              |
| `src/constants/index.js`    | All configuration data            |
| `src/index.css`             | Global styles & Tailwind          |
| `vite.config.js`            | Build configuration               |

---

**Need more help?** Check [COMPLETE_PROJECT_DOCUMENTATION.md](./COMPLETE_PROJECT_DOCUMENTATION.md) for detailed guides!
