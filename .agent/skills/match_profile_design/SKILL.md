---
name: Match Profile Design & Architecture
description: Comprehensive guidelines for maintaining and extending the premium cinematic Match Profile experience in Clique83.
---

# 🎬 Match Profile Design & Architecture

This document serves as the master blueprint for the `MatchProfilePage.tsx` and its supporting ecosystem. Future AI assistants must strictly adhere to these architectural patterns, theatrical rules, and cinematic standards to preserve the high-end Clique83 identity.

## 1. Core Visual Philosophy: "The Theater of Discovery" 🔦

The Match Profile is not just a data display; it is a **cinematic journey**. Every interaction must feel like a reveal.

### A. Background: Cinematic Parallax & Paper Texture
All background visuals are managed by the `CinematicBackground` component (`src/shared/components/CinematicBackground.tsx`).
*   **Initial State (The Blank Canvas)**: The profile starts with `opacity: 0` and a subtle paper texture grain. The user feels the "Paper" coming to life.
*   **Progressive Reveal**: As the user scrolls deeper, the image must transition to `opacity: 1` with an organic fade-in.
*   **Layering**:
    *   `z-0`: `CinematicBackground` (Base Paper Layer + Parallax Blobs + Organic Grain).
    *   `z-10`: `FloatingParticles` (Subtle dust/paper fiber effect).
    *   `z-20`: Sub-section decorations.
    *   `z-30`: Core Story content (Ink-like text, Paper Cards).

### B. High-End FX (Framer Motion)
*   **Scroll Reveal**: Always wrap major story sections in the internal `ScrollReveal` component. It implements a smooth slide-in from `y: 40` with an organic fade to create a theatrical "Ink on Paper" effect.
*   Use `useTransform` and `useScroll` for all parallax and reveal effects.
*   Stick to "Ritual" motions: Slow, steady fade-ins, and staggered children reveals.
*   **Avoid**: High-frequency bouncy animations or generic UI transitions.

---

## 2. The 11-Step Sequential Storyline 🧩

The page follows a strict psychological sequence. Do not merge steps or change their order without a significant UX reason:

1.  **Identity Tags**: Clean, floating tags (`MatchData.name`, `age`, `city`, `job`). Establish the factual base.
2.  **The Hook**: A one-sentence emotional entry point ("What makes this person special?").
3.  **The Match Thesis**: The core reasoning from the AI algorithm explaining the "Why".
4.  **Fast Proof**: 3 bullet points of immediate evidence (shared hobbies, values, or life stages).
5.  **Compatibility Narrative**: A deep-dive paragraph explaining the synergistic bond.
6.  **Complementarity Check**: Highlighting "Opposites attract" or "Different but fulfilling" aspects.
7.  **Date Visualization**: A highly descriptive scenario of what the first date would look and feel like.
8.  **Honest Realism**: Transparency section. Addresses potential friction or "Watch-outs" (Honesty Check).
9.  **Quick Facts Snapshot**: Tabular/Grid data for logistical requirements (Height, Smoking, Drinking, Intention).
10. **Full Profile**: Complete secondary bio, lifestyle details, and interests.
11. **Conversion Block**: The decision moment (Final Thesis + Choice).

---

## 3. Data Integration & Localization 🌍

### A. Localization Management
The project uses `react-i18next`. The `MatchProfilePage` handles API response objects which contain multilingual keys (`vn`/`en`).
*   **Helper**: Use `getLoc(obj)` to safely access the active language.
*   **Translation JSON**: All UI static text must be in `src/locales/vi.json` and `en.json` under the `match` namespace.

### B. Mandatory Fallbacks
The system must never show a blank background or broken audio.
*   **Image Fallback**: Use the high-res Unsplash sample portrait if `profilePicUrl` is null.
*   **Audio Fallback**: Ensure the `audioRef` handles null `anthemUrl` gracefully (skip rendering the anthem player).

---

## 4. Hook Ecosystem 🎣

*   **`useTheatricalIntro`**: Manages the multi-stage fade-in sequence (Stage 0 to 4). `introStage === 4` marks the end of the "Show" and gives control back to the user.
*   **`useMatchAudio`**: Controls the Anthem playback, mute state, and global audio context.
*   **`useMatchSuggestion`**: Handles fetching the match data, loading states, and error handling for the API response.
*   **`useScroll`**: Native Framer Motion hook used extensively for the `scrollYProgress` drive of background FX.

---

## 5. Interaction & Conversion Rules 💳

*   **Scroll Locking**: The body must have `overflow: hidden` during Intro Stages 0-3.
*   **Bottom Reveal**: Action buttons (`Like`/`Pass`) **ARE HIDDEN** until `scrollYProgress > 0.99` (absolute 100%). Users must "invest" in the story before they can decide.
*   **Decision Logic**: 
    *   `Like`: Redirects to Stripe/VNPAY payment (`/date-payment`).
    *   `Pass`: Calls `rejectSuggestion` and navigates back to `/dashboard`.

---

## 6. File Reference Map (FSD) 📁

*   **Page**: `src/pages/MatchProfilePage.tsx` (Main Orchestrator)
*   **Components**: `src/features/match/components/`
    *   `MatchHeader.tsx`
    *   `MatchStorySection.tsx` (Generic for Hook, Thesis, Compatibility)
    *   `MatchIntroOverlay.tsx` (The theatrical entrance)
*   **Styles**: Shared CSS variables from `src/styles/design-tokens.css` (Burgundy & Paper theme).
*   **Background FX**: `src/shared/components/CinematicBackground.tsx`
