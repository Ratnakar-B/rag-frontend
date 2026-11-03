/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#172321",
        muted: "#77827e",
        canvas: "#f5f7f5",
        brand: "#16866f",
      },
      boxShadow: {
        panel: "0 2px 12px rgba(27, 47, 41, 0.045)",
      },
    },
  },
  plugins: [],
};
