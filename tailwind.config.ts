import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:    '#0a0f1e',
        cyan:    '#00ffe0',
        surface: '#1a2540',
        alert:   '#ff4d6d',
        gold:    '#ffd700',
        green:   '#00ff88',
      },
      fontFamily: {
        sans:  ['var(--font-space-grotesk)', 'sans-serif'],
        mono:  ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'scan':        'scan 4s linear infinite',
        'flicker':     'flicker 0.15s infinite',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 5px #00ffe0, 0 0 10px #00ffe0' },
          '100%': { boxShadow: '0 0 20px #00ffe0, 0 0 40px #00ffe0, 0 0 60px #00ffe080' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'grid': 'linear-gradient(rgba(0,255,224,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,224,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}

export default config
