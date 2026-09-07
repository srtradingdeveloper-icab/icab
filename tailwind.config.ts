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
        y: {
          DEFAULT: '#F5C518',
          dark: '#C9990A',
          pale: '#FFFBEB',
        },
        brand: {
          black: '#0F0E0B',
          near: '#1C1A14',
          text: '#1A1814',
          mid: '#6B6450',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        '2lg': '14px',
      },
    },
  },
  plugins: [],
  darkMode: 'media',
}
export default config
