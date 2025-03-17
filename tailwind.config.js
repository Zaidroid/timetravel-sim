/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
        serif: ['Georgia', 'serif'], // Added for news articles
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        typewriter: 'typewriter 4s steps(40) 1s 1 normal both', // Added for typewriter effect
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 10px rgba(59, 130, 246, 0.3)', // Added for input glow effect
        'glow-hover': '0 0 15px rgba(59, 130, 246, 0.5)', // Added for widget hover
      },
      transitionProperty: {
        transform: 'transform', // For hover effects
        'shadow-transform': 'box-shadow, transform', // Combined for hover
      },
    },
  },
  plugins: [],
};
