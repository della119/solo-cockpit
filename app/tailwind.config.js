/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Inter for Latin; system CJK fonts handle Chinese (PingFang SC on Mac, YaHei on Windows)
        sans: ['Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '"Noto Sans SC"', 'sans-serif'],
        // JetBrains Mono for revenue numbers, year labels, stats
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
