# Feature Plan: Window Minimize

## Overview

Add minimize functionality to the yellow window control button. Minimizing hides the window visually with a GSAP animation toward the dock, without closing it. Clicking the dock icon restores it.

---

## Scope

### In Scope

- `src/store/Window.js` — add `isMinimized` state + actions
- `src/hoc/WindowWrapper.jsx` — animate minimize/restore via GSAP
- `src/components/WindowControls.jsx` — wire yellow button to `minimizeWindow`
- `src/components/Dock.jsx` — restore on click if minimized, visual indicator

### Out of Scope (Do Not Touch)

- All window components (`Terminal`, `Safari`, `Finder`, etc.)
- `useLocationStore`
- `src/constants/` — window definitions unchanged
- Tailwind config / global styles

---

## Invariant Compliance

| Invariant                                  | Compliant      |
| ------------------------------------------ | -------------- |
| Only `useWindowStore` mutates window state | ✅             |
| Z-index not set directly via CSS           | ✅             |
| `WindowWrapper` owns animation lifecycle   | ✅             |
| GSAP instances killed on cleanup           | ✅ must verify |
| Window data immutable during transit       | ✅             |

---

## Implementation Units

### Unit 1 — Store: `isMinimized` State

**Files**: `src/store/Window.js`

- Add `isMinimized: false` to every window entry
- Add `minimizeWindow(key)` → sets `isMinimized: true`
- Add `restoreWindow(key)` → sets `isMinimized: false`
- `closeWindow(key)` → also resets `isMinimized: false`
- `openWindow()` unchanged

**Verification**: Store state updates correctly when actions are called.

---

### Unit 2 — WindowWrapper: Animate Minimize / Restore

**Files**: `src/hoc/WindowWrapper.jsx`

- `useEffect` watches `isMinimized`
- On minimize: GSAP animates scale → 0.5, translateY → toward dock, opacity → 0; then set `visibility: hidden`
- On restore: set `visibility: visible` first, then GSAP reverse animate to original scale/position/opacity
- Use `visibility` (not `display: none`) so GSAP can animate both directions
- Kill animation instance in cleanup

**Verification**: Window visually minimizes and restores without page reload.

---

### Unit 3 — WindowControls + Dock Wiring

**Files**: `src/components/WindowControls.jsx`, `src/components/Dock.jsx`

- `WindowControls.jsx`: yellow button calls `minimizeWindow(windowKey)`
- `Dock.jsx`: if `isOpen && isMinimized`, clicking the icon calls `restoreWindow` instead of the existing toggle
- Dock icon shows a different visual state for minimized windows (e.g. dimmed dot indicator vs solid dot for running)

**Verification**: Full flow works — minimize via button, restore via dock click.

---

## Open Questions

1. **Dock position**: Is the dock always at the bottom? Can `translateY(100vh)` be used as the minimize target, or do we need dynamic coordinates from the dock element?
2. **WindowControls props**: Does `WindowControls.jsx` already receive `windowKey` as a prop? Needs verification before Unit 3.
3. **Dock indicator style**: Use existing dot indicator with different opacity for minimized, or add a distinct style?

> Resolve these before starting Unit 2 and Unit 3.

---

## Pre-Implementation Checklist

- [ ] Open questions above are answered
- [ ] `npm run build` passes on current codebase before any changes

## Done Criteria (per unit)

- [ ] Unit works end to end within its defined scope
- [ ] No architecture invariant violated
- [ ] `npm run build` passes
- [ ] `progress-tracker.md` updated
