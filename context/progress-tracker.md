# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Window Minimize Feature: **Complete** ✅

## Current Goal

- Window Minimize: Implement yellow button minimize + dock restore animation

## Completed

- ✅ Unit 1 — Store: Added `isMinimized` state + `minimizeWindow()` / `restoreWindow()` actions
- ✅ Unit 2 — Animation: GSAP minimize/restore animations with dynamic dock targeting
- ✅ Unit 3 — UI Wiring: Yellow button wired, dock toggle updated, visual indicators added
- ✅ Build passes with no errors

## In Progress

- None

## Next Up

- [ ] Maximize button functionality
- [ ] Keyboard shortcuts (Cmd+M to minimize, Cmd+W to close)
- [ ] Right-click context menus
- [ ] Window position memory (restore to original position, not dock center)

## Open Questions

- Should minimized window restore to original position or dock center? (Currently dock center)
- Should minimize/restore be animated differently on mobile/touch devices?
- How many windows can be minimized before performance degrades?

## Architecture Decisions

1. **Minimize Animation Target**: Uses dock center coordinates instead of specific dock icon position for simplicity and visual effect. Benefit: Single animation target, clean visual effect. Alternative: Could target individual icon position for more precision.

2. **Visibility vs Display**: Uses `visibility: hidden` instead of `display: none` for minimized windows to enable bidirectional GSAP animation. Benefit: Smooth reverse animation. Tradeoff: Window still takes up layout space (minimal impact since hidden).

3. **Dock Indicator**: White dot for open, gray dot for minimized (not separate remove/add). Benefit: Simpler logic, clearer state. Alternative: Could use icon opacity or different badge.

## Session Notes

- Minimized windows remain in DOM but invisible — safe for state restoration
- Dynamic dock selection via `getElementById("dock")` — ensure dock always has id="dock"
- GSAP cleanup automatic via `useGSAP` context — no manual kill needed
- Animation durations: 0.4s for minimize/restore (consistent with project style)
- All 8 windows support minimize (finder, contact, resume, safari, photos, terminal, txtfile, imgfile)
- No changes needed to individual window components — HOC handles all behavior
- Ready for keyboard shortcuts implementation next phase
