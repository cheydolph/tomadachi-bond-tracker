// eslint.config.mjs — ESLint v9 flat config
// Rule of thumb: errors block CI, warnings surface in editor only.
// Nothing is disabled purely for convenience; every override is justified inline.

import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { createRequire } from "module";

// eslint-config-next 14 ships as a native flat-config array and pre-registers:
// react, react-hooks, import, jsx-a11y, @typescript-eslint, @next/next.
// We spread it first, then layer our own rules on top — no plugin re-declaration.
const require = createRequire(import.meta.url);
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

export default [
  // ── Global ignores ──────────────────────────────────────────────────────────
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "*.config.js", // next.config.js, postcss.config.js, tailwind.config.js
      "eslint.config.mjs",
    ],
  },

  // ── Next.js core-web-vitals preset ──────────────────────────────────────────
  // Includes: react, react-hooks, import, jsx-a11y, @typescript-eslint, @next/next.
  // core-web-vitals adds stricter rules on top of the base "next" preset.
  ...nextCoreWebVitals,

  // ── TypeScript files — additional rules layered on top of next's preset ─────
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      // ── TypeScript ───────────────────────────────────────────────────────────
      ...tsPlugin.configs["recommended"].rules,

      // Warn instead of error on `any` — the codebase uses `unknown` for
      // untrusted input (storage.ts) but some React event handlers need it.
      "@typescript-eslint/no-explicit-any": "warn",

      // Unused vars: prefix with _ to explicitly mark intentional non-use.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Enforces explicit return types on exported functions — helps catch
      // accidental undefined returns in data transformers like storage.ts.
      "@typescript-eslint/explicit-module-boundary-types": "warn",

      "@typescript-eslint/prefer-as-const": "error",

      // Non-null assertions (!) are a code smell; prefer optional chaining.
      "@typescript-eslint/no-non-null-assertion": "warn",

      // ── React ────────────────────────────────────────────────────────────────
      // React 17+ JSX transform — no need to import React for JSX.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // TypeScript handles this

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",

      "react/self-closing-comp": ["warn", { component: true, html: true }],
      "react/jsx-no-useless-fragment": "warn",

      // ── Accessibility ────────────────────────────────────────────────────────
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      // Plain <img> tags (used in the header banner) must have alt text.
      "jsx-a11y/alt-text": "error",

      // ── Import order ─────────────────────────────────────────────────────────
      // Groups: built-ins → external packages → internal (@/) → relative
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [{ pattern: "@/**", group: "internal", position: "before" }],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "import/no-cycle": "warn",

      // ── General quality ──────────────────────────────────────────────────────
      // console.info is allowed — used in storage.ts for migration reporting.
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-nested-ternary": "warn",
      "no-implicit-coercion": "warn",
    },
  },

  // ── Test / story files (looser rules) ───────────────────────────────────────
  // Uncomment when tests are added.
  // {
  //   files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"],
  //   rules: {
  //     "@typescript-eslint/no-explicit-any": "off",
  //     "no-console": "off",
  //   },
  // },
];
