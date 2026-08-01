# Greenwich Booth — UI Redesign Brief (Step 3/3)

**Goal:** Modernize UI to be professional + youthful + on-brand (green/gold palette, Lion mascot, 2×2 layout).

**Verdict:** REDESIGN (11/30 audit) → Fix 6 UI states, reduce choice overload, modernize visuals.

---

## Design System Foundation

### Color Tokens (Extend :root)
```css
--color-primary:    #006b3f;        /* Greenwich green — trust, stability */
--color-secondary:  #2DD77A;        /* Emerald glow — energy, modernity */
--color-accent:     #FFCB2F;        /* Gold — confidence, balance */
--color-bg:         #0B1912;        /* Dark background */
--color-surface:    rgba(15, 30, 20, 0.8);  /* Cards, containers */
--color-border:     rgba(255, 255, 255, 0.12);
--color-text:       #F0F5F2;        /* Light text */
--color-text-muted: rgba(255, 255, 255, 0.56);
--color-success:    #10b981;        /* Validation, success states */
--color-error:      #ef4444;        /* Error, destructive actions */
```

### Typography Scale (Modern, DM Sans + Unbounded)
```css
/* Unbounded (headings) */
--type-hero:    900 32px / 1.2 'Unbounded', sans-serif;    /* Main CTA */
--type-lg:      900 20px / 1.3 'Unbounded', sans-serif;    /* Section titles */
--type-md:      700 16px / 1.4 'DM Sans', sans-serif;      /* Tabs, buttons */
--type-sm:      600 13px / 1.5 'DM Sans', sans-serif;      /* Labels */

/* DM Sans (body) */
--type-body:    400 14px / 1.6 'DM Sans', sans-serif;      /* Descriptions */
--type-hint:    500 12px / 1.5 'DM Sans', sans-serif;      /* Hints, secondary */
```

### Spacing Scale (8px base)
```css
--space-xs:  4px;    /* Tight spacing */
--space-sm:  8px;    /* Default gap */
--space-md:  16px;   /* Section spacing */
--space-lg:  24px;   /* Major section */
--space-xl:  32px;   /* Large spacing */
--space-2xl: 48px;   /* Hero spacing */
```

### Rounded Corners (Modern, not overly rounded)
```css
--radius-sm:  6px;    /* Small buttons, inputs */
--radius-md:  12px;   /* Cards, medium components */
--radius-lg:  18px;   /* Large cards, hero areas */
--radius-full: 9999px; /* Circles, pills */
```

---

## Layout & Component Structure

### 1. Header (Redesigned)
**Current:** Small, minimal (56px)  
**New:** Larger, brand-forward (72px), with subtle gradient background

```
┌─────────────────────────────────────┐
│ 🦁 GREENWICH BOOTH      [● Sẵn sàng] │  ← Larger title, better spacing
└─────────────────────────────────────┘
```

**Changes:**
- `height: 72px` (from 56px)
- Background: Gradient (dark green → darker)
- Title font size: 18px (from 16px)
- Status dot: Larger, more prominent glow
- Padding: `space-md` (16px) instead of 20px

---

### 2. Main Grid (Unchanged structure, improved visuals)
Layout stays **70% camera · 30% controls**

**Header area in controls section — ADD STEP INDICATOR:**
```
┌─ CONTROLS ─────────┐
│ Step 1/3            │ ← Step badge (new)
│ Chọn khung          │ ← Step description
├────────────────────┤
│ 📷 Lọc | 🎭 Hiệu ứng│ ← Tab bar (redesigned)
├────────────────────┤
│ [Filter grid 3×3]  │
├────────────────────┤
│ 📷 CHỤP NGAY       │ ← Enhanced CTA
└────────────────────┘
```

---

### 3. Camera Box (Subtle enhancements)
**Current:** Rounded box with subtle border  
**New:** 
- Border color: emerald glow (--color-secondary with glow)
- Shadow: Soft shadow + neon glow layer
- Focus ring: Gold outline when focused (keyboard nav)

