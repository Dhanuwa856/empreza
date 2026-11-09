/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0C0C0C",
        amberGold: "#E7B736",
        sunsetOrange: "#FF6B00",
        pureWhite: "#FFFFFF",
      },
      fontFamily: {
        display: ["'Syne'", "'Oswald'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
