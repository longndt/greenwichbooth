# Verdict — REDESIGN (11/30)

**Re-audit shows no change in score from prior assessment (11/30) despite navbar cosmetics and favicon additions.** The core design gaps driving the REDESIGN verdict remain:

1. **Principle #8 (Thorough) = 0/3** — Missing 4 of 6 critical UI states (empty, loading detail, success, focus-visible). These are not decorative; they are structural trust signals that require redesigning the state layer.

2. **Principle #2 (Useful) = 1/3** — 31 customizations (frame + filter + sticker selections) before primary CTA create choice overload; Retake button destroys photos without confirmation (dark pattern).

3. **Principle #10 (As little design as possible) = 1/3** — Duplicate nodes, dead props, and non-essential customizations add cognitive friction.

---

## Why Redesign and Not Refine

Principle #8 (Thoroughness) scored 0/3 because four fundamental interaction states are missing: empty state (no guidance before first action), loading state (insufficient feedback during 40s WASM wait), success state (QR is live but not labeled), and focus rings (zero `:focus-visible` CSS). These cannot be patched in a refine pass — they require new CSS layers and HTML states, which overlap with the same layer that needs structural fixes (Principle #2: choice overload, Principle #4: label clarity, Principle #6: honesty).

Refining around these missing states would compound the problem; redesigning the state layer is the foundation for every other fix.

---

## Highest-Leverage Moves (Ordered by Impact)

1. **Principle #8 (Thorough):** Add all 4 missing states — Focus rings on every interactive element (`:focus-visible` CSS), loading indicator with progress text during buildPoster() (40s wait needs feedback), empty-state guidance ("Bước 1: Chọn khung → Bước 2: Chụp"), and success confirmation when QR is ready. **Evidence:** `src/styles.css` (zero :focus-visible rules), `src/main.js:734` (QR loading message).

2. **Principle #2 (Useful):** Reduce choice overload — Curate 16 frame cards to 4 hero frames visible by default; collapse remaining 12 behind "Xem thêm" button. Add destructive-action confirmation before retake() destroys photos. **Evidence:** `src/main.js:203–216` (16-frame grid), `src/main.js:764` (Retake without confirm).

3. **Principle #10 (As little design as possible):** Remove redundancy — Delete duplicate `#ival-h` node (line 300, same as `#ival-v`), dead `showFrameNumber` prop (line 59), and consider hiding the interval slider behind "Cài đặt nâng cao" (3s default is optimal for most users). **Evidence:** `src/main.js:59, 286, 300` (dead/duplicate code).

4. **Principle #4 (Understandable):** Fix copy & language consistency — Translate all English filter/sticker labels to Vietnamese (Vintage → Hoài cổ, Hot → Nổi bật, Party → Tiệc), remove frame label inflations (remove "Magic", "Dream", "Luxe" qualifiers; use simple aesthetic names), rename "Thời gian" to "Đếm ngược" for clarity. **Evidence:** `src/main.js:163, 172, 176, 55–145` (filter labels, frame names).

5. **Principle #9 (Environmentally friendly):** Gate motion and fix font loading — Add `@media (prefers-reduced-motion: reduce)` rule to disable transitions for users who prefer it; move Google Fonts from `@import` (render-blocking) to `<link rel="preconnect">` in HTML head with `font-display: swap`. **Evidence:** `src/styles.css:1` (render-blocking @import), `src/styles.css` (zero prefers-reduced-motion rule).

---

## Anti-Patterns to Avoid During Redesign

- ❌ Styling the existing 16-frame grid under new CSS (the choice overload is the problem, not the appearance)
- ❌ Keeping glassmorphism backdrop-filter "because it looks nice" (it's the primary dated-trend marker, Principle #7)
- ❌ Adding a design-system library (overkill for vanilla JS; CSS custom properties + token file suffice)
- ❌ Treating the empty/loading/success/focus states as "polish" (they are structural; redesign blocks on them)
- ❌ Changing the brand palette or Lion mascot (these score well: strong typography, unobtrusive layout, good contrast)
