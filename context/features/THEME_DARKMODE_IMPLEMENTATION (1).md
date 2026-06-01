# Implementation Plan - Dark Mode & Theme Control Panel

Add a macOS Control Center-style theme switcher to the navbar, supporting **Light**, **Dark**, and **System (Auto)** themes using `next-themes`.

This is a **purely additive change** — zero logic or layout changes to existing code.

---

## User Review Required

> [!IMPORTANT]
> - `next-themes` will be added as a new dependency in `package.json`.
> - `src/main.tsx` will be wrapped with `<ThemeProvider>` — only wrapping, no logic change.
> - `src/index.css` will receive a new `.dark { }` block only — existing `:root` variables stay untouched.
> - A new `ThemePanel.tsx` component will be created in `src/components/`.
> - `Navbar.tsx` will replace the static `id: 4` icon render (mode.svg) with `<ThemePanel />`.
> - `src/types.ts` will add one new type: `ThemePanelProps` (optional, for full type safety).

---

## Proposed Changes

### Dependencies

#### [MODIFY] `package.json`
Add `next-themes` to dependencies:

```diff
  "dependencies": {
+   "next-themes": "^0.4.6",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    ...
  }
```

---

### Entry Point

#### [MODIFY] `src/main.tsx`
Wrap the app with `ThemeProvider`. Keep everything else identical:

```diff
+import { ThemeProvider } from 'next-themes'
 import App from './App'
 import './index.css'

 ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
+    <ThemeProvider
+      attribute="class"
+      defaultTheme="system"
+      enableSystem
+      disableTransitionOnChange={false}
+    >
       <App />
+    </ThemeProvider>
   </React.StrictMode>
 )
```

---

### Type Definitions

#### [MODIFY] `src/types.ts`
Add type for the ThemePanel component (optional but recommended):

```diff
+ export type Theme = 'light' | 'dark' | 'system'
+
+ export interface ThemeConfig {
+   id: Theme
+   label: string
+   icon: string
+ }
```

---

### Styling

#### [MODIFY] `src/index.css`
Keep **all existing `:root` variables untouched**. Append a new `.dark {}` block **at the end of the file** with overrides matching the existing token naming convention:

```css
/* === DARK THEME — append only to end of file === */
.dark {
  /* Override existing color tokens for dark mode */
  /* Examples (agent fills based on actual :root tokens): */
  /* --bg-primary: #1a1a1a; */
  /* --text-primary: #f5f5f5; */
  /* --border-color: rgba(255, 255, 255, 0.1); */
  /* etc. */
}

/* Panel Styling */
.theme-panel-wrapper {
  position: relative;
  display: inline-block;
}

.theme-icon-btn {
  /* Match existing navbar icon button styling */
}

.theme-panel {
  /* Floating panel with backdrop-filter, border-radius, shadow */
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  /* Agent: use existing design tokens for colors, spacing, etc. */
}

@keyframes panelIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(-8px);
    transform-origin: top right;
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    transform-origin: top right;
  }
}

.theme-panel {
  animation: panelIn 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-option {
  /* Flex row with icon + label, hover + active states */
}

.theme-option.active {
  /* Use existing blue accent color */
}
```

---

### New Component

#### [NEW] `src/components/ThemePanel.tsx`
A floating panel triggered by clicking the navbar mode icon. Uses the existing `/icons/mode.svg` icon.

```tsx
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import type { Theme, ThemeConfig } from '#types'

const themes: ThemeConfig[] = [
  { id: 'light',  label: 'Light',  icon: '☀️' },
  { id: 'dark',   label: 'Dark',   icon: '🌙' },
  { id: 'system', label: 'Auto',   icon: '💻' },
]

export default function ThemePanel() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    setOpen(false)
  }

  return (
    <div ref={panelRef} className="theme-panel-wrapper">
      {/* Trigger button — reuse existing mode.svg icon */}
      <button
        className="theme-icon-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle theme panel"
        aria-expanded={open}
      >
        <img src="/icons/mode.svg" alt="theme" width={20} height={20} />
      </button>

      {/* Floating Panel */}
      {open && (
        <div className="theme-panel" role="menu">
          <p className="theme-panel-title">Appearance</p>
          <div className="theme-options">
            {themes.map((t) => (
              <button
                key={t.id}
                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(t.id as Theme)}
                role="menuitem"
                aria-current={theme === t.id}
              >
                <span className="theme-option-icon">{t.icon}</span>
                <span className="theme-option-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

#### [MODIFY] `src/components/index.ts`
Export the new component:

```diff
export { default as WindowControls } from './WindowControls'
export { default as Navbar } from './Navbar'
export { default as Dock } from './Dock'
export { default as Welcome } from './Welcome'
export { default as Home } from './Home'
+export { default as ThemePanel } from './ThemePanel'
```

---

### Wire Up to Navbar

#### [MODIFY] `src/components/Navbar.tsx`
Import `ThemePanel` and replace the static `id: 4` icon render with it:

```diff
+import { ThemePanel } from '#components'
 import useWindowStore from '#store/Window'
 import dayjs from 'dayjs'

 const Navbar = () => {
   // ... existing code ...

   return (
     <nav className="navbar">
       {/* Left side — existing code unchanged */}
       <div className="navbar-left">
         {/* ... existing items ... */}
       </div>

       {/* Right side — replace id: 4 icon with ThemePanel */}
       <div className="navbar-right">
         {navIcons.map((icon) =>
           icon.id === 4 ? (
+            <ThemePanel key={icon.id} />
           ) : (
             <button key={icon.id} className="navbar-icon">
               <img src={icon.img} alt="" width={20} height={20} />
             </button>
           )
         )}
       </div>
     </nav>
   )
 }

 export default Navbar
