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
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
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
      },
      scale: {
        '102': '1.02',
      },
      colors: {
        cashapp: '#00D632',
        bitcoin: '#F7931A',
        bgGrey : '#1e1e1e',
        mainBlack : '#0a0a0a',
        inputGrey : '#2f2f2f',
        bioGreen : '#22c55e',
        borderGrey : '#6c6c6c',
        primary: 'var(--color-primary)',
        primaryHover: 'var(--color-primary-hover)',
        background: 'var(--color-background)',
        headerBg: 'var(--color-header-bg)',
        cardBg: 'var(--color-card-bg)',
        text: 'var(--color-text)',
        textSecondary: 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        inputBg: 'var(--color-input-bg)',
      },
    },
  },
  plugins: [],
}