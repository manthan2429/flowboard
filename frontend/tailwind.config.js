/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1F1D",
        forest: "#132A28",
        forestLight: "#1C3A37",
        paper: "#F2EFE7",
        gold: "#E8B34E",
        goldDim: "#C99A42",
        rust: "#B5562C",
      },
      fontFamily: {
        display: ["Manrope", "system-ui", "-apple-system", "sans-serif"],
        body: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
