# Window Minimize Implementation — Complete

**Date**: May 12, 2026  
**Status**: ✅ COMPLETED  
**Build**: ✅ Passing

---

## Implementation Summary

Successfully implemented all 3 units of the Window Minimize feature per the feature plan.

### Unit 1: Store State Management ✅

**File**: `src/store/Window.js`

- Added `isMinimized` flag to all window entries (initialized to `false`)
- Added `minimizeWindow(windowKey)` action → sets `isMinimized: true`
- Added `restoreWindow(windowKey)` action → sets `isMinimized: false` + refocuses window (increments z-index)
- Updated `openWindow()` → resets `isMinimized: false` when opening
- Updated `closeWindow()` → resets `isMinimized: false` when closing

**Store Exports**: `{ minimizeWindow, restoreWindow }` now available for components

### Unit 2: Animation Lifecycle ✅

**File**: `src/hoc/WindowWrapper.jsx`

- Added `isMinimized` destructuring from store
- **Minimize Animation**:
  - Finds dock element dynamically via `getElementById("dock")`
  - Calculates dock center coordinates (left, top)
  - Animates window to dock with GSAP:
    - `scale: 1 → 0.3` (shrinks)
    - `opacity: 1 → 0` (fades)
    - `x, y: 0 → offsetX, offsetY` (translates to dock)
    - Duration: 0.4s with `power3.in` easing

- **Restore Animation** (reverse):
  - Animates from minimized position back to original
  - `scale: 0.3 → 1`, `opacity: 0 → 1`, `x/y → 0`
  - Duration: 0.4s with `power3.out` easing

- **Visibility Handling**:
  - Uses `visibility: hidden` (not `display: none`) to allow GSAP bidirectional animation
  - `visibility: visible` set when restored
  - `display: block/none` only for open/closed state

- **Cleanup**: GSAP animations auto-cleanup via `useGSAP` context

### Unit 3: UI Wiring ✅

#### WindowControls.jsx

- Yellow minimize button now calls `minimizeWindow(target)` (was non-functional before)

#### Dock.jsx

- Updated `toggleApp()` logic:
  - If window is open AND minimized → call `restoreWindow()` (restore from dock)
  - If window is open AND not minimized → call `closeWindow()` (close window)
  - If window is closed → call `openWindow()` (open window)

- Added **visual indicator** for window state on dock icons:
  - White dot indicator = window open and running
  - Gray dot indicator = window open but minimized
  - No dot = window closed
  - Indicator positioned at bottom-center of dock icon

---

## Architecture Compliance ✅

| Invariant                                  | Status                                |
| ------------------------------------------ | ------------------------------------- |
| Only `useWindowStore` mutates window state | ✅ All mutations via store actions    |
| Z-index never set directly via CSS         | ✅ Only store updates z-index         |
| `WindowWrapper` owns animation lifecycle   | ✅ All window animations in HOC       |
| GSAP instances killed on cleanup           | ✅ Auto-cleanup via `useGSAP` context |
| Window data immutable during transit       | ✅ No data mutations on minimize      |

---

## Feature Behavior

### User Flow: Minimize

1. User clicks **yellow button** on window header
2. `WindowControls` calls `minimizeWindow(windowKey)`
3. Store sets `isMinimized: true`
4. `WindowWrapper` detects change via `useGSAP` dependency
5. GSAP animates window shrinking/fading toward dock center
6. Window reaches minimized state (invisible but still in DOM)

### User Flow: Restore

1. User clicks **dock icon** for minimized window
2. `Dock` detects `isMinimized === true`
3. `Dock` calls `restoreWindow(windowKey)` (instead of toggle)
4. Store sets `isMinimized: false` + increments z-index (brings to front)
5. `WindowWrapper` detects change
6. GSAP animates window expanding/fading back to original position
7. Window appears at full size and front of stack

### Dock Indicator

- **White dot**: Window open and running (user can interact)
- **Gray dot**: Window open but minimized (user can click to restore)
- **No dot**: Window closed

---

## Code Changes Summary

### Files Modified: 5

1. **src/store/Window.js**
   - Added 2 new actions: `minimizeWindow()`, `restoreWindow()`
   - Modified `openWindow()`, `closeWindow()` for state cleanup

2. **src/constants/index.js**
   - Added `isMinimized: false` to all 8 window entries in `WINDOW_CONFIG`

3. **src/hoc/WindowWrapper.jsx**
   - Added minimize/restore animation logic with dynamic dock targeting
   - Changed display handling from `display: none` to `visibility: hidden`
   - Added GSAP animation for minimize/restore transitions

4. **src/components/WindowControls.jsx**
   - Wired yellow button to call `minimizeWindow(target)`

5. **src/components/Dock.jsx**
   - Updated `toggleApp()` to handle `isMinimized` state
   - Added visual indicator (white/gray dot) for window state

---

## Build Status

```
✓ 1790 modules transformed
✓ built in 1.10s

Output:
- dist/index.html (0.82 kB gzip)
- dist/assets/*.js (total ~232.79 kB gzip)
- dist/assets/*.css (total ~8.77 kB gzip)
```

**✅ No errors, no warnings**

---

## Testing Checklist

- [ ] Open a window (e.g., Terminal)
- [ ] Click yellow minimize button → should shrink/fade to dock
- [ ] Observe white dot → gray dot indicator change on dock icon
- [ ] Click dock icon → window should restore to original position/size
- [ ] Multiple windows: minimize one, check z-index focus on restore
- [ ] Close minimized window → should close without animation reversal
- [ ] Re-open same window → should open fresh (not minimized)

---

## Known Limitations

1. **Dock Position**: Currently targets dock center. Could be refined to dock icon position for more precise animation.
2. **Mobile**: Minimize behavior untested on touch devices (dock typically not present on mobile, design should adapt).
3. **Multiple Monitors**: Not tested; animation targets viewport-relative dock position (may not work across displays).

---

## Next Steps (Future Enhancements)

- [ ] **Maximize Button**: Add functionality to yellow button (currently non-functional)
- [ ] **Keyboard Shortcuts**: Cmd+M to minimize, Cmd+W to close
- [ ] **Right-click Menu**: Context menu with minimize/maximize/close options
- [ ] **Window Restore Position**: Remember previous position when restoring (not dock center)
- [ ] **Animation Polish**: Adjust easing, duration, or scale factor based on testing
- [ ] **Accessibility**: Add ARIA labels for screen readers (minimized state announcement)

---

## Feature Plan Status: DONE ✅

Per `rules.md`:

- ✅ Pre-implementation checklist complete
- ✅ Unit 1: Store — DONE
- ✅ Unit 2: Animation — DONE
- ✅ Unit 3: UI Wiring — DONE
- ✅ Done criteria met (no architecture violations, build passes)
- ✅ `progress-tracker.md` ready for update

---

**Time to Implement**: ~30 minutes  
**Complexity**: Medium  
**Risk**: Low (isolated changes, no dependencies on other windows)
