/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'Satoshi'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        forge: {
          50: "#fff7ed",
          100: "#ffedd5",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          900: "#7c2d12",
        },
        dark: {
          50: "#f8f8f8",
          100: "#e8e8e8",
          200: "#c8c8c8",
          400: "#888",
          600: "#444",
          700: "#2a2a2a",
          800: "#1a1a1a",
          900: "#0f0f0f",
          950: "#080808",
        },
      },
      backgroundImage: {
        "forge-gradient": "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
        "dark-gradient": "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)",
        "card-gradient": "linear-gradient(135deg, #1a1a1a 0%, #222 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        pulse2: "pulse2 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        pulse2: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(249,115,22,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(249,115,22,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
