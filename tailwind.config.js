/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* CoffeeDate Ritual Palette */
        background: {
          paper: 'var(--c-background)', /* #F4EBDD */
          warm: 'var(--c-surface)',    /* #EFE2D0 */
          dark: '#1A1411',              /* Deep Roast Fallback */
        },
        primary: 'var(--c-primary)',    /* #7A2E2E - Burgundy */
        ink: 'var(--c-text-main)',      /* #2F241D - Primary Text */
        kraft: 'var(--c-highlight)',    /* #CDAA7D - Highlight */
        divider: 'var(--c-divider)',    /* #D5C2AE - Line */
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '3xl': '1.5rem',  /* 24px */
        '4xl': '2rem',    /* 32px */
      },
      animation: {
        'ritual-fade-up': 'ritual-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'ritual-paper-pulse': 'ritual-paper-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'ritual-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ritual-paper-pulse': {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.05' },
        }
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/p6.png')", /* Subtle paper fiber pattern */
      }
    },
  },
  plugins: [],
}
