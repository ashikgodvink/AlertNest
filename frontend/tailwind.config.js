/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          primary: '#0d9488',
          dark: '#0f766e',
          darker: '#115e59',
          light: '#99f6e4',
          lighter: '#ccfbf1',
        }
      }
    },
  },
  plugins: [],
}
