/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-purple': '#6E00FF',
                'cyber-black': '#000000',
                'cyber-neon': '#C560FF',
                'cyber-dark': '#0A0A0A',
                'cyber-gray': '#1A1A1A',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            backgroundImage: {
                'cyber-gradient': 'linear-gradient(135deg, #6E00FF 0%, #000000 100%)',
            },
        },
    },
    plugins: [],
}
