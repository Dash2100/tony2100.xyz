/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ['"Noto Sans"', '"Noto Sans TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
