# Evidence Report — Greenwich Booth Re-Audit

## Structural Evidence

**Interactive element count:** 26 major interactive elements (tabs, buttons, frame cards, filters, stickers, sliders)

**DOM nesting depth:** 7 levels (e.g., `.app → .main → .cam-col → .cam-box → .cnt-ov → .cnt-num-wrap → .cnt-n`)

**Repeated patterns:** 31 frame/filter/sticker template objects + 12 frame cards with identical structure

**Dead props:** 2 unused properties (`showFrameNumber` never consumed, `photoLocation` removed from render)

**File citations:** `src/main.js:47–180` (FRAMES array), `src/main.js:220–500` (HTML mount), `src/main.js:59` (dead showFrameNumber prop)

---

## Visual Evidence (CSS Inspection)

**Spacing scale:** 38 distinct px/em values (2–28px) — **no system** — should be ~8-value scale (8, 12, 16, 20, 24, 32, 40, 48px)

**Type scale:** 19 distinct font-size values (8.5px–40px) including sub-pixel (9.5px, 11.5px) — **no system** — should be ~5-value scale (12, 14, 16, 20, 28px)

**Color tokens:** 9 CSS vars (--bg, --text, --green, --gold, --border, --dim, --surface, --r, --emerald) + ~30 hard-coded colors in inline styles — **inconsistent**

**Contrast baseline:** #F0F5F2 on #0B1912 = **16.9:1** (WCAG AAA) ✓; dim text (rgba white 0.44) on bg = 4.94:1 (barely AA)

**UI States present/missing:**
- Empty state (before first shoot): **MISSING** 
- Loading state (during WASM wait): **PRESENT** (qr-loading class, but visual feedback minimal)
- Error state (upload fail): **PRESENT** (qr-title message, but styling unclear)
- Success state (poster ready): **PARTIAL** (QR shows, but no "success" labeling)
- Focus-visible styling: **MISSING** (zero `:focus-visible` rules in styles.css)
- Disabled state: **PARTIAL** (only shoot button has `disabled:` styling)

**File citations:** `src/styles.css:1–795` (all token definitions and rules), `src/main.js:395–400` (emoji state), `src/main.js:734–750` (loading/error messages)

---

## Copy & Honesty Evidence

**User-facing strings:**
- "Cười lên nào!" (removed Aug 1) — **removed** ✓
- Frame labels: "🖼️ Fotolab Classic", "✨ Magic Hanoi", "💎 Studio Gold", "Purple Dream" — **inflations** (9 frames use trend adjectives: Magic, Dream, Luxe, Royal)
- Result label: "📱 Quét để tải về" → user scans QR → download poster — **honest** ✓
- Tab labels: "Khung / Lọc / Sticker" — **clear** ✓

**Label-behavior mismatches:**
1. **"Chụp lại" (Retake) button** — line `src/main.js:764` calls `retake()` which does `S.photos = []` (destroys all 4 photos) **without confirmation** → user can tap once and lose all photos (dark pattern)
2. **"Đang tạo link..." message** appears during poster build but also on error (misleading) → `src/main.js:734` sets before upload, doesn't clear on error
3. **QR title "Sắp xong"** appears for ~2s on error path → implies success even on fail

**Inflations:** 9 frame names use marketing words (Premium, Excellence, Dream, Magic, Luxury, Royal, Perfect, Picture, Moment) without backing — score -1 on #6 (honesty)

**File citations:** `src/main.js:764–768` (retake), `src/main.js:734` (loading msg), `src/main.js:318` (sắp xong), `src/main.js:55–145` (frame labels)

---

## Weight & Friction Evidence

**Initial JS bytes:**
- `index.js`: 128KB (gzipped ~39KB)
- ORT runtime bundles: 2× 390KB = 780KB
- Total initial JS/CSS: ~900KB (uncompressed) / ~200KB (gzipped)
- WASM: 23MB deferred (loaded only on first photo shot)

**Network requests on initial load:** 6
- HTML
- CSS bundle
- JS bundle
- ORT runtime (dynamic import)
- Google Fonts @import (render-blocking)
- Favicon

**TTI (Time-to-Interactive):** ~800–1200ms on LAN (estimated); Google Fonts @import adds ~200–400ms on cold cache

**Animations on idle screen:** 0 (both @keyframes `qr-pulse` and `pv-pop` are event-triggered, not idle)

**prefers-reduced-motion rule:** **MISSING** (zero media queries for accessibility preference)

**Render-blocking:** Google Fonts `@import` at line 1 of styles.css blocks initial render

**File citations:** `src/styles.css:1` (fonts), `src/main.js:2–7` (imports), `dist/assets/index-*.js` (bundle size from build output)

---

## Accessibility Evidence

**Focus styling:** **MISSING** — zero `:focus-visible` rules in styles.css → keyboard users see no visual feedback when tabbing through controls

**Keyboard reachability:**
- Shoot button: `.btn-shoot` class → native `<button>` → **reachable** ✓
- Tab controls (Khung/Lọc/Sticker): `.tab` class → native `<button>` → **reachable** ✓
- Frame/filter/sticker panels: `.frame`, `.filter`, `.sticker` → native `<button>` → **reachable** ✓

**Tab order:** Implicitly follows DOM order (app shell → tabs → camera → shoot button → result); no explicit `tabindex` (good)

**ARIA landmarks:** **MISSING** (zero role= attributes, zero aria-* attributes)
- No `role="main"` on primary content area
- No `role="button"` on custom button-like elements (if any)
- No `aria-label` on icon-only buttons

**Skip link:** **MISSING** (no link to jump past header to main content)

**Color contrast:** Dim text (rgba 255 255 255 0.44) on #0B1912 = **4.94:1** (barely WCAG AA, fails AAA)

**File citations:** `src/styles.css` (no :focus-visible), `src/main.js:220–500` (HTML structure, no roles), `src/styles.css:6–15` (color tokens)

---

## Summary of Findings

| Category | Status |
|----------|--------|
| **Spacing scale** | 38 values (no system) → should be 8 |
| **Type scale** | 19 values (no system) → should be 5 |
| **Empty state** | Missing |
| **Focus-visible rings** | Missing |
| **prefers-reduced-motion** | Missing |
| **Frame label inflations** | 9 frames (Magic, Dream, Luxe, etc.) |
| **Retake dark pattern** | No confirmation before data loss |
| **Google Fonts blocking** | Render-blocking @import |
| **ARIA landmarks** | Missing (0 roles, 0 aria-*) |
| **Bundle size (initial)** | ~900KB (acceptable with gzip) |
