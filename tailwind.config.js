/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(0 0% 90%)",
        input: "hsl(0 0% 90%)",
        ring: "hsl(0 0% 10%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(0 0% 6%)",
        muted: {
          DEFAULT: "hsl(0 0% 96%)",
          foreground: "hsl(0 0% 40%)",
        },
        gold: {
          DEFAULT: "#b8945a",
          dark: "#8a6d3b",
          light: "#d4b07a",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
