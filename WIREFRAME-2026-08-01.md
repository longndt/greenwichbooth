# Greenwich Booth — Visual Wireframe (Step 3/3)

## Full Screen Layout (Desktop: 1024px width)

```
┌─────────────────────────────────────────────────────────────┐
│  [Header — 72px, gradient dark green bg]                    │
│  🦁 GREENWICH BOOTH                       ● Sẵn sàng       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌──────────────────────────────┐  ┌──────────────────────┐ │
│  │     Camera Box (70%)          │  │   Controls (30%)     │ │
│  │   [Emerald glow border]       │  │                      │ │
│  │   Box-shadow: neon glow       │  │  📍 Step 1/3         │ │
│  │                              │  │  Chọn khung          │ │
│  │   ┌────────────────────────┐ │  │                      │ │
│  │   │                        │ │  ├──────────────────────┤ │
│  │   │   [Video Stream]       │ │  │📷 Lọc │ 🎭 Hiệu ứng  │ │
│  │   │   or                   │ │  │┌──────────────────────┤ │
│  │   │   [Empty State]        │ │  │ 🎨 Bộ lọc màu       │ │
│  │   │   🚀 Bắt đầu ngay!    │ │  │                      │ │
│  │   │   Bước 1: Chọn khung   │ │  │ [Swatch 140×140]     │ │
│  │   │   Bước 2: Chụp        │ │  │ [S1] [S2] [S3] [S4]  │ │
│  │   │   Bước 3: Tải về      │ │  │                      │ │
│  │   │                        │ │  │ [+ Xem thêm]         │ │
│  │   └────────────────────────┘ │  │                      │ │
│  │                              │  │ 📸 Đeo lên ảnh       │ │
│  │   [Countdown overlay]        │  │                      │ │
│  │   [Loading indicator]        │  │ 🤖 Face AI · BẬT     │ │
│  │   [Focus ring on focus]      │  │                      │ │
│  │                              │  │ [4 hero accessories] │ │
│  └──────────────────────────────┘  │ [+ Xem thêm]         │ │
│                                    │                      │ │
│                                    │ Sticker poster       │ │
│                                    │ [4 hero stickers]    │ │
│                                    │ [+ Xem thêm]         │ │
│                                    │                      │ │
│                                    ├──────────────────────┤ │
│                                    │                      │ │
│                                    │ 📷 CHỤP NGAY        │ │
│                                    │ [Neon glow effect]  │ │
│                                    │ 4 ảnh · 3s mỗi ảnh  │ │
│                                    │                      │ │
│                                    └──────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## State: Empty (Before First Shoot)

```
Camera Box:
┌─────────────────────────────────────┐
│                                     │
│        🚀 Bắt đầu ngay!            │  ← Gold text, Unbounded 28px
│                                     │
│   ┌─────────────────────────────┐   │
│   │ Bước 1: Chọn khung → Lọc   │   │
│   │ Bước 2: Chụp 4 ảnh liên tiếp│  │
│   │ Bước 3: Tải về hoặc quét QR│   │
│   └─────────────────────────────┘   │
│                                     │
│   Step indicators:                  │
│   [1] → [2] → [3]                   │  ← Badges, sequential
│                                     │
└─────────────────────────────────────┘
```

---

## State: Shooting (During Photo Capture)

```
Controls Column:
┌──────────────────────────────────────┐
│ 📍 Step 2/3                          │
│ Đang chụp...                         │
├──────────────────────────────────────┤
│ Photo Preview Grid (2×2 - VISIBLE)   │
│                                      │
│  ┌────────────┐  ┌────────────┐    │
│  │ [Camera]   │  │     ✓1     │    │
│  │  photo 1   │  │   Filled   │    │
│  │  [Filled]  │  │            │    │
│  └────────────┘  └────────────┘    │
│                                      │
│  ┌────────────┐  ┌────────────┐    │
│  │ [Camera]   │  │     ✓2     │    │
│  │            │  │   Filled   │    │
│  │ [Empty]    │  │            │    │
│  └────────────┘  └────────────┘    │
│                                      │
└──────────────────────────────────────┘

