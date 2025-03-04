module.exports = {
  // ...
  darkMode: "selector",
  content: ["./src/**/*.{html,ts,scss,css}", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-primeui")],
};
