# 02-scorecard.md — Scorecard

## 1. Good design is innovative — Score: 2/3
Evidence: Client-side WASM background removal (main.js:7) + 16 branded frame templates + real-time filter preview on camera — no competitor in the Vietnamese university booth space ships all three.
Justification: Refreshes the physical photobooth pattern with a genuine improvement (no app install, in-browser BG removal), but ships it wrapped in a conventional tab+grid UI that introduces no new interaction model.

## 2. Good design is useful — Score: 1/3
Evidence: 36 interactive elements for a 3-step task (main.js:262–301); 16 frame cards presented simultaneously with no visual hierarchy; "Thời gian" slider mislabeled (main.js:286); "↩ Chụp lại" destroys all photos without confirmation (main.js:323, 760–768).
Justification: Primary task completes but the user must navigate 31 customization options (16+6+9) before they can shoot; the path to the shoot button requires passing through unnecessary choice overload.

## 3. Good design is aesthetic — Score: 1/3
Evidence: 38–42 distinct color tokens (8 in :root, 30+ hard-coded); 16 distinct font sizes including 8.5px and 9.5px sub-pixel values; 18 distinct spacing values — all magic numbers with no visible design system.
Justification: The brand colors (dark green + gold) give a superficial coherence, but the underlying token system is absent — any deviation from the current implementation reveals the inconsistency, and more than 5 style inconsistencies exist across the surface.

## 4. Good design makes a product understandable — Score: 1/3
Evidence: Tab label `🖼 Anh` typo (main.js:263); "Thời gian" slider purpose unclear (main.js:286); "Đang tạo link..." purpose opaque to first-time user (main.js:317); language inconsistency (Vietnamese + English mixed) makes 4+ controls harder to parse for target audience.
Justification: 2–3 controls are unclear for a first-time Vietnamese high-school visitor, and jargon (English frame/filter names) is present; shoot button itself is clear, preventing a 0.

## 5. Good design is unobtrusive — Score: 2/3
Evidence: Camera column takes 70% of screen (7fr/3fr grid — styles.css:79); dark background makes camera the primary figure; decorative radial-gradient on background is subtle (styles.css:30–34).
Justification: Chrome is visible but quiet — the camera feed dominates as intended; control panel has a clear supporting role; the shimmer on the shoot button and box-shadows add weight without dominating.

## 6. Good design is honest — Score: 1/3
Evidence: 4 marketing inflations in poster frame text (main.js:72, 114, 143, 64); "↩ Chụp lại" implies undo but destroys data without warning (main.js:323); "Sắp xong, chờ chút" shown even when upload will fail (main.js:318).
Justification: No dark patterns detected, but 2+ inflations in poster copy and a false-expectation loading message bring this to 1; a destructive action with a misleading affordance (↩) confirms the score rather than raising it.

## 7. Good design is long-lasting — Score: 1/3
Evidence: Glassmorphism backdrop-filter on 3 surfaces (styles.css:45, 565, 578); Unbounded display font used as primary heading face (styles.css:135, 552, 596); neon-glow box-shadows on interactive elements (styles.css:97, 185, 473, 543, 627).
Justification: Three distinct trend markers from the 2021–2023 design cycle (glassmorphism + ultra-bold display font + neon glow aesthetic) are present; in 3 years this will read as a specific era.

## 8. Good design is thorough down to the last detail — Score: 0/3
Evidence: Focus rings entirely absent (zero `:focus` or `:focus-visible` rules in styles.css); empty state missing (main.js:291–294 only has 0.18-opacity decoration); no loading indicator during 40s `buildPoster()` wait (main.js:409); success state absent from main screen; `#shoot-btn` the only element with a disabled style (styles.css:546).
Justification: 4 of 6 required states are missing or unaddressed — empty, loading (for poster build), success, and focus — which is the threshold for a 0.

## 9. Good design is environmentally friendly — Score: 1/3
Evidence: Initial JS 126 KB < 500 KB ✓; zero idle animations ✓; prefers-reduced-motion NOT honored (15 unconditional transitions, 2 keyframe animations — styles.css throughout); dark mode NOT honored; Google Fonts `@import` render-blocking (styles.css:1).
Justification: Bundle is lean and idle is clean, but all motion fires unconditionally regardless of user accessibility preference, and the render-blocking font import adds measurable first-paint latency.

## 10. Good design is as little design as possible — Score: 1/3
Evidence: Duplicate interval display at main.js:286 (#ival-v) and main.js:300 (#ival-h) shows same data twice; 31 customization options (16 frames + 6 filters + 9 stickers) presented to accomplish a task requiring 0 customization to complete; `showFrameNumber` dead prop at main.js:59 never consumed.
Justification: More than 3–5 removable elements exist (duplicate node, dead prop, slider optional for most users, sticker section lowest-value feature) but the page is not dominated by decoration — content still drives structure.

---

## Total: 11/30

| # | Principle | Score |
|---|-----------|-------|
| 1 | Innovative | 2 |
| 2 | Useful | 1 |
| 3 | Aesthetic | 1 |
| 4 | Understandable | 1 |
| 5 | Unobtrusive | 2 |
| 6 | Honest | 1 |
| 7 | Long-lasting | 1 |
| 8 | Thorough | **0** |
| 9 | Environmentally friendly | 1 |
| 10 | As little design as possible | 1 |
| **Total** | | **11/30** |
