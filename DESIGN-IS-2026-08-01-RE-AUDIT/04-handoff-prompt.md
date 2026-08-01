# Handoff Prompt — /make-plan

```
/make-plan Redesign greenwichbooth main screen (camera + control panel). Current design failed audit at 11/30 with critical gaps in principles #2 (Useful, 1/3), #4 (Understandable, 1/3), #8 (Thorough, 0/3), #9 (Environmentally friendly, 1/3), #10 (As little design as possible, 1/3).

Verdict paragraph:
> **Re-audit shows no change in score from prior assessment (11/30) despite navbar cosmetics and favicon additions.** The core design gaps driving the REDESIGN verdict remain: Principle #8 (Thorough) = 0/3 (missing 4 of 6 critical UI states); Principle #2 (Useful) = 1/3 (choice overload + dark pattern on Retake); Principle #10 = 1/3 (duplicate nodes, dead props). Refining around these missing states would compound the problem; redesigning the state layer is the foundation for every other fix.

Why redesign and not refine: Principle #8 (Thoroughness) scored 0/3 — missing empty state (no guidance before first action), loading state (insufficient feedback during 40s WASM wait), success state (QR is live but not labeled), and focus rings (zero :focus-visible CSS). These four omissions are not decorative; they are structural trust signals that require adding new CSS layers and HTML states, which overlaps with the same UI layer that needs the choice-architecture and copy changes (#2, #4, #6).

Preserve from current design (MUST keep):
- Brand color palette: #006b3f (green), #FFCB2F (gold), #0B1912 (background), #F0F5F2 (text) — styles.css:5–16
- Font pair: Unbounded (headings) + DM Sans (body) — styles.css:1, 15
- Lion Captain mascot SVG — main.js:15–45
- Camera column takes ~70% of screen (7fr/3fr grid) — styles.css:79
- The WASM background removal feature — main.js:5–12
- 3-tab organization (Khung / Lọc / Sticker) — main.js:261–283
- 2×2 square poster format — main.js:443–458
- Green CHỤP NGAY shoot button as primary CTA — main.js:297–301

Discard:
- 16 hard-coded frame cards with no hierarchy — main.js:203–216. Caused failure on principle #2: forces users to browse 16 undifferentiated options with no guidance.
- Magic-number spacing/type/color tokens — styles.css throughout (38 spacing values, 19 font sizes, 30+ ad-hoc colors). Caused failure on principle #3.
- All glassmorphism backdrop-filter surfaces (3×) — styles.css:45, 565, 578. Caused failure on principle #7.
- Duplicate interval display node `#ival-h` — main.js:300. Caused failure on principle #10.
- Render-blocking Google Fonts `@import` — styles.css:1. Caused failure on principle #9.
- Frame label inflations (Magic, Dream, Luxe, etc.) — main.js:55–145. Caused failure on principle #6.
- `showFrameNumber` dead prop — main.js:59.
- Retake button without confirmation — main.js:764–768. Causes dark pattern (forced continuity analog).

Top 5 moves from the audit (implement in this order):

1. Principle #8 (Thorough) — Add all 4 missing states:
   - `:focus-visible` outline on ALL interactive elements (none exist in styles.css)
   - Loading overlay during `buildPoster()` — user waits up to 40s at main.js:409 with zero feedback
   - Empty-state guidance in camera area before first shoot ("Bước 1: Chọn khung → Bước 2: Chụp")
   - Success label when QR is ready (don't just show QR, say "Success" or "Download ready")
   - Evidence: styles.css (zero :focus-visible rules), main.js:734 (QR loading msg)

2. Principle #2 (Useful) — Fix the choice-overload and destructive action:
   - Curate to 4–6 hero frames visible by default; collapse remaining 10+ into "Xem thêm"
   - Add confirmation dialog before `retake()` destroys all 4 photos (main.js:760–768)
   - Make primary flow sequential and scannable: Step badges 1→2→3
   - Evidence: main.js:203–216 (16-frame grid), main.js:764 (Retake no confirm)

3. Principle #10 (As little design as possible) — Remove redundancy:
   - Remove `#ival-h` duplicate span at main.js:300 (same data as `#ival-v` at main.js:286)
   - Consider hiding the interval slider behind "Cài đặt nâng cao" — 3s default is optimal for most users
   - Delete `showFrameNumber: true` dead prop at main.js:59
   - Evidence: main.js:59, 286, 300

4. Principle #4 (Understandable) — Fix copy and language consistency:
   - Fix typo: tab label `🖼 Anh` → `📷 Khung` — main.js:263
   - Translate all-English filter/sticker labels to Vietnamese: `Vintage` → `Hoài cổ`, `Hot` → `Nổi bật`, `Party` → `Tiệc` — main.js:163, 172, 176
   - Rename slider label `Thời gian:` → `Đếm ngược:` — main.js:286
   - Remove frame label inflations: drop "Magic", "Dream", "Luxe" qualifiers; use simple aesthetic names — main.js:55–145
   - When upload fails: hide `.qr-wrap` entirely, emphasize `⬇ Tải về máy` as the primary action — main.js:735–737
   - Evidence: main.js:163, 172, 176, 263, 286, 55–145

5. Principle #9 (Environmentally friendly) — Gate motion and fix font loading:
   - Add `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }` to styles.css
   - Move Google Fonts from `@import` (render-blocking) to `<link rel="preconnect">` + `<link rel="stylesheet">` in HTML head with `font-display: swap`
   - Evidence: styles.css:1 (@import), styles.css (zero prefers-reduced-motion)

Redesign principles in priority order:
1. Principle #8 (Thorough) — Build all 6 states (empty, loading, error, success, focus, disabled) before adding any new UI surface
2. Principle #2 (Useful) — Every interaction step must earn its place in the primary flow; cut choice count before adding guidance
3. Principle #4 (Understandable) — All labels consistent Vietnamese; no label→behavior mismatches; no typos; no jargon undefined for a 18-year-old

Deliverables for the plan:
- New CSS token system: spacing scale (8px base, × 0.5/1/1.5/2/3/4), type scale (12/14/16/20/28px), color tokens (extend :root vars to cover all alpha variants)
- New information architecture: 3-step flow with step badges visible at all times
- States checklist: empty / loading (initial + build-poster) / error / success / focus / disabled — all 6 present and tested
- Curated frame list: 4 hero frames + "Xem thêm" collapse
- Copy pass: all user-facing strings in Vietnamese, no inflations, no mismatches
- Migration path: drop-in replacement (same HTML entry point, same JS functions, new CSS tokens + HTML structure)
- Cutover: ship when all 6 states verified manually + focus-visible tested with Tab key

Anti-patterns to guard against:
- Porting the 16-frame grid under new CSS (the choice overload is the problem, not the styling)
- Keeping glassmorphism backdrop-filter "because it looks nice" — it's the primary dated-trend marker
- Adding a design system library (overkill for vanilla JS; just add CSS custom properties)
- Treating the Preserve list as optional — brand tokens and camera layout MUST be retained
- Treating the 4 missing states as "polish" or "later" — they block on everything else
```