Camera Box:
┌─────────────────────────────────────┐
│  Countdown Overlay:                 │
│                                     │
│     ┌──────────────┐                │
│     │      3       │ ← Big circle   │
│     └──────────────┘                │
│     Ảnh 2 / 4                       │
│     [●○○○] (progress dots)          │
│                                     │
│  When done: "😊"                    │
│                                     │
└─────────────────────────────────────┘
```

---

## State: Loading (After 4th Photo)

```
Processing Overlay (Full screen):
┌─────────────────────────────────────┐
│                                     │
│        ⏳ Đang tạo poster...       │
│        Chờ chút (40 giây)           │
│                                     │
│        ████████░░ 60%               │ ← Progress bar
│                                     │
│    [Spinner animation]              │
│                                     │
└─────────────────────────────────────┘
```

---

## State: Success (Result Screen)

```
Result Overlay (Modal):
┌─────────────────────────────────────┐
│                                     │
│  ✅ Xong rồi!                       │ ← Gold text
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [Poster image preview]     │   │ ← 4-photo grid
│  │  [2×2 layout, colorful]     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ┌─────────┐  ┌──────────┐  │   │
│  │ │ [QR]    │  │ 📱 Quét  │  │   │
│  │ │         │  │ để tải   │  │   │
│  │ │ ✓ Sẵn   │  │ về       │  │   │
│  │ │ sàng    │  └──────────┘  │   │
│  │ └─────────┘  ⬇ Tải về máy  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [↩ Chụp lại] (with confirmation)   │
│                                     │
└─────────────────────────────────────┘
```

---

## State: Focus-Visible (Keyboard Navigation)

```
Any interactive element with focus:

Button:
┌─────────────────────────────┐
┃ Gold outline (3px)          ┃  ← :focus-visible
┃ ┌───────────────────────┐   ┃
┃ │   📷 CHỤP NGAY        │   ┃
┃ │   4 ảnh · 3s mỗi ảnh  │   ┃
┃ └───────────────────────┘   ┃
┃ Outline offset: 3px         ┃
┗─────────────────────────────┘

Tab:
📷 Lọc [focused] | 🎭 Hiệu ứng
═══════════════════════════════  ← Gold underline + outline
```

---

## State: Error (Camera Permission Denied)

```
Camera Box:
┌─────────────────────────────────────┐
│                                     │
│        ❌ Lỗi                       │
│                                     │
│  Không thể dùng camera.             │
│  Kiểm tra quyền truy cập.           │
│                                     │
│  [Thử lại]  ← Button, gold+green   │
│                                     │
└─────────────────────────────────────┘
```

---

## State: Disabled (Button during processing)

```
Shoot Button:
┌──────────────────────────────┐
│  📷 CHỤP NGAY                │
│  [Opacity 0.5]               │
│  [Cursor: not-allowed]       │
│  [No hover effects]          │
└──────────────────────────────┘
```

---

## Tablet/Mobile Responsive (< 768px)

```
┌─────────────────────────────┐
│ [Header — 64px]             │
│ 🦁 GREENWICH BOOTH ● Sẵn    │
└─────────────────────────────┘

