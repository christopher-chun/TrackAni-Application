/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#59e7ab",
        "primary-dull": "#6db4f2",
      }
    },
  },
  plugins: [],
}

