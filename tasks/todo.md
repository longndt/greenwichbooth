# Task Checklist — Greenwich Booth UI Redesign

## Phase 1: Foundation (CSS Tokens & Accessibility)

- [ ] Task 1: Add CSS token system (colors, spacing, type, radius)
  - Description: Define all design tokens in `:root` to replace magic numbers
  - Files: src/styles.css
  - Scope: XS (1 file)
  - Estimated time: 15 mins

- [ ] Task 2: Add accessibility rules (focus-visible, prefers-reduced-motion)
  - Description: Add :focus-visible outline + prefers-reduced-motion media query
  - Files: src/styles.css
  - Scope: XS (1 file)
  - Estimated time: 10 mins

- [ ] Task 3: Fix font loading (move Google Fonts from @import to preconnect)
  - Description: Move render-blocking @import to <link> in HTML
  - Files: index.html, src/styles.css
  - Scope: XS (2 files)
  - Estimated time: 5 mins

**Checkpoint 1:** All tokens defined, focus-visible works, build passes

---

## Phase 2: Component Redesigns (Visual Hierarchy)

- [ ] Task 4: Redesign header (72px height, gradient background)
  - Description: Increase header height, add gradient bg, enlarge title
  - Files: src/styles.css
  - Scope: XS (1 file)
  - Estimated time: 10 mins

- [ ] Task 5: Redesign tab bar (underline indicator, 16px text)
  - Description: Change active tab from background fill to animated underline
  - Files: src/styles.css
  - Scope: XS (1 file)
  - Estimated time: 15 mins

- [ ] Task 6: Collapse filter grid (4 hero + "Xem thêm" reveal)
  - Description: Hide filters 5–9, add toggle button to expand
  - Files: src/main.js, src/styles.css
  - Scope: S (2 files)
  - Estimated time: 25 mins

- [ ] Task 7: Collapse sticker grid (accessories + poster stickers)
  - Description: Same collapse pattern for accessories and poster stickers
  - Files: src/main.js, src/styles.css
  - Scope: S (2 files)
  - Estimated time: 25 mins

- [ ] Task 8: Enhance shoot button (18px padding, neon glow, hover scale)
  - Description: Larger button, add glow shadow, scale(1.04) on hover
  - Files: src/styles.css
  - Scope: XS (1 file)
  - Estimated time: 10 mins

**Checkpoint 2:** Header 72px, tab underline, grids collapsed, button enhanced, build passes

---

## Phase 3: UI States (User Confidence)

- [ ] Task 9: Implement empty state (step guidance in camera box)
  - Description: Show "🚀 Bắt đầu ngay!" + steps 1→2→3 before first shoot
  - Files: src/main.js, src/styles.css
  - Scope: M (2 files)
  - Estimated time: 30 mins

- [ ] Task 10: Implement loading state (progress bar, percentage, spinner)
  - Description: Add progress bar during buildPoster, show "Ảnh N/4" during countdown
  - Files: src/main.js, src/styles.css
  - Scope: M (2 files)
  - Estimated time: 35 mins

- [ ] Task 11: Implement success state (QR ready label, confirmation text)
  - Description: Label QR as "✓ Sẵn sàng", improve result screen feedback
  - Files: src/main.js, src/styles.css
  - Scope: M (2 files)
  - Estimated time: 20 mins

- [ ] Task 12: Add confirmation dialog before retake (dark pattern fix)
  - Description: Show dialog "Chụp lại sẽ xoá 4 ảnh..." before destroying photos
  - Files: src/main.js, src/styles.css
  - Scope: S (2 files)
  - Estimated time: 25 mins

**Checkpoint 3:** All 4 states working, retake confirmed, manual verification passed, build passes

---

## Phase 4: Polish (Modern Visuals)

- [ ] Task 13: Remove glassmorphism, add neon glows
  - Description: Remove backdrop-filter from 3 surfaces, add gold/emerald glow borders
  - Files: src/styles.css
  - Scope: M (1 file)
  - Estimated time: 20 mins

- [ ] Task 14: Add gradient accents (buttons, borders)
  - Description: Apply gradient backgrounds to active tabs, buttons; gradient borders
  - Files: src/styles.css
  - Scope: M (1 file)
  - Estimated time: 15 mins

- [ ] Task 15: Add smooth microinteractions (scale, shadow glow)
  - Description: Button hover scale(1.04), smooth 100–300ms transitions
  - Files: src/styles.css
  - Scope: S (1 file)
  - Estimated time: 15 mins

- [ ] Task 16: Vietnamese copy pass (all labels, simplified frame names)
  - Description: Translate remaining English labels, simplify frame names, verify consistency
  - Files: src/main.js
  - Scope: S (1 file)
  - Estimated time: 20 mins

**Checkpoint 4:** No glassmorphism, neon glows visible, all transitions smooth, Vietnamese labels consistent, build passes

---

## Final Verification

- [ ] **Manual Testing:**
  - [ ] Tab key navigation: Focus rings visible on all interactive elements
  - [ ] Camera opens successfully (or shows camera-error state)
  - [ ] Filter grid: Click filter, then "Xem thêm", verify grid expands and contracts
  - [ ] Shoot button: Hover effect glows, click disabled during shooting
  - [ ] Empty state: Before video starts, step guidance visible
  - [ ] Loading state: During buildPoster, progress bar animates
  - [ ] Success state: QR label shows, download button visible
  - [ ] Retake: Confirmation dialog appears, can cancel

- [ ] **Accessibility Check:**
  - [ ] Keyboard: Tab through all controls, focus rings gold + visible
  - [ ] Prefers-reduced-motion: Disable animations in browser prefs, verify no motion
  - [ ] ARIA labels: Inspect with DevTools, all buttons have labels

- [ ] **Build & Regression:**
  - [ ] `npm run build` succeeds
  - [ ] `npm run dev` starts without errors
  - [ ] No console warnings
  - [ ] Screenshot comparison with wireframes

- [ ] **Git Hygiene:**
  - [ ] 16 commits (one per task) in git log
  - [ ] Each commit is atomic (touches relevant files only)
  - [ ] No merge conflicts
  - [ ] All commits follow message template

---

## Summary

- **Total tasks:** 16
- **Phases:** 4 (Foundation → Components → States → Polish)
- **Checkpoints:** 4 (verify at end of each phase)
- **Estimated total time:** 4–5 hours (agent work)
- **Expected outcome:** Design audit score 11/30 → 22+/30, all 6 UI states visible, modern visuals, full Vietnamese copy

---

## Status Tracking

```
[ ] Foundation:        0/3 tasks
[ ] Components:        0/5 tasks
[ ] States:            0/4 tasks
[ ] Polish:            0/4 tasks
───────────────────────────────
[ ] TOTAL:             0/16 tasks
```

Last updated: 2026-08-01 (before autonomous build)
