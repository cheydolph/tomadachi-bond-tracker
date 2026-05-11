/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Safelist: classes assembled at runtime from BOND_CONFIG (e.g. cfg.textClass,
  // cfg.bgClass) are never seen as literal strings by Tailwind's JIT scanner and
  // would be purged in production without this explicit list.
  safelist: [
    // Level 0 — Strangers (gray)
    "text-gray-500", "bg-gray-200", "border-gray-300",
    // Level 1 — Acquaintances (emerald)
    "text-emerald-700", "bg-emerald-200", "border-emerald-300",
    // Level 2 — Friends (yellow)
    "text-yellow-700", "bg-yellow-200", "border-yellow-300",
    // Level 3 — Sweethearts (pink)
    "text-pink-700", "bg-pink-200", "border-pink-300",
    // Level 4 — Family (orange)
    "text-orange-700", "bg-orange-200", "border-orange-300",
    // Level 5 — One-Sided Love (purple)
    "text-purple-700", "bg-purple-200", "border-purple-300",
    // Level 6 — Exes (dark gray)
    // textClass is gray-100 (light) for contrast on the dark gray-800 background.
    "text-gray-100", "bg-gray-800", "border-gray-700",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fredoka'", "sans-serif"],
        body: ["'Nunito'", "sans-serif"],
      },
      // Note: the former `bond.*` and `cream.*` color tokens were removed (P2-17).
      // Bond colours are now owned by globals.css (.bond-cell-N) and BOND_CONFIG.hex.
      // The cream background is applied via inline style / CSS variable --cream.
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
