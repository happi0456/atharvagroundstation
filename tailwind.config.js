/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas:  '#0D1117',
        surface: '#161B22',
        border:  '#30363D',
        gold:    '#E3B341',
        'gold-muted': '#B8912A', //used quotes cus code broke without it
        ink:     '#E6EDF3',
        muted:   '#7D8590',
        dim:     '#484F58',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}