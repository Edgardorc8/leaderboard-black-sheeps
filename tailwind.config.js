/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        dtodo: {
          bg: '#0f0a1c',
          'bg-mid': '#150e2a',
          'bg-deep': '#090514',
          purple: '#a855f7',
          pink: '#ec4899',
          sidebar: '#0d0919',
        },
        neon: {
          green: '#22c55e',
          gold: '#eab308',
          silver: '#94a3b8',
          bronze: '#cd7f32',
          pink: '#f472b6',
        },
      },
      boxShadow: {
        'neon-gold': '0 0 30px rgba(234,179,8,0.4)',
        'neon-silver': '0 0 20px rgba(148,163,184,0.3)',
        'neon-bronze': '0 0 20px rgba(205,127,50,0.3)',
        'neon-purple': '0 0 25px rgba(168,85,247,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
