# 01-evidence.md — Evidence Consolidated

## STRUCTURAL (36 interactive elements, depth 7)

**Total interactive elements (main screen):**
- 3 tab buttons — main.js:262–264
- 16 frame cards — main.js:203 (× 16 FRAMES)
- 6 filter buttons — main.js:791
- 9 sticker buttons — main.js:773
- 1 range input (#ival) — main.js:287
- 1 shoot button (#shoot-btn) — main.js:297
- 1 retry-cam (hidden) — main.js:254
- **Total: 36 (35 visible)**

**Max nesting depth:** 7 — `.app > .main > .cam-col > .cam-box > .cnt-ov > .cnt-num-wrap > .cnt-n` (main.js:221–240)

**Repeated patterns:**
1. Active-selection pattern repeated 3× (frames, filters, stickers) — main.js:821–824, 845–848
2. Interval value shown in TWO places: `#ival-v` (main.js:286) AND `#ival-h` (main.js:300) — both updated together at main.js:829–830
3. 4 identical photo-preview slot structures hand-written — main.js:291–294

**Dead props:** 1 — `showFrameNumber: true` at main.js:59 never consumed anywhere.

---

## VISUAL & STATES (INFERRED — no live screenshot)

**Spacing:** 18 distinct values (2,3,4,5,6,7,8,9,10,11,12,13,14,16,18,20,24,28px). No spacing design tokens. All magic numbers. — styles.css throughout

**Type scale:** 16 distinct font-size values including sub-pixel (8.5px at styles.css:381, 9.5px at styles.css:491). No type scale token.

**Color count:** ~8 CSS vars in :root (styles.css:5–16) + ~30+ hard-coded alpha variants = ~38–42 distinct color values. Only base palette in vars; all alpha-channel variants written ad-hoc.

**Contrast — primary text:** #F0F5F2 on #0B1912 → **16.9:1** (passes WCAG AAA).
**Contrast — dim text:** `rgba(255,255,255,0.44)` on `--bg` → **~4.94:1** (barely passes AA). Used for `.ctrl-lbl`, `.flt-lbl`, `.stkr-lbl`, `.cam-err p` — styles.css:421, 337, 385, 238.

**States — main screen:**
| State | Status | Note |
|-------|--------|------|
| Empty | MISSING | `.pv-slot::before` shows 📷 at 0.18 opacity — decoration not state |
| Loading | PARTIAL | Countdown overlay exists; no indicator during 40s `buildPoster()` wait |
| Error | PRESENT | `.cam-err` with message + retry — main.js:251–256, styles.css:223–238 |
| Success | MISSING | No success feedback on main screen after shoot |
| Focus rings | MISSING | Zero `:focus` or `:focus-visible` rules in styles.css |
| Disabled | PARTIAL | Only `#shoot-btn:disabled` styled — styles.css:546 |

**Dark mode:** NOT honored — no `@media (prefers-color-scheme)` anywhere in styles.css.
**Reduced-motion:** NOT honored — all transitions/animations fire unconditionally.

---

## COPY & HONESTY

**Key label→behavior mismatches:**
- `🖼 Anh` tab (main.js:263) — typo (`Anh` vs `Ảnh`); label implies "view photo" but function is "select frame"
- `↩ Chụp lại` (main.js:323) — ↩ implies undo/back but actually DESTROYS all 4 photos without confirmation (main.js:760–768)
- `Thời gian: 3s` (main.js:286) — "Thời gian" (time) is ambiguous; it's countdown-per-shot, not session time or total duration
- `Đang tạo link... / Sắp xong, chờ chút` (main.js:317–318) — shows even when upload will fail (no token), creating false expectation

**Marketing inflations in poster text (4):**
- `Premium Memories` — main.js:72
- `Excellence · Innovation` — main.js:114
- `Dream · Learn · Grow` — main.js:143
- `Picture Perfect` — main.js:64

**Language inconsistency:**
- Filters: 5 Vietnamese labels + 1 English (`Vintage`) — main.js:163
- Stickers: Vietnamese + English mixed (`Hot`, `Party`) — main.js:172, 176
- Frame labels: mixed English/Vietnamese (e.g., `Burgundy Luxe`, `Emerald Luxe`, `Navy Royal`, `Neon Night`)
- alt texts: English in Vietnamese app (`alt="Your photo"`, `alt="QR"`) — main.js:311, 313

**No dark patterns detected.**

---

## WEIGHT & FRICTION

**Initial JS:** 126 KB (minified) + 12 KB CSS = **~141 KB initial transfer**
**Network requests on initial load:** 7–9 (3 local + Google Fonts CSS + 2–4 WOFF2 files)
**Render-blocking:** Google Fonts `@import` at styles.css:1 is render-blocking on first visit
**TTI estimate:** 800–1500ms LAN; 1500–3000ms mobile (method: bundle size + blocking font request)
**WASM/ONNX (23 MB):** deferred — loads only post-shoot when `removeBackground()` called — main.js:7
**Idle animations:** 0 active (both `@keyframes` are class-triggered, not idle)
**Modals/badges on load:** 0 visible
**External CDNs:** Google Fonts (blocking) + jsdelivr/imgly CDN (deferred, post-shoot)
