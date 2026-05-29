/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161a1d",
        paper: "#f7f5ef",
        moss: "#4f6f52",
        coral: "#d66b4d",
        steel: "#476a7a"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(22, 26, 29, 0.08)"
      }
    }
  },
  plugins: []
};
