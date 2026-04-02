/** @type {import('tailwindcss').Config} */
export default {
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
        "card-height": "320px",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
