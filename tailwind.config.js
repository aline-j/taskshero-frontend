/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        "card-bg": "#fff",
        "button-bg": "#0077ff",
        "dark-button-bg": "#0044bb",
        "dark-button-hover-bg": "#0044bb",
        "light-button-bg": "#bbb",
        "light-button-hover-bg": "#999",
        "border-color": "rgba(0, 0, 0, 0.08)",
      },
      spacing: {
        "card-width": "200px",
        "card-width-md": "100px",
        "card-height": "280px",
      },
      borderRadius: {
        "card-radius": "14px",
      },
      boxShadow: {
        custom: "0 6px 20px rgba(5, 4, 4, 0.12)",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
