# Greenwich Booth Re-Audit (2026-08-01)

## What is being audited

**Live URL:** https://greenwichbooth.vercel.app (primary screen — camera + control panel)  
**Component:** Main shooting interface (camera column 70%, control column 30%)  
**Screens:** 
- Shooting ready state (frame selection + shoot button)
- Countdown timer during photo capture
- Result/QR screen after poster build

**Code paths:**
- `/home/long/projects/web/greenwichbooth/src/main.js` (layout, state logic)
- `/home/long/projects/web/greenwichbooth/src/styles.css` (styling, tokens)
- `/home/long/projects/web/greenwichbooth/public/favicon.svg` (favicon)

## Primary User & Task

**Primary user:** Vietnamese high school students (18–22), first-time kiosk users  
**Primary task:** Capture 4 photos → build poster → scan QR to download (< 2 minutes)  
**Secondary user:** Staff (setup, troubleshooting)

## Constraints

- **Stack:** Vanilla JS + Vite 8.1.1, no React/Vue
- **WASM:** @imgly/background-removal 1.7.0 (23MB, 40s processing)
- **Brand:** Color palette (#006b3f green, #FFCB2F gold, #0B1912 dark bg, #F0F5F2 text); Lion mascot SVG
- **Deployment:** Vercel + Blob storage
- **Accessibility floor:** WCAG AA (not AAA, but focus rings mandatory)

## Prior Audit & Context

**Previous audit (Aug 1, 7:38am):** Score 11/30 (REDESIGN verdict)
- Principle #8 (Thorough) scored 0/3 — missing 4 UI states (empty, loading, success, focus)
- Principle #2 (Useful) scored 1/3 — 31 customizations before primary CTA
- Principle #9 (Environmentally friendly) scored 1/3 — prefers-reduced-motion ignored

**Design proposal from audit:** Token system (spacing/type/color scales), 6 states, loading overlay 2-phase, step badges, frame carousel (4 hero + collapse), bprimary glassmorphism removal  
**Implementation status:** Only navbar touched (solid bg, live dot); main UI unchanged

## What This Re-Audit Will Assess

1. Has the design proposal been implemented?
2. Are new changes (navbar, subtitle removal) improving scores?
3. Is the verdict still REDESIGN, or has it shifted to REFINE?
4. What are the highest-leverage moves NOW?
