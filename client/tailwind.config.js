/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d' },
        sidebar: '#0f1923',
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'glow': '0 0 24px rgba(22,163,74,0.3)',
        'glow-blue': '0 0 24px rgba(99,102,241,0.3)',
        'card': '0 2px 24px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 40px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'dots': "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
        'grid': "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: { 'dots': '20px 20px', 'grid': '40px 40px' },
    },
  },
  plugins: [],
};
