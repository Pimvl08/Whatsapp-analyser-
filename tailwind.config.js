/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#16233A',
          900: '#101a2c',
          800: '#16233A',
          700: '#1f3150',
          600: '#2c4067',
        },
        accent: {
          DEFAULT: '#C99A55',
          dark: '#B5793A',
          soft: '#E7D2AC',
        },
        paper: '#F6F7F9',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(16,26,44,0.04), 0 8px 24px -12px rgba(16,26,44,0.18)',
        float: '0 20px 60px -24px rgba(16,26,44,0.45)',
        page: '0 10px 40px -12px rgba(16,26,44,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
