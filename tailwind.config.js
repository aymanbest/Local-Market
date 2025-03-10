/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'staatliches': ['Staatliches', 'serif'],
        'recoleta': ['Recoleta', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'loading-bar': 'loading 1s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'spin-reverse': 'spin-reverse 1s linear infinite',
        'slide-down': 'slide-down 0.3s ease-out',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(1rem)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-1rem)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
      },
      scale: {
        '102': '1.02',
      },
      colors: {
        primary: {
          50: 'rgb(240, 253, 244)',
          100: 'rgb(220, 252, 231)',
          200: 'rgb(187, 247, 208)',
          300: 'rgb(134, 239, 172)',
          400: 'rgb(74, 222, 128)',
          500: 'rgb(34, 197, 94)',
          600: 'rgb(22, 163, 74)',
          700: 'rgb(21, 128, 61)',
          800: 'rgb(22, 101, 52)',
          900: 'rgb(20, 83, 45)',
        },
        cashapp: '#00D632',
        bitcoin: '#F7931A',
        bgGrey: '#1e1e1e',
        mainBlack: '#0a0a0a',
        inputGrey: '#2f2f2f',
        bioGreen: '#22c55e',
        borderGrey: '#6c6c6c',
        primary: 'var(--color-primary)',
        primaryHover: 'var(--color-primary-hover)',
        background: 'var(--color-background)',
        headerBg: 'var(--color-header-bg)',
        cardBg: 'var(--color-card-bg)',
        text: 'var(--color-text)',
        cardBgAdd: 'var(--color-card-bg-add)',
        textSecondary: 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        inputBg: 'var(--color-input-bg)',
        'gray-750': '#2d374b',
        'gray-800': '#1f2937',
        'gray-900': '#111827',
        foreground: 'var(--foreground)',
        purple: {
          500: '#A62BDA',
        },
        cyan: {
          500: '#31B3CC',
        },
        amber: {
          500: '#FF9900',
        },
        orange: {
          500: '#F46036',
        },
        pink: {
          500: '#ED45CD',
        },
      },
      backgroundColor: {
        'gray-800': '#1f2937',
        'gray-900': '#111827',
      }
    },
  },
  plugins: [],
}