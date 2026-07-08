import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#050506',
          900: '#0a0a0c',
          850: '#0e0e11',
          800: '#141417',
          700: '#1c1c20',
        },
        gold: {
          200: '#f3e2b8',
          300: '#e8c882',
          400: '#d4af63',
          500: '#c9a35b',
          600: '#a5813f',
          700: '#7d6130',
        },
        bone: {
          DEFAULT: '#ece7dd',
          dim: '#9a938a',
          faint: '#5d5851',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
        widest3: '0.5em',
      },
    },
  },
  plugins: [],
}

export default config
