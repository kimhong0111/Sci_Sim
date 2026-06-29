/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff0000",
        "on-primary": "#ffffff",
        background: "#ffffff",
        surface: "#ffffff",
        "on-surface": "#000000",
        outline: "#000000",
      },
      borderRadius: {
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        full: "0",
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
