/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "light-code-highlight-1": "#9beda4",
        "light-code-highlight-2": "#32dd46",
        "dark-code-highlight-1": '#a578bc',
        "dark-code-highlight-2": "#591ead",
      },
    },
  },
  plugins: [],
}