# Greenwich Booth Redesign — Specification

## Goal

Redesign main UI to be **professional + youthful + on-brand** (green/gold palette, Lion mascot, 2×2 layout) while fixing design audit verdict (11/30 → REDESIGN).

## User & Context

- **Primary user:** Vietnamese high-school student (15–18), first-time digital photo booth
- **Device:** Kiosk/tablet/phone/laptop (mobile-first responsive)
- **Task:** Take 4 photos → styled 2×2 poster → download/QR share
- **Brand:** Greenwich Vietnam — green (#006b3f), gold (#FFCB2F), dark background, Lion mascot

## Design System — MUST IMPLEMENT

### Color Tokens
```
--color-primary:    #006b3f;
--color-secondary:  #2DD77A;
--color-accent:     #FFCB2F;
--color-bg:         #0B1912;
--color-surface:    rgba(15, 30, 20, 0.8);
--color-border:     rgba(255, 255, 255, 0.12);
--color-text:       #F0F5F2;
--color-text-muted: rgba(255, 255, 255, 0.56);
--color-success:    #10b981;
--color-error:      #ef4444;
```

### Typography Scale
- **Headings (Unbounded 900):** 32px (hero), 20px (lg), 16px (md)
- **Body (DM Sans 400–700):** 14px (body), 13px (labels), 12px (hints)

### Spacing Scale (8px base)
`--space-xs: 4px`, `--space-sm: 8px`, `--space-md: 16px`, `--space-lg: 24px`, `--space-xl: 32px`, `--space-2xl: 48px`

### Rounded Corners
`--radius-sm: 6px`, `--radius-md: 12px`, `--radius-lg: 18px`, `--radius-full: 9999px`

## UI Changes — MUST IMPLEMENT

### 1. Header (72px, gradient background)
- Height: 56px → 72px
- Background: Gradient (dark green → darker)
- Title font size: 16px → 18px
- Status dot: Larger, prominent glow

### 2. Tab Bar (Underline, modern)
- Active style: Underline indicator (not background fill)
- Text size: 14px → 16px
- Animated transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)

### 3. Filter Grid (Hero + collapse)
- **Visible:** 4 hero filters (Bình thường, Sống động, Ấm áp, Lạnh)
- **Collapsed:** "Xem thêm" button reveals 5 remaining (Đen Trắng, Vintage, Sepia+, Mờ, Neon)
- Preview size: 120px → 140px
- Active state: Gold border + gold glow

### 4. Sticker Grid (Hero + collapse)
- **Accessories:** 4 hero + "Xem thêm" collapse (same pattern as filters)
- **Poster stickers:** 4 hero + collapse
- Face AI toggle: Larger, prominent placement (28px font, hero treatment)

### 5. Photo Preview Grid (During shooting)
- Grid items: Larger, 120px
- Filled state: Emerald glow border + scale-in animation
- Badge: Larger, clearer numbering (1, 2, 3, 4)

### 6. Shoot Button (Enhanced CTA)
- Padding: 16px → 18px
- Font size: 17px → 18px
- Gradient: green → emerald
- Glow: 0 0 24px rgba(45, 215, 122, 0.3)
- Hover: scale(1.04) + intensified glow
- Focus: 3px gold outline

## UI States — MUST IMPLEMENT (All 6)

1. **Empty State** — Before first shoot
   - Camera box shows: "🚀 Bắt đầu ngay!" + step guidance (1→2→3)
   - Location: Inside camera box area

2. **Loading State** — During shoot & buildPoster
   - Progress bar with percentage (0–100% over ~40s)
   - Text feedback: "Ảnh 1/4" during countdown, "Đang tạo poster..." during build
   - Spinner animation during build

3. **Error State** — Camera permission denied, upload failed
   - Message: "❌ Lỗi" + clear error description
   - Retry button: "Thử lại" or "⬇ Tải về máy"
   - Location: Camera box overlay

4. **Success State** — Photo captured, QR ready
   - Result overlay with poster image, QR code
   - QR label: "✓ Sẵn sàng" or "📱 Quét để tải"
   - Buttons: "⬇ Tải về máy", "↩ Chụp lại" (with confirmation)

5. **Focus-Visible State** — Keyboard navigation
   - All interactive elements: 3px gold outline + 2px offset
   - Rounded corners: 4px
   - Applies to buttons, tabs, links, inputs

6. **Disabled State** — Button disabled, modal open
   - Opacity: 0.5
   - Cursor: not-allowed
   - No hover effects

## Visual & UX Fixes — MUST IMPLEMENT

### Modernization
- ❌ **Remove:** Glassmorphism backdrop-filter (3 surfaces) — dated trend
- ✅ **Add:** Solid surfaces + neon glow borders
- ✅ **Add:** Gradient accents (green → emerald, gold transitions)
- ✅ **Add:** Smooth microinteractions (scale-on-hover, smooth transitions)

### Accessibility
- ✅ Add `:focus-visible` outline on all interactive elements
- ✅ Add `@media (prefers-reduced-motion: reduce)` rule
- ✅ Fix font loading: Move Google Fonts from `@import` (render-blocking) to `<link rel="preconnect">` in HTML

