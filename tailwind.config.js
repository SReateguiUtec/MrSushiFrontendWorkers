/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark canvas
        ink:    '#0a0a0c',
        canvas: '#0f0f12',
        surface: '#16161a',
        'surface-2': '#1c1c22',
        'surface-3': '#242429',
        border:  '#2a2a32',
        'border-2': '#323239',
        // Brand
        coral:   '#ef5747',
        'coral-dim': '#3a1a17',
        // Text
        'text-1': '#f0eff4',
        'text-2': '#9898a8',
        'text-3': '#5c5c6e',
        // Status accents
        received: '#5b6fd8',
        cooking:  '#ed8a35',
        packing:  '#8b5bb2',
        delivery: '#1f9b83',
        delivered:'#4a5568',
      },
      fontFamily: {
        sans:      ['Inter', 'sans-serif'],
        display:   ['DM Serif Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.3)',
        'card-hover': '0 1px 3px rgba(0,0,0,.5), 0 12px 32px rgba(0,0,0,.45)',
        glow:   '0 0 20px rgba(239,87,71,.18)',
        'glow-sm': '0 0 10px rgba(239,87,71,.12)',
      },
      backgroundImage: {
        'gradient-surface': 'linear-gradient(135deg, #16161a 0%, #0f0f12 100%)',
        'gradient-card':    'linear-gradient(135deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.015) 100%)',
        'gradient-coral':   'linear-gradient(135deg, #ef5747 0%, #c0382a 100%)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'bar-grow': {
          from: { transform: 'scaleY(.05)' },
          to:   { transform: 'scaleY(1)' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1' },
          '50%':      { opacity: '.4' },
        },
        'shimmer': {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up .24s cubic-bezier(.16,1,.3,1) both',
        'bar-grow': 'bar-grow .65s cubic-bezier(.16,1,.3,1) both',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
