/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#2d2d3a',
        'bg-secondary': '#3a3a48',
        'text-primary': '#e2e8f0',
        'text-secondary': '#94a3b8',
        'accent-primary': '#4a6fa5',
        'accent-secondary': '#5d87c6',
        'danger': '#e53e3e',
        'success': '#38a169',
        'card-bg': '#35353f',
        'input-bg': '#2a2a35',
      },
      borderRadius: {
        'custom': '8px',
      },
      boxShadow: {
        'custom': '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
