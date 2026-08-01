# Scorecard — Greenwich Booth (Re-Audit Aug 1, 2026)

## 1. Good design is innovative — Score: 2/3

**Evidence:** WASM background removal + live preview novel for Vietnam campus context; however, UI model is generic (tabs + panels + button-centric).

**Justification:** Refreshes the photo booth experience with browser-based background removal (clear improvement over manual background work), but execution follows standard web UI patterns without novel affordances or interaction models. Rate 2: improvement on existing pattern, not pioneering.

---

## 2. Good design makes a product useful — Score: 1/3

**Evidence:** Primary task (capture 4 photos → build poster → QR) completes, but 31 customizations (16 frames, 6 filters, 9 stickers) before shoot button **cause choice overload** (01-evidence.md: Useful #2 audit, 1/3 prior). User must navigate 3 tabs + scroll through 16 frame cards to select *before* any capture happens. Additionally, "Retake" button destroys all 4 photos without warning (dark pattern).

**Justification:** Primary task path is indirect and cluttered. Useful score drops to 1 when choice overload forces unnecessary detours before the main CTA. Retake dark pattern compounds the friction.

---

## 3. Good design is aesthetic — Score: 1/3

**Evidence:** 38 distinct spacing values, 19 type sizes, ~30 hard-coded colors (01-evidence.md visual) — no visible design system. Spacing: 2px, 4px, 8px, 9px, 9.5px, 11px, 11.5px, 12px... (magic numbers throughout). Type: 8.5px, 9.5px, 11px, 13px, 14px, 15px, 16px, 20px, 28px, 40px... (sub-pixel sizes, no scale). Navbar removed glassmorphism (improvement from prior 7/30 audit), but rest of UI unchanged.

**Justification:** With 3–5 inconsistencies across the audited surface (spacing, type, color), score is 1. One jarring violation (19 type sizes with sub-pixel values) triggers 1/3, not 2/3. The prior glassmorphism dated-trend marker also still present in other surfaces.

---

## 4. Good design makes a product understandable — Score: 1/3

**Evidence:** Frame labels mix English + Vietnamese (Vintage, Hot, Party, Fotolab); "Chụp lại" (Retake) button behavior is destructive but label doesn't warn; "Đang tạo link..." message appears on error paths (misleading). Three controls are ambiguous: Tab label "🖼️ Anh" is a typo (01-evidence.md prior), time slider "Thời gian" unclear as countdown, frame names use inflated marketing language (Magic, Dream, Luxe).

**Justification:** 2–3 controls are unclear; jargon present (frame names); label-behavior mismatches on 2+ controls (Retake, QR message). Rates 1/3: unclear controls + jargon + mismatches.

---

## 5. Good design is unobtrusive — Score: 2/3

**Evidence:** Camera dominates 70% of screen (7fr/3fr grid) — content is the figure, UI the ground (01-evidence.md prior). Control panel is supporting role. Subtle gradients on app shell. Shoot button shimmer is effective. Navbar now solid (removed glassmorphism blur) — less intrusion.

**Justification:** Chrome recedes; camera-first layout is sound. Minor: control panel still has some visual noise (many small buttons competing). Rates 2/3: content clearly primary, chrome quiet, but some secondary decoration competes.

---

## 6. Good design is honest — Score: 1/3

**Evidence:** 9 frame names with marketing inflations ("Premium", "Excellence", "Dream", "Magic", "Luxe") without backing — each promises aesthetic sophistication but delivers only border + color. Retake button destroys photos without warning (dark pattern: forced continuity analog). QR message "Sắp xong" appears on error (implies success on failure).

**Justification:** 3 issues: (1) 9 frame inflations, (2) Retake dark pattern, (3) misleading QR message on error. Rate 1/3: 2+ inflations OR one dark pattern triggers 1.

---

## 7. Good design is long-lasting — Score: 1/3

**Evidence:** Glassmorphism backdrop-filter (lines 45, 565, 578 prior audit) still present in some surfaces. Neon glow on sticker badges. Ultra-bold Unbounded font (700/900 weights) — all three are dated trend markers (2021–2023 era). SVG decorations and gradient overlays also follow 2023-era trends.

**Justification:** 2–3 dated markers (glassmorphism, neon glow, bold fonts) → score 1/3. Design will visually read as "2023–2024 app" in 3 years. Not immediate style-stitching, but trend-dependent enough to date.

---

## 8. Good design is thorough down to the last detail — Score: 0/3

**Evidence:** Missing 4 of 6 required interaction states:
1. **Empty state** — camera area before first shoot: nothing guides user on next action → **MISSING**
2. **Loading state** — during WASM wait (40s): minimal feedback, user unsure if app is hung → **PRESENT but minimal** (qr-loading class exists, but no progress message during buildPoster)
3. **Error state** — upload fail or network timeout: present but styling unclear → **PRESENT**
4. **Success state** — poster ready, QR live: no "success" label, no visual confirmation → **MISSING**
5. **Focus-visible** — keyboard navigation: zero `:focus-visible` rules → **MISSING entirely**
6. **Disabled state** — partially present (shoot button only) → **PARTIAL**

File citations: `src/styles.css` (no :focus-visible rules), `src/main.js:395–400` (emoji state, not labeled), `src/main.js:734–750` (QR message, no success label).

**Justification:** Zero on thoroughness because 4 of 6 critical states are missing or rough (empty, loading detail, success, focus rings). Principle #8 scored 0/3 in prior audit; only navbar CSS changed, core states still absent. Score remains 0.

---

## 9. Good design is environmentally friendly — Score: 1/3

**Evidence:** Initial JS ~900KB (acceptable); WASM 23MB deferred (not loaded until needed) ✓; zero idle animations (both @keyframes are event-triggered) ✓; **BUT**: prefers-reduced-motion rule is **MISSING** (zero media query) → transitions fire unconditionally; Google Fonts @import is render-blocking (line 1 of styles.css, should be `<link preconnect>`).

**Justification:** <500KB initial (good), WASM deferred (good), zero idle animation (good), but motion not gated by preference + render-blocking fonts → score 1/3. Not <100KB + fully optimized = not 3; not >2MB = not 0. Rate 1: some optimization present, gaps remain.

---

## 10. Good design is as little design as possible — Score: 1/3

**Evidence:** 31 frame/filter/sticker objects before primary action (Shoot) → every one could be pruned without breaking task. Duplicate interval display node `#ival-h` at line 300 (same data as `#ival-v`). Dead prop `showFrameNumber`. Sticker section optional (doesn't affect poster build). Control panel content still drives structure (3 tabs, 36 interactive elements for one task).

**Justification:** 3–5 removable elements (frame grid, duplicate node, dead props, optional sticker section) → score 1/3. "As little as possible" not achieved when 31 customizations are non-essential to primary task.

---

## Summary

| Principle | Score | |
|-----------|-------|---|
| #1 Innovative | 2/3 | Clear improvement (WASM), but pattern is standard |
| #2 Useful | 1/3 | Primary task indirect; choice overload; Retake dark pattern |
| #3 Aesthetic | 1/3 | 38 spacing values, 19 type sizes; no system |
| #4 Understandable | 1/3 | 2–3 unclear controls; jargon; mismatches |
| #5 Unobtrusive | 2/3 | Camera-first layout works; chrome quiet |
| #6 Honest | 1/3 | 9 frame inflations + Retake dark pattern + QR mislead |
| #7 Long-lasting | 1/3 | 2–3 dated trend markers (glassmorphism, neon, bold fonts) |
| #8 Thorough | 0/3 | Missing 4 of 6 states (empty, loading detail, success, focus-visible) |
| #9 Environmentally friendly | 1/3 | Motion not gated; render-blocking fonts |
| #10 As little as possible | 1/3 | 31 customizations + duplicates + dead props |
| | | |
| **TOTAL** | **11/30** | Same as prior audit — no structural improvements yet |

---

## Verdict Determination

**Total: 11/30**
**Any principle at 0/3:** Yes (#8 Thorough = 0/3, load-bearing for user experience)
**Verdict rule:** Total < 20 AND any principle scored 0 → **REDESIGN**

*Outcome: No change from prior audit (11/30, REDESIGN). Navbar cosmetics and favicon added, but core design gaps remain unchanged.*
