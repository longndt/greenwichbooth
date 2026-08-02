# 10 Concept Poster Design — Greenwich Booth

## Overview
Mỗi concept là một design theme hoàn chỉnh cho poster 1080×1440px. Random chọn 1 khi generate.

---

## 01. Leon Padre Campus
**Aesthetic:** Warm, welcoming, community-focused  
**Primary Colors:** Warm brown/sepia (#8B6F47), cream (#F5EDD6)  
**Secondary:** Gold accents (#D4AF37)  
**Layout:** Centered, large 4-photo grid, generous padding  
**Typography:** Large bold serif header, warm tones  
**Border Style:** Subtle warm gold border (4-6px)  
**Photo Frame:** Gold glow + cream/brown backdrop  
**Emoji:** Warm celebratory (🎉, 😊, 👏, ✨)  
**Footer:** Centered, warm typography

---

## 02. Future Passport
**Aesthetic:** Modern, minimal, ticket/credential style  
**Primary Colors:** Navy/dark (#1a1a2e), white (#FFFFFF)  
**Secondary:** Teal accent (#0f7173)  
**Layout:** Horizontal ticket layout, left content + right QR area  
**Typography:** Modern sans-serif, structured  
**Border Style:** Dashed border (minimalist), teal accents  
**Photo Frame:** 2x2 grid in passport style  
**Design Elements:** Passport-like perforations, ID badge mockup  
**Footer:** Minimal credential-style footer  
**QR Position:** Right side, prominent

---

## 03. Admissions Festival
**Aesthetic:** Bold, energetic, youth-focused  
**Primary Colors:** Dark teal (#1B5E5E), vibrant orange (#FF6B35)  
**Secondary:** Cream (#F5EDD6)  
**Layout:** Dark green main + orange accent sidebar (vertical)  
**Typography:** Bold, high contrast, modern  
**Border Style:** Dark green outer, orange accent stripe  
**Photo Frame:** 2x2 grid on dark green, orange emoji dots  
**Special Elements:** Orange circle badges with emojis  
**Footer:** Dark with orange accent

---

## 04. Greenwich Champion
**Aesthetic:** Prestigious, luxury, gold-focused  
**Primary Colors:** Dark green (#0D3D38), gold (#FFD700)  
**Secondary:** Purple glow (#6B4BA0)  
**Layout:** Centered, circular/oval frame emphasis  
**Typography:** Elegant serif + gold  
**Border Style:** Gold circular frame, purple gradient inner border  
**Photo Frame:** Gold circular rings around photos  
**Signature Element:** Central gold compass rose accent  
**Footer:** Gold separator line with minimal text  
**Emoji:** Prestigious/celebratory (🏆, ✨, 👑)

---

## 05. Global Student Life
**Aesthetic:** Inclusive, clean, contemporary  
**Primary Colors:** Teal (#0F7173), soft cream (#F5EDD6)  
**Secondary:** Light green accent (#90C8AC)  
**Layout:** Balanced, geometric shapes, clean spacing  
**Typography:** Modern sans-serif, readable  
**Border Style:** Teal rounded rectangle border  
**Photo Frame:** Clean teal frames, minimal shadow  
**Design Elements:** Geometric shapes as accent (circles, lines)  
**Footer:** Centered, teal typography

---

## 06. Tech & Creative Lab
**Aesthetic:** Innovation-focused, creative, modern  
**Primary Colors:** Dark forest green (#1B4332), gold (#FFD700)  
**Secondary:** Orange accent (#FF6B35)  
**Layout:** 2x2 grid with gold borders, clean spacing  
**Typography:** Modern geometric sans-serif  
**Border Style:** Gold frame (thick 6-8px) + purple inner  
**Photo Frame:** Gold rounded borders, tech-inspired  
**Special Elements:** Gold corner accents, technical feel  
**Footer:** Gold dashed line separator

---

## 07. Lion Parade
**Aesthetic:** Playful, energetic, mascot-focused  
**Primary Colors:** Dark green (#1B5E5E), cream (#F5EDD6)  
**Secondary:** Gold (#FFD700)  
**Layout:** 2x2 photo grid + emoji/mascot badge sidebar  
**Typography:** Bold, friendly  
**Border Style:** Gold rounded corners  
**Photo Frame:** Gold borders, clean squares  
**Special Elements:** Large emoji badges (vertical strip on side)  
**Mascot Area:** Designated space for mascot/branding icon  
**Footer:** Simple, cream/gold

---

## 08. Studdy Abroad Vibe
**Aesthetic:** Academic, international, aspirational  
**Primary Colors:** Light cream (#F5EDD6), soft teal (#7FB3D5)  
**Secondary:** Teal border (#0F7173)  
**Layout:** Horizontal orientation (landscape feel), centered  
**Typography:** Academic serif + clean sans-serif  
**Border Style:** Light teal border (2-3px), minimal  
**Photo Frame:** Teal outlined squares, minimal shadow  
**Design Elements:** Simple line decorations, minimalist  
**Footer:** Minimal text, centered, light palette

---

## 09. Premium Minimal Brand
**Aesthetic:** Luxury minimalism, editorial, high-end  
**Primary Colors:** Off-white (#F5EDD6), dark teal/green (#1B5E5E)  
**Secondary:** Gold accent (#C9A961)  
**Layout:** Extreme minimalism, generous white space  
**Typography:** Elegant serif headers, minimal text  
**Border Style:** Thin gold line (2-3px), sophisticated  
**Photo Frame:** Clean squares, minimal borders  
**Design Elements:** Subtle geometric accents, luxury feel  
**Footer:** Minimal, high-end aesthetic  
**Logo**: Compass rose small, top corner

---

## 10. Social Share Frame
**Aesthetic:** Modern, shareable, gradient-forward  
**Primary Colors:** Cream background (#F5EDD6), dark teal (#1B5E5E)  
**Secondary:** Gradient teal→green (#0F7173→#2D6A4F)  
**Layout:** Vertical gradient sidebar (right/left), centered photos  
**Typography:** Modern sans-serif, social media friendly  
**Border Style:** Gradient accent stripe + subtle border  
**Photo Frame:** 2x2 grid with gradient corner accents  
**Special Elements:** Vertical gradient bar with branding  
**Footer:** Positioned in gradient area, white text  
**QR Position:** Integrated in gradient bar

---

## Implementation Strategy

### Canvas Configuration (1080×1440)
- All concepts use same canvas dimensions
- Adapt layout/proportions to theme

### Randomization
- `buildPoster()` → Select random concept (1-10)
- Apply theme colors, typography, layout
- Maintain photo grid consistency (4 photos)

### Component Reusability
- Base layout elements (photos, header, footer)
- Theme overlays (colors, borders, gradients)
- Typography variants per theme

### Asset Requirements
- Logo: Greenwich compass (fixed for all)
- Gradients: Define per concept
- Borders/frames: Define stroke styles

---

## Development Order (Priority)
1. **Current (Champion)** — Already implemented ✅
2. **Admissions Festival** — Dark green + orange, high visual contrast
3. **Tech & Creative Lab** — Similar gold aesthetic, different layout
4. **Premium Minimal Brand** — Simplification from current
5. Remaining 6 concepts...
