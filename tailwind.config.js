/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                      // ✅ Include this if you're using Vite
    "./src/**/*.{js,jsx,ts,tsx}",        // ✅ Already good
  ],
  safelist: ['bg-[#725CAD]'],
  darkMode: 'class',                     // ✅ Needed for shadcn dark mode
  theme: {
    extend: {
      colors: {
        purple: {
          300: '#D6BCFA',
          700: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),       // ✅ Add this line for shadcn UI
  ],
}