```css
.cam-box {
  border: 2px solid var(--color-secondary);
  box-shadow: 
    0 0 0 1px var(--color-secondary),
    0 0 32px rgba(45, 215, 122, 0.25);  /* Neon glow */
}

.cam-box:focus-within {
  box-shadow: 
    0 0 0 3px var(--color-accent),      /* Gold focus ring */
    0 0 32px rgba(45, 215, 122, 0.25);
}
```

---

### 4. Tab Bar (Modernized)
**Current:** 2 tabs, muted style  
**New:**
- Larger text (14px → 16px)
- Active tab: Gradient background (green → emerald)
- Inactive tabs: Minimal, gray text
- Indicator: Animated underline (not background fill)

```
┌─────────────────────────┐
│  📷 Lọc  │  🎭 Hiệu ứng │
│  ─────── (underline)    │ ← Animated gold underline
└─────────────────────────┘
```

**CSS Changes:**
```css
.tab {
  font-size: 16px;  /* Larger */
  font-weight: 700;
  position: relative;
  border-bottom: 3px solid transparent;
}

.tab.active {
  background: none;
  border-bottom-color: var(--color-accent);
  color: var(--text);
}

.tab.active::after { display: none; }  /* Remove old gradient */
```

---

### 5. Filter Grid (Hero + "Xem thêm" collapse)
**Current:** 3×3 grid, all 9 filters visible  
**New:** 
- **Visible by default:** 4 hero filters (Bình thường, Sống động, Ấm áp, Lạnh)
- **Collapsed section:** "Xem thêm" button → reveals remaining 5 filters (Đen Trắng, Vintage, Sepia+, Mờ, Neon)
- Larger preview swatches (120px → 140px)
- Subtle glow on active swatch

```
┌─────────────────────┐
│  🎨 Bộ lọc màu     │ ← Section label (uppercase, smaller)
├─────────────────────┤
│ [Swatch 140×140 grid 2×2] │ ← 4 hero filters
│ [Swatch] [Swatch]         │
├─────────────────────┤
│  [+ Xem thêm]       │ ← Collapse toggle
├─────────────────────┤
│ [Expanded 5 filters] │ ← Revealed on click
└─────────────────────┘
```

**Why this works:**
- Reduces cognitive load (4 vs 9 options)
- Youth appeal: Progressive disclosure (trendy pattern)
- Still accessible: All 9 available if user explores

---

### 6. Sticker/Accessory Section (Redesigned)
**Current:** 3×3 grid, mixed layouts  
**New:**
- **Face AI toggle:** Hero treatment (larger button, prominent placement)
- **Accessories (Đeo lên ảnh):** 3×3 grid, 4 hero items + collapse
- **Poster stickers (Sticker poster):** 3×3 grid, same collapse pattern

```
┌─────────────────────┐
│ 🤖 Face AI · BẬT    │ ← Larger toggle, prominent
│ (glow effect)       │
├─────────────────────┤
│ 👓 Kính | 🥸 Râu    │ ← 4 hero accessories
│ 🎭 Mặt nạ | 🤪 Điên │
├─────────────────────┤
│ [+ Xem thêm]        │
├─────────────────────┤
│ Sticker poster      │
│ [4 hero stickers]   │
└─────────────────────┘
```

---

### 7. Photo Preview Grid (During shooting)
**Current:** 2×2 grid, small badges  
**New:**
- Larger grid items (each photo ~120px)
- **Filled state:** Emerald glow border + scale-in animation
- **Empty state:** Camera icon placeholder + clear dashed border
- **Badge:** Larger, clearer numbering (1, 2, 3, 4)

```
┌──────────────────┐
│ [📷] [✓1]        │  ← Filled slot has checkmark
│ [  ] [   ]       │  ← Empty slots show camera icon
└──────────────────┘
```

---