### Copy & Labeling (Vietnamese Pass)
- ✅ Translate all-English labels to Vietnamese (Vintage → Hoài cổ, Hot → Nổi bật, Party → Tiệc)
- ✅ Simplify frame names (remove Magic, Dream, Luxe inflations)
- ✅ Consistent terminology (Đếm ngược, Khung, etc.)

### Dark Pattern Fix
- ✅ Add confirmation dialog before retake() destroys photos
- ✅ Update copy: "Chụp lại sẽ xoá 4 ảnh vừa chụp. Bạn chắc không?" + [Chụp lại] [Huỷ bỏ]

## PRESERVE (Non-negotiable)
- ✅ Color palette: #006b3f, #FFCB2F, #0B1912, #F0F5F2
- ✅ Font pair: Unbounded + DM Sans
- ✅ Lion mascot SVG
- ✅ 70/30 camera/controls layout (7fr/3fr grid)
- ✅ 3-tab organization (Khung/Lọc/Sticker) → **UPDATE:** Tabs should be (Lọc/Hiệu ứng) per current code
- ✅ 2×2 square poster format
- ✅ Green "CHỤP NGAY" shoot button as primary CTA
- ✅ Countdown + flash overlay
- ✅ QR code + download flow
- ✅ Face AI toggle

## Acceptance Criteria

### Task 1: CSS Tokens & Foundation
- [ ] `:root` has all color, spacing, type, radius tokens
- [ ] Tokens used throughout, magic numbers removed
- [ ] `prefers-reduced-motion` rule added
- [ ] No render-blocking Google Fonts @import in CSS

### Task 2: Header Redesign (72px)
- [ ] Header height changed to 72px
- [ ] Background is gradient (dark green → darker)
- [ ] Title font size 18px
- [ ] Status dot larger with prominent glow

### Task 3: Tab Bar Modern (Underline)
- [ ] Active tab shows underline (not background fill)
- [ ] Underline animated, 300ms cubic-bezier
- [ ] Text size 16px
- [ ] Inactive tabs: minimal, gray text

### Task 4: Filter Grid Collapse (4 hero + "Xem thêm")
- [ ] Only 4 hero filters visible by default
- [ ] "Xem thêm" button collapses/reveals remaining 5
- [ ] Preview swatches 140×140px
- [ ] Active state: gold border + gold glow

### Task 5: Sticker Grid Collapse (Hero pattern)
- [ ] Accessories: 4 hero + "Xem thêm" (same pattern)
- [ ] Poster stickers: 4 hero + "Xem thêm"
- [ ] Face AI toggle: Larger (28px), hero treatment

### Task 6: Empty State (Camera box guidance)
- [ ] Before first shoot: "🚀 Bắt đầu ngay!" + step badges (1→2→3)
- [ ] Location: Camera box center
- [ ] Hidden when video stream starts

### Task 7: Loading State (Progress bar)
- [ ] During countdown: "Ảnh N/4" + dot progress
- [ ] During buildPoster: "Đang tạo poster..." + progress bar (0–100% over 40s)
- [ ] Spinner animation

### Task 8: Success State (Result overlay)
- [ ] QR code label: "✓ Sẵn sàng" or "📱 Quét để tải"
- [ ] Download button: "⬇ Tải về máy"
- [ ] Retake button: "↩ Chụp lại"

### Task 9: Confirmation Dialog (Retake protection)
- [ ] Before retake(): Show dialog "Chụp lại sẽ xoá 4 ảnh vừa chụp. Bạn chắc không?"
- [ ] Options: [Chụp lại] [Huỷ bỏ]
- [ ] Only proceed if confirmed

### Task 10: Focus-Visible & Accessibility
- [ ] All interactive elements have `:focus-visible` 3px gold outline
- [ ] Keyboard navigation works (Tab key)
- [ ] Outline offset: 2px, border-radius: 4px

### Task 11: Modern Visuals (Glow, gradients)
- [ ] Remove glassmorphism (backdrop-filter) from 3 surfaces
- [ ] Add neon glows to active elements (gold/emerald)
- [ ] Add smooth transitions (100–300ms)
- [ ] Button hover: scale(1.04)

### Task 12: Vietnamese Copy Pass
- [ ] All labels in Vietnamese
- [ ] Simplified frame names (no Magic/Dream/Luxe)
- [ ] Consistent terminology
- [ ] No label-behavior mismatches

## Priority Order

1. CSS tokens + accessibility (foundation)
2. Header + tab bar redesigns (branding, visual hierarchy)
3. Grid collapses (reduce choice overload)
4. Empty + loading + success states (user confidence)
5. Focus-visible + confirmation dialog (accessibility + UX)
6. Modern visuals (remove glassmorphism, add glows)
7. Vietnamese copy pass (consistency)

## Out of Scope
- Backend / Vercel Blob upload refactoring
- Canvas poster composition changes
- Face AI model updates
- Mobile responsive breakpoints (keep 768px threshold)

## Success Metrics
- ✅ Audit score improves (11/30 → target 22+/30)
- ✅ All 6 UI states visible and working
- ✅ Focus-visible tested with Tab key
- ✅ Git history: 1 commit per task (clean rollback)
- ✅ No regressions (build passes, tests pass)
