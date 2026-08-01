# 03-verdict.md — Verdict

## REDESIGN — 11/30, principle #8 (Thorough) scored 0

**Verdict:** The app's innovation core (browser BG removal + branded frames) is sound, but 11/30 with a zero on thoroughness — no focus rings, no loading state for 40s of WASM processing, no empty or success states — means users are flying blind through the most stressful part of the flow; a refine pass cannot retrofit these structural omissions without touching the same layer that needs redesigning anyway.

---

## Top 5 highest-leverage moves

**1. Principle #8 (Thorough) — Add the 4 missing states:**
- Focus rings: add `:focus-visible` to all interactive elements (zero currently in styles.css)
- Loading state: show a spinner/progress during `buildPoster()` — user waits up to 40s with no feedback (main.js:409)
- Empty state: show a guided "Chọn khung → Chụp" instruction in the camera area before first shoot
- Remove ghost subtitle "Sắp xong, chờ chút" when upload fails (main.js:318 shown even on error)

**2. Principle #2 (Useful) — Reduce choice overload before the shoot button:**
- Curate from 16 frames → 4–6 hero frames; put the rest in a "Xem thêm" collapse
- Make the primary flow sequential and visible: Step 1 Choose → Step 2 Shoot → Step 3 Download
- Add confirmation before "↩ Chụp lại" destroys 4 photos (main.js:760–768)

**3. Principle #10 (As little design as possible) — Remove redundancy:**
- Remove duplicate `#ival-h` span (main.js:300); keep only `#ival-v`
- Remove `showFrameNumber` dead prop (main.js:59)
- Consider removing the "Thời gian" slider entirely (3s default is fine; advanced setting hides behind gear icon if needed)

**4. Principle #4 (Understandable) — Fix copy and language consistency:**
- Fix typo: `🖼 Anh` → `📷 Khung` (clearer and unambiguous) — main.js:263
- Make filter/sticker labels all-Vietnamese (translate `Vintage` → `Hoài cổ`, `Hot` → `Nổi bật`, `Party` → `Tiệc`) — main.js:163, 172, 176
- Rename "Thời gian" slider → "Đếm ngược:" with unit — main.js:286
- On error: hide QR box entirely, show "Tải về máy" prominently — main.js:736

**5. Principle #9 (Environmentally friendly) — Gate motion + inline fonts:**
- Add `@media (prefers-reduced-motion: reduce)` to disable transitions and keyframe animations
- Replace render-blocking `@import url('https://fonts.googleapis.com/...')` with `<link rel="preconnect" + rel="stylesheet">` in HTML head, or use `font-display: swap` — styles.css:1