### 8. Shoot Button (Enhanced CTA)
**Current:** Green gradient, semi-transparent text  
**New:** 
- **Size:** 16px → 18px padding
- **Background:** Gradient (green → emerald) + glow effect
- **Text:** Bold Unbounded, all-caps (already done)
- **On hover:** Scale up slightly, glow intensifies
- **Focus ring:** Gold outline (keyboard nav)
- **Disabled state:** Opacity 0.5, cursor not-allowed

```css
.shoot-btn {
  padding: 18px 16px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  font-size: 18px;
  box-shadow: 
    0 8px 32px rgba(0, 107, 63, 0.45),
    0 0 24px rgba(45, 215, 122, 0.3);  /* Glow */
}

.shoot-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 12px 40px rgba(0, 107, 63, 0.55),
    0 0 40px rgba(45, 215, 122, 0.5);  /* Intensified glow */
}

.shoot-btn:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}
```

---

## UI States Implementation

### 6 Critical States (All must be visible)

#### **1. Empty State (Before first shoot)**
Shown in camera box area:
```
┌─────────────────────┐
│                     │
│  🚀 Bắt đầu ngay!   │ ← Hero text
│                     │
│  Bước 1: Chọn khung │ ← Step guidance
│  Bước 2: Chụp       │
│  Bước 3: Tải về     │
│                     │
└─────────────────────┘
```

#### **2. Loading State (During shoot & buildPoster)**
Overlay on camera box:
```
┌─────────────────────┐
│  ⏳ Đếm ngược...    │ ← When counting down
│     3               │
│                     │
│  ⏳ Đang tạo poster  │ ← When processing
│  Chờ chút (40s)     │
│  ██████░░ 60%       │ ← Progress bar
└─────────────────────┘
```

#### **3. Error State (Camera permission, upload failed)**
```
┌─────────────────────┐
│  ❌ Lỗi            │
│  Không thể dùng camera. │
│  Kiểm tra quyền truy cập. │
│  [Thử lại]          │
└─────────────────────┘
```

#### **4. Success State (Photo captured, QR ready)**
```
┌─────────────────────┐
│  ✅ Xong rồi!      │
│  [Poster image]     │
│  📱 Quét để tải    │
│  [QR code]          │ ← With label "✓ Sẵn sàng"
│  [⬇ Tải về máy]    │
└─────────────────────┘
```

#### **5. Focus-Visible State (Keyboard navigation)**
All interactive elements:
```css
:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

#### **6. Disabled State (Button disabled, modal open)**
```css
:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-open .interactive {
  pointer-events: none;
  opacity: 0.3;
}
```

---

## Modern Visual Techniques (Youth Appeal)

### 1. Gradient Accents
Remove flat colors → subtle gradients:
```css
/* Active button gradient */
.tab.active {
  border-bottom: 3px solid;
  border-image: linear-gradient(90deg, var(--color-accent), var(--color-secondary)) 1;
}

