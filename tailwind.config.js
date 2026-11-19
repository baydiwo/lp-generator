/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.html",
    "./*.html"
  ],
  theme: {
    screens: {
      'xxs': '360px',
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
          DEFAULT: '#4f46e5',
          light: '#818cf8',
          dark: '#3730a3',
        },
        accent: {
          light: '#fde68a',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        surface: {
          DEFAULT: '#0f172a',
          card: '#1e293b',
          elevated: '#334155',
          border: '#334155',
          muted: '#94a3b8',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        'brand-gradient': 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #3b82f6 100%)',
        'accent-gradient': 'linear-gradient(135deg, #d97706 0%, #f59e0b 45%, #fbbf24 100%)',
        'brand-glow': 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.22), transparent 55%)',
      },
      boxShadow: {
        'soft': '0 20px 60px rgba(0, 0, 0, 0.35)',
        'brand': '0 0 30px rgba(99, 102, 241, 0.25)',
        'brand-strong': '0 0 45px rgba(99, 102, 241, 0.4)',
        'accent': '0 0 30px rgba(245, 158, 11, 0.25)',
        'accent-strong': '0 0 45px rgba(245, 158, 11, 0.4)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.08)',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
