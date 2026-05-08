/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fredoka'", "sans-serif"],
        body: ["'Nunito'", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#FFFDF7",
          100: "#FEF9F0",
          200: "#FDF0DC",
        },
        bond: {
          stranger: "#E5E7EB",
          acquaint: "#BBF7D0",
          friend: "#FEF08A",
          sweet: "#FECDD3",
        },
      },
      animation: {
        "pop-in": "popIn 0.15s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-in": "slideIn 0.2s ease forwards",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
