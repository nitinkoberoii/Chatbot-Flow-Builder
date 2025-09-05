/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Add missing radius variable
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      colors: {
        border: "var(--color-border)", /* light gray */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* blue-600 */
        background: "var(--color-background)", /* warm off-white */
        foreground: "var(--color-foreground)", /* deep charcoal */
        primary: {
          DEFAULT: "var(--color-primary)", /* blue-600 */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* slate-500 */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-600 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* slate-100 */
          foreground: "var(--color-muted-foreground)", /* slate-500 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* violet-600 */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* deep charcoal */
        },
        card: {
          DEFAULT: "var(--color-card)", /* white */
          foreground: "var(--color-card-foreground)", /* deep charcoal */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-600 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-600 */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-600 */
          foreground: "var(--color-error-foreground)", /* white */
        },
        // Canvas specific colors
        canvas: {
          DEFAULT: "var(--color-canvas)", /* warm off-white */
          grid: "var(--color-canvas-grid)", /* light gray */
        },
        node: {
          DEFAULT: "var(--color-node-default)", /* white */
          selected: "var(--color-node-selected)", /* blue-600 */
        },
        connection: {
          valid: "var(--color-connection-valid)", /* emerald-600 */
          invalid: "var(--color-connection-invalid)", /* red-600 */
        },
        panel: {
          DEFAULT: "var(--color-panel)", /* white */
          border: "var(--color-panel-border)", /* light gray */
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevation-2': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0 8px 25px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'dash': 'dash 1s linear infinite',
        'pulse-error': 'pulse-error 2s infinite',
        'slide-in-left': 'slideInLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-out-left': 'slideOutLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        dash: {
          'to': { 'stroke-dashoffset': '-10' }
        },
        'pulse-error': {
          '0%, 100%': { 'box-shadow': '0 4px 12px rgba(220, 38, 38, 0.15)' },
          '50%': { 'box-shadow': '0 4px 12px rgba(220, 38, 38, 0.3)' }
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      transitionDuration: {
        'micro': '150ms',
        'panel': '250ms',
        'canvas': '400ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      spacing: {
        'header': '60px',
        'panel': '300px',
      },
      zIndex: {
        'header': '1000',
        'header-dropdown': '1010',
        'panel': '900',
        'panel-overlay': '910',
        'canvas-controls': '800',
        'modal': '2000',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}