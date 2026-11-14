/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum:  '#1a0b1f',
        wine:  '#3a1233',
        rose:  '#ff7eb6',
        blush: '#ffd6e0',
        gold:  '#f5d089',
        cream: '#fff7f0',
      },
      fontFamily: {
        serif:  ['"Cormorant Garamond"', 'serif'],
        sans:   ['Quicksand', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
}
