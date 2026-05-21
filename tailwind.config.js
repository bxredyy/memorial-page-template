/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#F2F4EE",
          100: "#E2E8D9",
          200: "#C7D1B9",
          300: "#A9B999",
          400: "#9DB096",
          500: "#86997D",
          600: "#6B8064",
          700: "#556650",
          800: "#3F4C3C",
        },
        cream: {
          50: "#FBF8F1",
          100: "#FAF6EE",
          200: "#F3ECDC",
          300: "#E9DFC7",
        },
        ink: {
          900: "#2F2A24",
          800: "#403A33",
          700: "#5A5249",
          500: "#7A7167",
        },
        copper: {
          400: "#D4B68B",
          500: "#C9A77C",
          600: "#B08A5E",
        },
      },
      fontFamily: {
        script: ["'Pinyon Script'", "cursive"],
        display: ["'Cormorant Garamond'", "serif"],
        serif: ["'Lora'", "Georgia", "serif"],
      },
      boxShadow: {
        polaroid:
          "0 1px 2px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
