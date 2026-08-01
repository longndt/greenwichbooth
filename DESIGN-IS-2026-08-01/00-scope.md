# 00-scope.md — Audit Scope

## What is being audited
- **Product:** Greenwich Booth — web-based photo booth for Greenwich Vietnam
- **Surface audited:** Main screen (camera + control panel). Result overlay excluded from primary scope but noted where relevant.
- **URL:** https://greenwichbooth.vercel.app
- **Repo path:** /home/long/projects/web/greenwichbooth/src/
- **Files:** src/main.js (~850 lines), src/styles.css (~800 lines)

## Primary user
**Vietnamese high-school student (15–18)** visiting Greenwich Vietnam campus for the first time.
- First encounter with a digital photo booth
- Mobile-first context (tablet/phone on a demo kiosk, possibly laptop)
- No prior instruction; must self-onboard

## Primary task
**Take 4 photos → get a styled 2×2 poster → download it**

## Constraints
- Stack: Vite + Vanilla JS (no framework)
- Brand: Greenwich Vietnam — green (#006b3f), gold (#FFCB2F), dark background
- Accessibility floor: functional (no stated WCAG level)
- No deadline stated

## Reference / competitors
Real photobooth prints (physical), Korean-style digital photo booths (Photoism, Life4cuts)

## Out of scope
- Backend / Vercel Blob upload flow (diagnosed separately)
- Canvas poster composition quality
- Performance on low-end kiosk hardware (noted but not primary focus)
