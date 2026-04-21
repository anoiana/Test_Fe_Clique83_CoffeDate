---
name: Clique83 Architecture & UI Guidelines (V2 - Optimized)
description: Comprehensive rules for directory structure (FSD), React Query, React Hook Form, and Strict Type Safety for Clique83.
---

# 🏗️ Clique83 Architecture & UI Guidelines (V2)

This project strictly follows a hybrid of **Feature-Sliced Design (FSD)** and **Clean Architecture**, now optimized with **Server State Management (React Query)** and **High-Performance Forms (React Hook Form)**.

## 1. Directory Structure Overview

```text
src/
├── assets/                  # Static assets (images, fonts)
├── features/                # Domain-driven features (BUSINESS LOGIC)
│   ├── authentication/      # Auth domain (Login, Google Auth)
│   ├── match/               # Match profile display & Suggestion logic
│   ├── matching/            # Round 2 Survey & Matching logic
│   ├── onboarding/          # Intake survey & Photo upload
│   ├── payment/             # Payment (PayOS/VNPay) & Membership
│   └── scheduling/          # Availability Grid & Scheduling
├── infrastructure/          # External concerns & API configuration
│   ├── apiClient.ts         # Centralized HTTP client (Generic <T> support)
│   ├── apiConfig.ts         # Environment & Global Mocking flag
│   └── queryClient.ts       # React Query global configuration (Caching)
├── layouts/                 # Application-wide UI layouts
├── pages/                   # Route-level components (COMPOSITION ONLY)
├── shared/                  # Reusable cross-feature modules
│   ├── components/          # Generic UI (Button, Input, ProgressBar)
│   ├── context/             # Global Providers (Auth, Error, Notification)
│   ├── hooks/               # Generic hooks (useLocalStorage, useAsyncAction)
│   └── types/               # STRICT DOMAIN TYPES (domain.ts, models.ts)
├── index.css                # Global CSS, Tailwind v4 directives & Animations
└── i18n.ts                  # Localization configuration
```

## 2. Core Architectural Rules (Strict)

### Rule 1: Pages are "Thin" (Composition Only)
- **Do not** write heavy business logic or large UI components inside `src/pages/`.
- Pages should only compose components from `features/` and use **Custom Hooks** for orchestration.

### Rule 2: Logic Extraction (Mandatory Custom Hooks)
- Business logic (API calls, complex calculations, state transforms) **MUST** live in a Custom Hook (e.g., `useMatchProfileLogic.ts`).
- UI components should only receive data and callbacks from these hooks.

### Rule 3: Strict Type Safety (Zero 'any' Policy)
- NEVER use `any`. Every API response, state, and prop must have a defined interface in `src/shared/types/domain.ts`.
- Use Generic types `<T>` in `apiClient` to ensure type flow from API to UI.

### Rule 5: Mandatory Validation & Instructional UX
- **Validation**: Every survey question must trigger validation when clicking 'Continue'. Use the `<FormError />` component to display errors using the `text-primary` color.
- **Selection Notes**: Every input field or selection group must include a small instructional note (Selection Note) below the label. 
  - Style: `text-[12px]`, `text-primary` (Burgundy), `italic font-serif`.
  - i18n: Always use the `selection_note` key in localization files.

### Rule 6: Mandatory Auto-focus for Inputs
- Every screen/step that requires text input (Input, textarea) **MUST** automatically focus the first input field on mount.
- Implementation: Use the `autoFocus` prop or a `useEffect` with a 500ms delay to ensure the focus happens after page transitions/animations are complete.

---

## 3. Data Fetching & State Management

### A. Server State (React Query)
- **No `useEffect` for API fetching**: Use `useQuery` for GET requests and `useMutation` for POST/PUT/PATCH/DELETE.
- **Caching**: Leverage `staleTime` and `gcTime` in `queryClient.ts` to provide a "Native App" feel (instant back-navigation).
- **Global Loading**: Integrate `showLoader()` from `LoadingContext` within React Query's `onMutate` or `useAsyncAction`.

