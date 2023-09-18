/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        "custom-1":
          "0px 0px 2px 0px rgba(60, 64, 67, 0.3) ,0px 2px 6px 0px  rgba(60, 64, 67, 0.15)",
      },
      screens: {
        xxs: "280px",
        xs: "375px",
      },
      colors: {
        "customGreen": { 100: "rgb(0, 120, 0)" },
        "customRed": { 100: "rgb(255, 88, 88)" },
      },
    },
  },
  plugins: [require("preline/plugin")],
};