┌─────────────────────────────┐
│  [Camera Box — 100% width]  │
│  ┌─────────────────────────┐│
│  │ [Video / Empty State]   ││
│  │                         ││
│  │ [Controls Below]        ││  ← Stack vertically
│  └─────────────────────────┘│
│                             │
│  Step Indicator:            │
│  📍 Step 1/3                │
│                             │
│  Tab Bar (full width):      │
│  │📷 Lọc │ 🎭 Hiệu ứng│   │
│                             │
│  Filter Grid (2×2):         │
│  │ [S1] [S2]              │
│  │ [S3] [+Xem thêm]       │
│                             │
│  📷 CHỤP NGAY               │
│  (full width button)        │
│                             │
└─────────────────────────────┘
```

---

## Color & Typography Applied

### Header
```
Font: Unbounded 900 18px
Text: "GREENWICH BOOTH"
Color: var(--color-accent)  /* #FFCB2F gold */
Background: linear-gradient(180deg, #0D1F14 0%, #0B1912 100%)
Height: 72px
```

### Step Indicator
```
Font: DM Sans 700 14px
Color: var(--color-text-muted)
Example: "📍 Step 1/3"
```

### Button (CHỤP NGAY)
```
Font: Unbounded 900 18px (text), DM Sans 500 12px (hint)
Color: white
Background: linear-gradient(135deg, #006b3f, #2DD77A)
Glow: 0 0 24px rgba(45, 215, 122, 0.3)
Hover: scale(1.04) + intensified glow
Focus: 3px gold outline
```

### Filter Swatches
```
Size: 140×140px (from 120px)
Border: 2px solid border-color
Active state: gold border + gold glow
Rounded: var(--radius-md) = 12px
```

### Tab Bar
```
Active tab: gold underline (3px, animated)
Text size: 16px (from 14px)
Font: DM Sans 700
Underline animation: cubic-bezier(0.4, 0, 0.2, 1)
```

### Success Overlay
```
Background: rgba(5, 14, 9, 0.92) + blur(18px)
Title: Unbounded 900 20px gold
Card: rgba(255, 255, 255, 0.05) solid surface
Border: 1px solid rgba(255, 255, 255, 0.11)
Rounded: var(--radius-lg) = 18px
```

---

## Animations & Interactions

### Filter Swatch Selection
```
.flt {
  transition: transform 100ms ease-out, border-color 120ms ease-out;
}

.flt:hover {
  transform: scale(1.08);
}

.flt.active .flt-prev {
  border-color: var(--color-accent);
  box-shadow: 0 0 20px rgba(255, 203, 47, 0.4);
}
```

### Button Hover
```
.shoot-btn:hover:not(:disabled) {
  transform: scale(1.04);
  box-shadow: 
    0 12px 40px rgba(0, 107, 63, 0.55),
    0 0 40px rgba(45, 215, 122, 0.5);
}

.shoot-btn:active:not(:disabled) {
  transform: scale(0.97);
}
```

### Tab Underline
```
.tab.active::after {
  animation: slideInUnderline 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUnderline {
  from { width: 0; left: 50%; }
  to   { width: 100%; left: 0; }
}
```

### Photo Slot Fill Animation
```
.pv-slot.filled .pv {
  animation: pv-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pv-pop {
  from { transform: scale(0.82); opacity: 0.6; }
  to   { transform: scale(1);    opacity: 1; }
}
```

### Loading Bar Progress
```
@keyframes progress {
  0%   { width: 0%; }
  100% { width: 100%; }
}

.progress-bar {
  animation: progress 40s ease-in-out;
}
```

---

## Summary of Visual Changes

| Aspect | Before | After | Why |
|--------|--------|-------|-----|
| **Header height** | 56px | 72px | More prominent branding |
| **Tab style** | Background fill | Underline + animated | Modern, cleaner look |
| **Filter grid** | 3×3 (9 items) | 4 hero + collapse | Reduce cognitive load |
| **Cards** | Glassmorphism | Solid + neon glow | Modern, not dated |
| **Corners** | Flat 12px | Token system | Consistent hierarchy |
| **Focus ring** | None | 3px gold outline | Accessibility priority |
| **Button text** | Mixed | All Vietnamese | Consistency |
| **Loading** | None | Progress bar | User confidence |
| **Empty state** | None | Step guidance | Self-onboard support |
| **Confirmation** | None | Dialog on retake | Dark pattern fix |

---

**Ready to code this? Priority order: CSS tokens → states → collapse grids → modern visuals.**
