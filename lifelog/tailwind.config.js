/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto': ['var(--font-noto)', 'sans-serif'],
      },
      boxShadow: {
        'nav': '0 4px 60px 0 rgba(45, 115, 154, 0.5)',
        'inner': 'inset 5px 5px 10px 0 rgba(118, 145, 175, 0.2)',
      },
      colors: {
        'primary-bg': '#EDF5FA',
        'card-bg': '#f7fafd',
        'accent-bg': '#DBECF8',
        'text-primary': '#4E5969',
        'text-link': '#538AD9',
      },
    },
  },
  plugins: [],
}