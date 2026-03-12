/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Essential for next-themes
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Added strictly in case you have a src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}