---
name: CoffeeDate UI Style Guide (The Ritual Concept)
description: Master instructions for building and refactoring CoffeeDate with the "Ritual" aesthetic (Vintage, Organic, Paper-based).
---

# 📜 CoffeeDate UI Style Guide (The Ritual Concept)

All components, pages, and interactions in CoffeeDate must strictly follow this "Small Ritual" philosophy to maintain a healing, physical, and human-centric experience.

## 1. Visual Philosophy: "The Physical Ritual" 🕯️
*   **Vibe**: Vintage, Organic, Luxurious but Warm.
*   **Physicality**: Use paper textures, subtle shadows, and Serif fonts to mimic a physical letter or newspaper.
*   **Texture**: Every screen must have a 3-5% opacity paper texture overlay (mix-blend-multiply).
*   **Background**: Always `bg-background-paper` (#F4EBDD). NEVER use dark backgrounds.

## 2. Design Tokens (The Soul of the UI) 🎨
All tokens are defined in `src/styles/design-tokens.css` — the **Single Source of Truth**.

*   **Background (Paper)**: `#F4EBDD` → `bg-background-paper`
*   **Surface (Paper Warm)**: `#EFE2D0` → `bg-background-warm`
*   **Ink (Primary Text)**: `#2F241D` → `text-ink`
*   **Burgundy (Accent)**: `#7A2E2E` → `bg-primary` / `text-primary`
*   **Kraft (Highlight)**: `#CDAA7D` → `bg-kraft` / `text-kraft`
*   **Line (Dividers)**: `#D5C2AE` → `border-divider`

### ⛔ FORBIDDEN Classes (Dark Theme Legacy)
**NEVER use these** — they are from the old dark theme:
- `text-white`, `text-slate-*` → Use `text-ink` with opacity
- `bg-background-dark`, `bg-black`, `bg-zinc-*` → Use `bg-background-paper` or `bg-background-warm`
- `border-white/*` → Use `border-divider`
- `font-display` → Use `font-sans` or `font-serif`

## 3. Typography Standards 🖋️
Fonts are loaded from Google Fonts in `index.html` and defined in `design-tokens.css`:

*   **Font Serif**: `Noto Serif` (full Vietnamese support) → `font-serif`
*   **Font Sans**: `Inter` → `font-sans`
*   **Font Mono**: `JetBrains Mono` → `font-mono`

### Typography Classes (defined in `src/styles/typography.css`):
*   **Headings (H1)**: `typo-ritual-h1` — Serif, 30px, Bold, Uppercase, Tight line-height.
*   **Card Titles**: `typo-ritual-card-title` — Sans, 18px, Medium, Ink color.
*   **Body Text**: `typo-ritual-body` — Sans, 14px, Regular, 70% Opacity.
*   **Button Text**: `typo-ritual-btn` — Sans, 18px, Bold, Uppercase, Wider tracking.
*   **Numbers/Meta**: `typo-ritual-mono` — Mono, 14px, Regular, 50% Opacity.
*   **Small Labels**: `typo-ritual-label-small` — Sans, 12px, Bold, Uppercase, Widest tracking.

## 4. Components & Motion 🧱
*   **Border Radius**: Always use `rounded-3xl` (24px) for all cards, inputs, and buttons. 
*   **Active State**: Burgundy background (`bg-primary`) with Paper color text (`text-background-paper`). Add a ChevronRight icon on the right for selection cards.
*   **Normal State**: Paper Warm background (`bg-background-warm`) with Ink text at 70% opacity.
*   **Progress Bar**: 6px thickness, `bg-divider` background, `bg-kraft` fill.
*   **Transitions (Snappy Motion)**: **400ms duration** (0.4s). Use `circOut` with a subtle **Slide-up (y:10 → 0)** to simulate a fast, premium page flip. Avoid older 800ms fade-only effects.
*   **Brand Identity**: Use the official Clique logo (`logo.png`) in core components (`LoadingOverlay`, `WelcomeScreen`, `MatchingStatusCard`). Avoid placeholder "C" text or generic icons for brand-critical UI elements.
*   **Shadows**: Use `shadow-burgundy` for buttons, `shadow-paper` for cards, `shadow-card` for subtle depth.

## 5. Button Presets (defined in `src/styles/colors.css`)
*   **Primary CTA**: `btn-cta-primary` — Burgundy capsule, Paper text.
*   **Secondary CTA**: `btn-cta-secondary` — Paper Warm bg, Ink text, divider border.
*   **Ghost CTA**: `btn-cta-ghost` — Transparent, divider border, Ink text.
*   **Button component**: Use `variant="golden"` which maps to Burgundy styling.

## 6. File Architecture 📁
```
src/styles/
├── design-tokens.css   ← ALL colors, fonts, spacing, shadows, radii
├── typography.css       ← Typography utility classes (typo-ritual-*)
└── colors.css           ← Component presets (buttons, cards, glows)

index.html               ← Google Fonts (Noto Serif, Inter, JetBrains Mono)
src/index.css            ← Tailwind @theme bridge to design tokens
```

## 8. Grouped Survey Pattern (The New Standard) 📋

Starting April 2026, all major CoffeeDate surveys (especially Intake/Round 1) must follow this performance-optimized and premium layout:

### 8.1. Navigation Architecture
*   **Grouping**: Collapse long legacy surveys (30+ steps) into a **3-to-4 step grouped flow**.
*   **Step Orchestration**: Use a master component (e.g., `IntakeSurvey.tsx`) to manage the global step index and a shared layout (`GroupedStepLayout.tsx`).

### 8.2. Fixed Header (The Mirror Pattern)
*   **Progress Bar**: Fixed at `top-0`, 4px height, `bg-primary` (Burgundy) or `bg-kraft`.
*   **Back Button**: 
    *   **Position**: `absolute top-4 left-4 sm:top-6 sm:left-6`.
    *   **Style**: Circular container (`size-8 sm:size-10`), `bg-background-warm`, `shadow-lg`, `border-divider`.
    *   **Icon**: `ArrowLeft` (Burgundy/`text-primary`), sized `w-4 h-4 sm:w-5 h-5`.
    *   **Purpose**: Must perfectly mirror the settings cogwheel position and style from the main `AppLayout`.

### 8.3. Centered Footer
*   **Position**: `fixed bottom-0`, with a transparent-to-paper gradient background.
*   **Primary CTA**: Only ONE centered button (usually "TIẾP TỤC").
*   **Style**: Capsule shape, `bg-primary`, `shadow-burgundy`, bold uppercase text with high tracking.
*   **Removal**: Legacy bottom-left "Back" buttons are removed in favor of the standardized Top-Left icon for a cleaner mobile experience.

### 8.4. Smart Input Logic (Cognitive Load Reduction)
*   **Smart Search**: For fields with many options (Location, Work Field), use a **Searchable Chip Pattern**:
    1.  Show 6 "Suggested/Popular" chips at the top.
    2.  Provide a clean search input below.
    3.  Show dynamic filtered results in a dropdown.
    4.  Allow custom input via "Other" handled as a fallback.
*   **Validation**: 
    1.  Next button must be disabled until all required fields in the group are interacted with.
    2.  Show visual feedback (red highlighting + icons) on incomplete fields if the user attempts to click "Continue" while invalid.

### 8.6. Layout & Spacing Geometry 📐
*   **Vertical Spacing**: Use `space-y-12` (48px) between `SurveyFieldGroup` blocks.
*   **Main Container Padding**: `pt-16` (top), `pb-32` (bottom), `px-6` (sides) for mobile; `sm:px-10` for desktop.
*   **Header Spacing**: Main title should have `mb-14` to divide the introduction from questions.
*   **Input Heights (Compact Ritual Standard)**: 
    *   Primary text inputs & Search/Filter inputs: **Fixed `h-[50px]`** or `min-h-[50px]`.
    *   **Option Buttons (Survey Chips)**: MUST use `size="sm"` (36px height) to maximize information density and maintain a premium, minimalist aesthetic.
*   **Option Button Layouts**: Always use `flex flex-wrap gap-2.5` or multi-column grids (`grid-cols-2` / `grid-cols-3` depending on text length) to keep the UI compact. AVOID using single-column `grid-cols-1` unless the text is exceptionally long (e.g. full sentences).

### 8.7. Color & Typography Hierarchy ✒️
*   **Primary Background**: Always `bg-background-paper` (#F4EBDD).
*   **Secondary Background**: Use `bg-background-warm/30` or `/60` for input fields to create subtle depth.
*   **Text Hierarchy**:
    *   **Question Labels**: `text-ink` (100% opacity), Bold.
    *   **Descriptions**: `text-ink/60`, Regular.
    *   **Placeholders**: `text-ink/20`, Italic font-serif.
    *   **Numbers & Dates**: Always use **`font-mono`** (JetBrains Mono) with `tracking-tighter` for a centered, premium system look.
*   **Accents**: 
    *   `text-primary` (Burgundy) for interactive icons, success states, and **Selection Notes**.
    *   `bg-kraft` for progress bars and decorative elements.

### 8.8. Selection Notes (Instructional Text) 🖋️
To guide users without cluttering the UI:
1. **Standardized Component**: Use `SurveyFieldGroup` which implements this logic automatically.
2. **Automatic Note Logic**:
    - `selectionMode="single"` → Displays "Chọn 1" (auto-translated).
    - `selectionMode="multiple"` → Displays "Có thể chọn nhiều" (auto-translated).
    - `selectionMode="multiple"` + `maxSelection={X}` → Displays "Chọn tối đa X" (auto-translated).
    - `selectionNote` (prop) → Use this ONLY to override the automatic logic (e.g., "Nhập ngày sinh").
3. **Style**: Displayed immediately below the question label (`h3`). Typography: `text-[12px] text-primary italic font-serif opacity-80 leading-none`.
4. **MANDATORY**: Every survey question MUST have a visible selection note to ensure a premium, guiding UX. Never leave a question without an instruction.

### 8.9. Visual Validation Standard ⚠️
*   **Trigger**: Use `GroupedStepLayout` with `StepValidationContext` to track when a user attempts to proceed (`showErrors` state).
*   **Auto-Scroll Logic**:
    *   The `GroupedStepLayout` must accept an `errorFields` prop (array of element IDs).
    *   When "Continue" is clicked and errors exist, the UI must automatically scroll the first element in `errorFields` into view using `element.scrollIntoView({ behavior: 'smooth', block: 'center' })`.
*   **Field Highlight**:
    *   **Animation**: Apply `animate-shake` to the `SurveyFieldGroup` when an error is triggered.
    *   **Question Text**: Change to `text-red-500` when invalid and errors are visible.
    *   **Background**: Apply `bg-red-500/5` and `ring-1 ring-red-500/20` to the `SurveyFieldGroup` container.
    *   **Icon**: Append a `material-symbols-outlined` "error" icon next to the question label.
    *   **Toast**: Trigger `showError` from `useError` context in the footer logic.
*   **Implementation Pattern**: 
    ```tsx
    const errorsList = [];
    if (!value) errorsList.push('field-id');
    
    <GroupedStepLayout errorFields={errorsList} ...>
      <SurveyFieldGroup id="field-id" error={!value} ...>
    </GroupedStepLayout>
    ```

### 8.10. Auto-Focus Standard ⌨️
*   **Mandatory**: Every screen/step that requires text input (Input, textarea, search) **MUST** automatically focus the first input field on mount.
*   **Timing**: Use a 400ms-500ms delay (via `useEffect` + `setTimeout`) to ensure the focus happens AFTER the page transition/slide-up animation has settled.
*   **UX Benefit**: This reduces cognitive load and allows immediate interaction without requiring an extra tap/click.

## 9. Performance & Loading UX ⚡
*   **Initial Splash**: Maximum total duration of **1.5s** (0.6s animation + 0.8s wait).
*   **Welcome Entrance**: Use fast staggering (0.1s delay between items) and snappy 0.5s durations to ensure the app feels ready instantly.
*   **Loading Overlays**: Standard speed of **0.4s** for fade-in/out to match the page transition speed.
