/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#bd66ff', // Lighter Purple (Main Text)
          'green-bright': '#e0a3ff', // Very Light Purple (Highlights)
          dark: '#05000a', // Deep Purple/Black
          panel: '#0f0518', // Deep Purple Panel
          verif: '#00ccff', // Cyan stays for Verified/Contrast
          alert: '#ff0033', // Alert Red
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      backgroundImage: {
        'scanlines': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      }
    },
  },
  plugins: [],
}
