# Implementation Plan: Greenwich Booth UI Redesign

## Overview

Modernize Greenwich Booth UI to be professional + youthful + on-brand. Fix design audit verdict (11/30 → target 22+/30) by implementing all 6 UI states, reducing choice overload, modernizing visuals, and improving accessibility. Priority: CSS tokens foundation → UI states → modern visuals → copy consistency.

## Architecture Decisions

1. **CSS Tokens First:** Define all color, spacing, type, radius tokens in `:root` before any component work. This ensures consistency and makes later tweaks easy.
2. **Progressive Disclosure for Grids:** Collapse 16-frame and sticker grids to 4 hero + "Xem thêm" button. Reduces cognitive load while preserving full feature set.
3. **State Management via CSS Classes:** Use `.hidden`, `.active`, `.disabled`, `.filled` classes instead of inline styles. Easier to test, debug, and maintain.
4. **No Breaking Changes:** Preserve camera layout (70/30), 2×2 poster format, Lion mascot, brand colors. Only visual + UX polish.
5. **Sequential Task Order:** Build CSS foundation first, then component redesigns, then states, then polish. Each task leaves system in working state.

## Task List

### Phase 1: Foundation (CSS Tokens & Accessibility)

- [ ] **Task 1:** Add CSS token system (colors, spacing, type, radius) — styles.css `:root`
- [ ] **Task 2:** Add accessibility rules (`:focus-visible`, `prefers-reduced-motion`) — styles.css
- [ ] **Task 3:** Fix font loading (move Google Fonts from @import to <link preconnect>) — index.html

### Checkpoint: Foundation
- [ ] All tokens defined and used (grep for magic numbers should return <10 results)
- [ ] `:focus-visible` 3px gold outline visible on any button with Tab key
- [ ] `npm run build` succeeds without errors

### Phase 2: Component Redesigns (Visual Hierarchy)

- [ ] **Task 4:** Redesign header (72px height, gradient background) — styles.css
- [ ] **Task 5:** Redesign tab bar (underline indicator, 16px text) — styles.css
- [ ] **Task 6:** Collapse filter grid (4 hero + "Xem thêm" reveal) — main.js + styles.css
- [ ] **Task 7:** Collapse sticker grid (4 hero + collapse pattern) — main.js + styles.css
- [ ] **Task 8:** Enhance shoot button (18px padding, neon glow, hover scale) — styles.css

### Checkpoint: Components
- [ ] Header is 72px with gradient background
- [ ] Tab bar shows animated underline on active tab
- [ ] Filter grid shows 4 swatches, "Xem thêm" expands to 9
- [ ] Shoot button glows and scales on hover
- [ ] No visual regressions in camera/result overlays
- [ ] `npm run build` succeeds

### Phase 3: UI States (User Confidence)

- [ ] **Task 9:** Implement empty state (step guidance in camera box) — main.js + styles.css
- [ ] **Task 10:** Implement loading state (progress bar, percentage, spinner) — main.js + styles.css
- [ ] **Task 11:** Implement success state (QR ready label, confirmation text) — main.js + styles.css
- [ ] **Task 12:** Add confirmation dialog before retake (dark pattern fix) — main.js + styles.css

### Checkpoint: States
- [ ] Empty state shows before first shoot (hidden when video loads)
- [ ] Loading state shows progress bar during buildPoster (0–100% over 40s)
- [ ] Success state labels QR code as "✓ Sẵn sàng"
- [ ] Retake shows confirmation dialog, cancellable
- [ ] All 4 states verified manually
- [ ] `npm run build` succeeds

### Phase 4: Polish (Modern Visuals)

- [ ] **Task 13:** Remove glassmorphism, add neon glows — styles.css
- [ ] **Task 14:** Add gradient accents (buttons, borders) — styles.css
- [ ] **Task 15:** Add smooth microinteractions (scale, shadow glow) — styles.css
- [ ] **Task 16:** Vietnamese copy pass (all labels, simplified frame names) — main.js

### Checkpoint: Complete
- [ ] No glassmorphism (backdrop-filter removed from 3 surfaces)
- [ ] Active elements glow with gold or emerald
- [ ] Buttons scale on hover, smooth 100–300ms transitions
- [ ] All user-facing text in Vietnamese, no label-behavior mismatches
- [ ] Run `/verify` to screenshot result and compare against wireframes
- [ ] `npm run build` succeeds, no regressions
- [ ] All 12 tasks committed (clean git log)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| CSS tokens not used everywhere → inconsistency | Medium | Grep src/styles.css for `rgba(`, `#`, hardcoded sizes. Replace in tasks 1–2. |
| Grid collapse hides features → user confusion | Low | "Xem thêm" button clearly visible, UX pattern familiar (Korean photo booths). Test with user if time allows. |
| Loading bar doesn't reach 100% on time | Medium | Use `animation: progress 40s ease-in-out` with animation-timing calibration. Test on target hardware. |
| Focus outlines clash with dark background | Low | Use gold (#FFCB2F) outline with 3px width + 2px offset. High contrast verified. |
| Confirmation dialog blocks UX flow | Low | Add quick close (Esc key) + clear button labels. Keep dialog simple. |
| Copy pass misses edge cases | Low | Search codebase for hardcoded strings (grep `'.*'`), verify every label is Vietnamese. |

## Open Questions

- Should empty state show step badges (1→2→3) or just text guidance? **→ Use both (badges visual, text descriptive)**
- Progress bar precision: Estimate 40s or actual timer? **→ Use actual `buildPoster` timing if available, else estimate 40s linear**
- Confirmation dialog: Modal overlay or inline? **→ Modal overlay (align with result screen pattern)**
- After retake, should we reset to empty state or go straight to camera? **→ Reset to empty state (user flow clarity)**

## Files Likely Touched

- `src/styles.css` — 80% of changes (tokens, colors, layout, animations)
- `src/main.js` — 20% of changes (state UI, confirmation dialog, Vietnamese labels)
- `index.html` — Font loading optimization (1 line change)

## Estimated Scope

- **Total tasks:** 16
- **Total files:** 3 (styles.css, main.js, index.html)
- **Estimated agent work:** ~4–6 focused sessions (one task = 15–30 mins, depends on complexity)
- **Expected commits:** 16 (one per task, clean rollback)
- **Build time per task:** ~30 seconds

## Implementation Order Rationale

1. **Tasks 1–3 (Foundation):** Must run first. Tokens are used by everything; accessibility is a gate condition.
2. **Tasks 4–8 (Components):** Independent redesigns, no state complexity. Can parallelize if needed, but sequential is simpler for git history.
3. **Tasks 9–12 (States):** Dependent on tokens + component structure. Must follow phase 2.
4. **Tasks 13–16 (Polish):** Refinement layer. Can run in parallel with phase 3, but safer sequential for verification.

## Definition of Done (Per Task)

- [ ] Code written follows existing style (no new patterns introduced)
- [ ] Acceptance criteria all met
- [ ] Verification steps all passed (build, manual check)
- [ ] No regressions (existing features still work)
- [ ] One atomic commit with descriptive message
- [ ] Task marked complete in `tasks/todo.md`

## Next Step

Present this plan for human approval. If approved, proceed with autonomous `/build auto` execution starting Task 1.
