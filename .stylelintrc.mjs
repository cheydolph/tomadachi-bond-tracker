// .stylelintrc.mjs
// Stylelint v17 config for a Next.js / Tailwind CSS v3 project.
//
// globals.css mixes three things:
//   1. Tailwind directives (@tailwind base/components/utilities, @apply)
//   2. CSS custom properties (:root { --bond-0: ... })
//   3. Hand-written component classes (.bond-cell-*, .btn-primary, etc.)
//
// The config is scoped only to *.css files — Tailwind class strings inside
// JSX are handled by prettier-plugin-tailwindcss, not Stylelint.

/** @type {import('stylelint').Config} */
const config = {
  // ── Extends ─────────────────────────────────────────────────────────────────
  extends: [
    // stylelint-config-standard: enforces CSS best practices (no duplicate
    // selectors, no unknown units, consistent shorthand usage, etc.)
    "stylelint-config-standard",

    // stylelint-config-tailwindcss: disables rules that conflict with Tailwind's
    // @tailwind, @apply, @layer, and theme() directives, which standard CSS
    // parsers incorrectly flag as unknown at-rules or properties.
    "stylelint-config-tailwindcss",
  ],

  plugins: [
    // Enforces a consistent declaration order within each rule block.
    // Keeps globals.css readable as it grows.
    "stylelint-order",
  ],

  rules: {
    // ── At-rule handling ─────────────────────────────────────────────────────
    // tailwind-config already disables unknown-at-rule for @tailwind / @apply.
    // @keyframes is standard; @import for Google Fonts is valid CSS.
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "variants",
          "responsive",
          "screen",
          "config",
        ],
      },
    ],

    // ── Selector rules ───────────────────────────────────────────────────────
    // BEM-style flat class names are used throughout (.bond-cell-btn,
    // .mobile-card) — no nesting convention is enforced here.
    "selector-class-pattern": [
      // Allow: .bond-cell-0, .col-header-inner, .fab-safe-bottom, etc.
      // Pattern: lowercase letters, digits, hyphens.
      "^[a-z][a-z0-9]*(-[a-z0-9]+)*$",
      { message: "Class names should be lowercase-hyphen-case." },
    ],

    // Allow ::-webkit-scrollbar and its sub-pseudos used in .matrix-scroll.
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: [
          "webkit-scrollbar",
          "webkit-scrollbar-track",
          "webkit-scrollbar-thumb",
        ],
      },
    ],

    // ── Color rules ──────────────────────────────────────────────────────────
    // Hex values must be either 3, 4, 6, or 8 digits. No shorthand like #fff
    // when a full hex is available — keep values consistent with BOND_CONFIG.hex.
    "color-hex-length": "long",

    // Allow oklch() — used in the spec as the canonical value for gray-800.
    // Stylelint's standard config warns on unknown functions; oklch is CSS4.
    "color-function-notation": null, // disable — allows both rgb() and oklch()

    // ── Value / property rules ───────────────────────────────────────────────
    // Enforce 0 without units (margin: 0, not margin: 0px).
    "length-zero-no-unit": true,

    // Allow CSS custom properties (--bond-0, --cream, etc.) — these are not
    // unknown properties even though linters sometimes flag them.
    "custom-property-pattern": [
      // Allow: --bond-0, --cream, --rose, --bond-safe-bottom, etc.
      "^(bond-[0-9]+|cream|rose|[a-z]+(-[a-z0-9]+)*)$",
      { message: "Custom properties should be lowercase-hyphen-case." },
    ],

    // Warn on duplicate properties within a rule — usually a copy/paste error.
    "declaration-block-no-duplicate-properties": true,

    // Allow vendor-prefixed properties used in .col-header-text (writing-mode,
    // text-orientation) and any future -webkit- additions.
    "property-no-vendor-prefix": null,

    // ── Declaration order (stylelint-order) ─────────────────────────────────
    // Order: positioning → box model → typography → visual → animation → misc.
    // This matches the mental model used throughout globals.css.
    "order/properties-order": [
      // Positioning
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      // Display / box model
      "display",
      "flex",
      "flex-direction",
      "flex-wrap",
      "flex-grow",
      "flex-shrink",
      "flex-basis",
      "justify-content",
      "align-items",
      "align-self",
      "gap",
      "grid-template-columns",
      "grid-column",
      "grid-row",
      "float",
      "clear",
      "width",
      "min-width",
      "max-width",
      "height",
      "min-height",
      "max-height",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "overflow",
      "overflow-x",
      "overflow-y",
      "border",
      "border-top",
      "border-right",
      "border-bottom",
      "border-left",
      "border-width",
      "border-style",
      "border-color",
      "border-radius",
      "border-collapse",
      "border-spacing",
      // Typography
      "font",
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "line-height",
      "letter-spacing",
      "word-spacing",
      "text-align",
      "text-decoration",
      "text-overflow",
      "text-transform",
      "white-space",
      "writing-mode",
      "text-orientation",
      "color",
      // Visual
      "background",
      "background-color",
      "background-image",
      "background-size",
      "background-position",
      "background-repeat",
      "box-shadow",
      "filter",
      "opacity",
      "cursor",
      "pointer-events",
      "user-select",
      "outline",
      // Animation
      "transition",
      "animation",
      "transform",
      "transform-origin",
      // Misc
      "content",
      "resize",
      "appearance",
      "will-change",
    ],
    "order/properties-alphabetical-order": null, // overridden by the manual order above

    // ── Misc ─────────────────────────────────────────────────────────────────
    // max-height: calc(...) and env() expressions are used throughout.
    "function-no-unknown": [true, { ignoreFunctions: ["theme", "env", "max", "oklch"] }],

    // Allow empty rules produced by @tailwind directives expanding at build time.
    "block-no-empty": null,

    // Keyframe selectors: from/to are aliases for 0%/100%.
    "keyframe-selector-notation": null,
  },

  // Scope Stylelint to CSS files only — JSX/TSX Tailwind classes are not CSS.
  files: ["**/*.css"],
  ignoreFiles: ["node_modules/**", ".next/**", "out/**"],
};
export default config;
