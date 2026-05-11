// prettier.config.mjs
// Prettier owns all formatting decisions — ESLint never touches whitespace/style.
// prettier-plugin-tailwindcss auto-sorts className strings using the official
// Tailwind class order. It runs as a post-process after Prettier's own formatting.

/** @type {import("prettier").Config} */
const config = {
  // ── Core formatting ──────────────────────────────────────────────────────────
  printWidth: 90,         // Matches the 90-char soft limit used in this codebase.
                          // Longer than the Prettier default (80) to avoid excessive
                          // wrapping in JSX className strings.
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,     // Keep double quotes — consistent with JSX attribute style.
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "es5",   // Trailing commas in objects/arrays, not function params.
  bracketSpacing: true,   // { foo: bar } not {foo: bar}
  bracketSameLine: false, // JSX closing > goes on its own line.
  arrowParens: "always",  // (x) => x, not x => x — consistent and easier to extend.
  endOfLine: "lf",        // LF everywhere; CRLF is a Windows artifact.

  // ── Tailwind class sorting ───────────────────────────────────────────────────
  // prettier-plugin-tailwindcss sorts className/class strings using the same
  // order Tailwind's own VS Code extension recommends. Keeps diffs minimal and
  // makes class lists scannable (layout → spacing → typography → color → state).
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./tailwind.config.js",

  // ── Per-language overrides ───────────────────────────────────────────────────
  overrides: [
    {
      // JSON files: compact single-line style for package.json et al.
      files: ["*.json"],
      options: { printWidth: 120 },
    },
    {
      // CSS / globals.css: wider print width to avoid splitting long background-image
      // data URIs mid-value (which makes them harder to diff).
      files: ["*.css"],
      options: { printWidth: 120, singleQuote: false },
    },
    {
      // Markdown: preserve intentional line breaks (prose wrap = off).
      files: ["*.md"],
      options: { proseWrap: "preserve" },
    },
  ],
};

export default config;
