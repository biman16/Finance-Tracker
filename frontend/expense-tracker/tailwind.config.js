/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      screens: {
        "lg": "1080px",
        "3xl": "1920px",
      },
      colors: {
        primary: "#875cf5",
      },
    },
  },
  plugins: [],
}