```

---

## File Structure Impact

```
src/
├── components/
│   ├── ThemePanel.tsx    ← NEW
│   ├── Navbar.tsx        ← MODIFY (replace id:4 icon render)
│   └── index.ts          ← +1 export line
├── index.css             ← MODIFY (append .dark {} + panel styles)
├── main.tsx              ← MODIFY (wrap with <ThemeProvider>)
├── types.ts              ← MODIFY (add Theme & ThemeConfig types)
└── ...other files unchanged...

package.json              ← MODIFY (add next-themes dependency)
```

---

## Verification Plan

### Pre-Implementation Checklist
- [ ] Project builds cleanly with `npm run build`
- [ ] `npm run dev` starts without errors
- [ ] All existing windows, dock, and navbar functionality works

### Build Verification
```bash
npm install                    # Install next-themes
npm run build                  # Should succeed with zero errors
```

### Manual Verification (Post-Implementation)

**Theme Switching**
- [ ] Click mode icon in navbar → panel appears with smooth animation
- [ ] Click **Light** → page switches to light theme immediately
- [ ] Click **Dark** → page switches to dark theme immediately
- [ ] Click **Auto** → page follows OS system preference
- [ ] Click outside panel → panel closes smoothly

**Persistence**
- [ ] Refresh page → previously selected theme persists
- [ ] Close browser → reopen → theme still saved
- [ ] Switch OS theme → Auto mode detects and updates

**Design Integration**
- [ ] Panel styling matches existing navbar (glassmorphism, colors, spacing)
- [ ] Dark colors read well (sufficient contrast)
- [ ] Light colors remain unchanged (existing design untouched)
- [ ] Icons and text in panel visible in both themes

**Functionality Preserved**
- [ ] All windows open/close/minimize/maximize as before
- [ ] Dock icons scale on hover as before
- [ ] Window dragging works as before
- [ ] Animations smooth (no jank)
- [ ] No console errors

### Browser Compatibility Check
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Why `next-themes`?

| Feature | `next-themes` | Manual `localStorage` |
|---|---|---|
| **Zero flash on load** | ✅ Prevents theme flicker | ❌ Needs inline script |
| **Follow OS preference** | ✅ Built-in with `enableSystem` | ❌ Manual `matchMedia` |
| **Persists theme** | ✅ `localStorage` handled internally | ✅ Manual setup required |
| **Vite compatible** | ✅ No SSR needed | ✅ Works anywhere |
| **API simplicity** | ✅ 2 lines: `useTheme()`, `setTheme()` | ❌ 20+ lines custom hook |
| **TypeScript support** | ✅ Full types exported | ⚠️ Need custom types |
| **Bundle size** | ~2kb | 0kb (manual code) |

---

## Important Notes

### Color Token Naming
- **Existing `:root` tokens stay exactly as-is** — no renames, no changes
- **`.dark` block mirrors the same token names** — only changes values
- Example: if `:root` has `--bg-primary: white`, `.dark` has `--bg-primary: #1a1a1a`
- The coding agent will read existing tokens and provide dark counterparts

### Animation Timings
- Panel open: **0.18s** spring easing (matches macOS Control Center feel)
- No flash between theme changes — `disableTransitionOnChange={false}` allows smooth CSS transition

### Accessibility
- Panel uses semantic `role="menu"` and `role="menuitem"`
- ARIA attributes: `aria-label`, `aria-expanded`, `aria-current`
- Keyboard navigation: Tab/Enter to select theme (native browser support)

### Mobile Considerations
- Panel `transform-origin: top right` — appears in top-right corner (accessible)
- Touch-friendly button sizes (`20x20px` icon + padding)
- No hover-only interactions — all state reflected in UI

---

## Rollback Plan

If issues arise, simply:
1. `npm uninstall next-themes`
2. Revert `src/main.tsx` (remove ThemeProvider wrapper)
3. Revert `src/components/Navbar.tsx` (show static icon for id:4)
4. Delete `src/components/ThemePanel.tsx`
5. Remove `.dark {}` from `src/index.css`

**Zero breaking changes to any other feature.**

---

## Next Steps After Implementation

Once complete and verified:
1. Consider adding theme persistence UI indicator (optional: show current theme in navbar)
2. Test with real users across devices
3. Gather feedback on dark mode contrast and readability
4. Iterate on dark color values if needed
5. Document dark mode customization in project docs