/* Hero text gradient (optional) */
.proc-txt {
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 2. Neon Glow Effects
Replace glassmorphism with glow:
```css
/* Glow on active elements */
.stkr.active {
  border-color: var(--color-accent);
  box-shadow: 
    0 0 0 1px var(--color-accent),
    0 0 20px rgba(255, 203, 47, 0.4);  /* Gold glow */
}

.cam-box {
  box-shadow: 
    0 0 0 1px var(--color-secondary),
    0 0 32px rgba(45, 215, 122, 0.25);  /* Emerald glow */
}
```

### 3. Smooth Microinteractions
```css
/* Scale on hover (not translate) */
button:hover:not(:disabled) {
  transform: scale(1.04);
}

/* Bounce on click */
button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Smooth filter transitions */
#cam {
  transition: filter 100ms ease-out;
}
```

### 4. Typography Hierarchy
```css
/* Hero section — Large, bold */
.empty-state-title {
  font: var(--type-hero);
  color: var(--color-accent);
  letter-spacing: 1px;
}

/* Step labels — Medium, readable */
.step-label {
  font: var(--type-md);
  color: var(--text-muted);
}
```

---

## Copy & Labeling (Full Vietnamese Pass)

### Before (Mixed/English)
- ❌ "Thời gian" (confusing)
- ❌ "Magic Frame", "Dream Luxury" (inflated)
- ❌ Mix of Vietnamese + English labels

### After (Consistent Vietnamese)
- ✅ "Đếm ngước" (clear)
- ✅ "Khung xanh", "Khung vàng" (simple, aesthetic)
- ✅ All labels in Vietnamese
- ✅ No label-behavior mismatch

**Label mapping:**
```
Filter labels (current → new):
  Bình thường → Bình thường (keep)
  Sống động → Sống động (keep)
  Ấm áp → Ấm áp (keep)
  Lạnh → Lạnh (keep)
  Đen Trắng → Đen Trắng (keep)
  Vintage → Hoài cổ
  Sepia+ → Sepia+
  Mờ → Mờ
  Neon → Neon

Frame names (simplify):
  "gw-floral" → "Khung hoa"
  "gw-academic" → "Khung tốt nghiệp"
  "gw-emerald" → "Khung lá xanh"
  (remove: "Magic", "Dream", "Luxe")

Sticker labels (ensure all Vietnamese)
Accessory labels (ensure all Vietnamese)
```

---

## Accessibility Improvements

### 1. Keyboard Navigation
```html
<!-- All buttons are already focusable -->
<!-- Add tabindex for modal controls -->
<div class="result-ov">
  <button id="retake-btn" tabindex="0">
  <a id="dl-link" tabindex="0">
</div>
```

### 2. ARIA Labels (Keep existing, enhance where missing)
```html
<!-- Already good, but add confirmation dialog ARIA -->
<div role="alertdialog" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Bạn chắc chứ?</h2>
  <p>Chụp lại sẽ xoá 4 ảnh vừa chụp.</p>
  <button aria-label="Xác nhận chụp lại">Chụp lại</button>
  <button aria-label="Huỷ bỏ">Huỷ bỏ</button>
</div>
```

### 3. Prefers-Reduced-Motion (Add to :root level)
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. Font Loading (Fix render-blocking)
**In index.html** (not in CSS):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap">
```

---

## Modern Visual Summary (What Changes)

| Element | Current | New |
|---------|---------|-----|
| **Header** | 56px, minimal | 72px, gradient bg, larger title |
| **Tab bar** | Background fill | Underline indicator (animated) |
| **Filters** | 3×3 grid (9) | 4 hero + "Xem thêm" collapse |
| **Cards** | Glassmorphism | Solid surface + neon glow |
| **Focus** | None | 3px gold outline |
| **Disabled** | Opacity 0.35 | Opacity 0.5 + cursor not-allowed |
| **Button hover** | translateY | scale 1.04 + glow intensify |
| **Loading** | None | Progress bar + percentage |
| **Rounded corners** | 12px flat | --radius tokens (6/12/18px) |
| **Typography** | Fixed sizes | Type scale tokens (12–32px) |

---

## Implementation Roadmap

1. ✅ Add CSS token system (colors, spacing, type scale)
2. ✅ Add :focus-visible + prefers-reduced-motion
3. ✅ Redesign header (height, gradient)
4. ✅ Redesign tab bar (underline, larger text)
5. ✅ Collapse frame/sticker grids (4 hero + "Xem thêm")
6. ✅ Add loading state (progress bar, text feedback)
7. ✅ Add empty state (step guidance in camera box)
8. ✅ Add success state labels (QR, download confirmation)
9. ✅ Add confirmation dialog before retake
10. ✅ Modernize surfaces (remove glassmorphism, add glows)
11. ✅ Full Vietnamese copy pass
12. ✅ Fix font loading (preconnect, not @import)

---

**Next:** Implement this design brief step-by-step. Ready?
