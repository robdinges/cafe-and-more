/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f5efe6',
          200: '#d2baa2',
          400: '#ad7f5f',
          700: '#5a3d2b',
          900: '#1f1612',
        },
        night: {
          950: '#090a0d',
          900: '#0d1117',
          800: '#151b25',
          700: '#1f2937',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 12px 30px rgba(0,0,0,0.45)',
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}