### B. Form Management (React Hook Form)
- **High Performance**: Use `react-hook-form` for complex forms (Surveys, Auth).
- **Isolated Re-renders**: Use `useWatch` or `useFormContext` in sub-components to ensure only the changed field re-renders.
- **Validation**: Use **Zod** schemas for runtime validation and type inference.

---

## 4. UI/UX & Design System (The Ritual)

- **Primary Burgundy:** `var(--c-primary)` (`#7A2E2E`). Use `text-primary`, `bg-primary`, `border-primary`.
- **Background:** Paper Mode `bg-background` (`#F4EBDD`).
- **Surface:** Warm Paper `bg-surface` (`#EFE2D0`) for cards and inputs.
- **Typography:** 
  - **Headings:** `font-serif` (Noto Serif) for a vintage, premium feel.
  - **Body:** `font-sans` (Inter) for clarity.
- **Components:** Use Capsule/Pill shapes (`radius-pill-lg`) and soft paper shadows (`shadow-paper`).

### Animation Standards:
1. **Theatrical Reveal**: Start with `opacity: 0` and subtle scale/y-offset, then reveal into the "Paper" canvas.
2. **Framer Motion**: Used for **Scroll-Driven** animations, complex parallax, and interactive intro sequences.
3. **Page Transitions**: Always use the global `<PageTransition>` component.

---

## 5. Security & Internationalization (i18n)

- **Auth Security**: The project is prepared for **HttpOnly Cookies**. `apiClient` includes `credentials: 'include'`. Avoid storing sensitive data in `localStorage` long-term.
- **Dual-Language**: Every string must exist in both `en` and `vi` locales.
- **Natural Vietnamese**: Prioritize premium, professional phrasing (avoid literal translations).

---

## 6. AI-Readability Guidelines
1. **Self-Documenting Code**: Start every file with a purpose comment.
2. **"Why" Over "What"**: Comments should explain business intent (e.g., `// 500ms delay to match cinematic fade-in speed`).
3. **Step-by-Step Blocks**: Break down complex API mapping with numbered comments.
4. **Zero Commented-Out Code**: NEVER leave old or unused code in comments. If it's not used, delete it. Git handles the history.

---

## 7. Error Handling Standards (Multi-Language)

Every backend error must be handled gracefully using the centralized translation system:

1. **Centralized Dictionary**: Add all backend error codes to `src/locales/{en|vi}/error_codes.json`.
2. **Error Naming**: Backend error codes must be in `UPPER_SNAKE_CASE` (e.g., `EMAIL_TAKEN`, `INVALID_OTP`).
3. **Display Methods**:
    - **Inline Errors (Forms)**: Always use the shared **`<FormError />`** component (located in `src/shared/components/`).
      Usage: `<FormError error={error} fallback={t('optional.fallback')} />`
    - **Global Toasts**: Use the `useError` or `useNotification` hooks:

      `const { showError } = useError(); showError('ERROR_CODE');`
4. **Fallback Policy**: Always provide a generic fallback message if the error code is not found in the dictionary.

---

## 8. Compact Ritual UI Standards (Mobile First)

To maintain a premium, space-efficient cinematic experience:

1. **Global Spacing**: Use `--space-2xl` (**20px / 1.25rem**) for vertical gaps between main survey questions (`space-y-12` is mapped to this).
2. **Header Layout**:
    - **Header Gap**: `mb-4` (16px) between the divider line and the first question.
    - **Divider Gap**: `mt-4` (16px) above the horizontal line.
    - **Title/Desc Gap**: `mb-2` (8px).
3. **Chip/Option Layout**:
    - **Grid Strategy**: Use `flex flex-wrap gap-2` in `SurveyFieldGroup`.
    - **Size**: `OptionButton` must be compact (`py-2.5 px-4`, font-size `12px-14px`).
    - **Density**: Aim for **3 columns** per row on mobile for short chips.
4. **Internal Question Spacing**: Use `mb-6` for question containers and `mb-3` for question labels.



